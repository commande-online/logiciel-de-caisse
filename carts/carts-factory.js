(function(){
    'use strict';

    angular.module('carts', [ 'ngMaterial' ])
        .factory("Cart", ['$http', '$filter', '$rootScope', '$timeout', 'productService', 'User', '$q', function($http, $filter, $rootScope, $timeout, productService, User, $q) {
            var URL_API = DOMAIN_API + "/api/1/bo-management/carts/";
            var MAX_PER_PAGE = 100;


            function Cart(_id, site, amount, vat, products, date, user, delivery_partner, created_by, created_from, status, status_text, shipping, billing, delivery_time, created_at, payments, last_refresh) {
                this.constructor(_id, site, amount, vat, products, date, user, delivery_partner, created_by, created_from, status, status_text, shipping, billing, delivery_time, created_at, payments, last_refresh);
            }
            Cart.prototype.constructor = function(_id, site, amount, vat, products, date, user, delivery_partner, created_by, created_from, status, status_text, shipping, billing, delivery_time, created_at, payments, last_refresh) {
                this._id = _id;
                this.site = site;
                if(amount == undefined) {
                    this.amount = 0;
                } else {
                    this.amount = amount;
                }
                if(vat == undefined) {
                    this.vat = 0;
                } else {
                    this.vat = vat;
                }
                if(date && date < 10000000000)
                    this.date = date * 1000;
                else
                    this.date = date;
                this.user = user;

                if(products == undefined) {
                    this.products = [];
                } else {
                    this.products = products;
                }

                if(payments == undefined) {
                    this.payments = [{amount: 0}];
                } else {
                    this.payments = payments;
                    this.payments.push({});
                }

                this.delivery_partner = delivery_partner;
                this.created_by = created_by;
                this.created_from = created_from;
                if(created_at != undefined)
                    this.created_at = new Date(created_at * 1000);
                this.status = status ? parseInt(status) : 2;
                this.status_text = status_text;
                this.shipping = shipping;
                this.billing = billing;
                if(delivery_time == undefined) {
                    this.delivery_time = new Date();
                } else
                    this.delivery_time = new Date(delivery_time * 1000);

                this.parsed = false;

                this.CONSTANTS_STATUS = [
                    {id: 1, label: "Livrée"},
                    {id: 2, label: "En attente du commerçant"},
                    {id: 21, label: "En préparation"},
                    {id: 22, label: "En cours de livraison"},
                    {id: 3, label: "En attente du client"},
                    //{id: 4, label: "En attente de paiement"},
                    {id: 10, label: "Remboursée"}
                    /*{id: 5, label: "Supprimée"},
                     {id: 12, label: "En attente de confirmation du paiement"},
                     {id: 11, label: "Remboursement en cours"},
                     {id: 9, label: "En erreur"},
                     {id: 51, label: "Expirée"},
                     {id: 52, label: "Archivée"},
                     {id: 6, label: "Annulée"},*/
                ];
                this.CONSTANTS_PAYMENT_PROVIDER = [
                    {id: "CASH", label: "Cash"},
                    {id: "CHECK", label: "Chèque"},
                    {id: "TPE", label: "Terminal de payment électronique"},
                    {id: "TR", label: "Ticket Restaurant"},
                    {id: "FIDELITY_POINTS", label: "Point de fidélité"},
                    {id: "WIRETRANSFER", label: "Virement bancaire"}
                    /*{id: "PAYPAL", label: "PAYPAL"},
                     {id: "CB", label: "Carte bleu"},
                     {id: "CC", label: "Carte de Crédit"},*/
                ];

                if(last_refresh) {
                    this.last_refresh = last_refresh
                } else {
                    var dateUpdate = new Date();
                    this.last_refresh = dateUpdate.getTime();
                }

            };
            Cart.prototype.parse = function() {
                var returnValue = $q.defer();

                // Update the user
                if(this.user)
                    this.user = User.build(this.user);

                // Update the creating user
                if(this.created_by)
                    this.created_by = User.build(this.created_by);

                // Flag
                this.parsed = true;

                var products = this.products;
                this.products = [];
                var _this = this;
                var i = 0;
                var n = 0;
                for (var j = 0; j < products.length; j++) {
                    productService.findById(products[j].id.$id ? products[j].id.$id /* API */ : products[j].id, products[j] /* IndexedDB*/ ).then(function(data) {
                        if(data) {
                            var product = data.product;
                            _this.addProduct(product, product.getPriceById(data.data.price.id ? data.data.price.id.$id : data.data.price._id.$id), parseInt(data.data.quantity));
                            if (_this.products[i] && data.data.tags.length > 0 && typeof data.data.tags[0] === "object") {
                                _this.products[i].tags = data.data.tags;
                            }
                            i++;
                        }
                        n++;

                        if(n == products.length) {
                            returnValue.resolve(this);
                        }
                    });
                }

                if(products.length == 0) {
                    returnValue.resolve(this);
                }

                return returnValue.promise;
            };
            Cart.prototype.validate  = function(next) {
                this.status = 1;
                this.status_text = "Livrée";

                this.save(next);
            };
            /**
             * Saving the cart.
             * If it is unsuccessful, the id is changed to -1
             *
             * @param next
             */
            Cart.prototype.save = function (next) {
                if(this._id == undefined)
                    this._id = "";

                if(this.parsed) {
                    // Nothing to do
                } else {
                    this.parse();
                }

                var _this = this;
                var cart = angular.copy(this);
                if(this.delivery_time)
                    cart.delivery_time = this.delivery_time.getTime();
                
                for(var i = 0; i < cart.products.length; i++) {
                    delete cart.products[i]['availableIngredients'];
                    delete cart.products[i]['product']['categories'];
                    delete cart.CONSTANTS_STATUS;
                    delete cart.CONSTANTS_PAYMENT_PROVIDER;
                }

                $http.post(URL_API + this._id, cart).success(function(data, status) {

                    // We update the ID when we create a new cart
                    if(!_this._id)
                        _this._id = data._id;

                    if(next)
                        next(data);
                }).error(function(data, status) {
                    _this._id = -1;
                    _this.error_api = data;
                    $rootScope.$broadcast('errorApi', data);
                });
            };

            Cart.prototype.setData = function(data) {
                if(data._id && data._id.$id) {
                    // We need to remove the $id
                    data._id = data._id.$id;
                }

                this.constructor(data.id ? data.id : data._id, data.site, data.totalAmount ? data.totalAmount : data.amount, data.vat, data.productList, data.date, data.user, data.delivery_partner, data.created_by, data.created_from, data.status, data.status_text, data.shipping, data.billing, data.delivery_time, data.created_at, data.payments, data.last_refresh);
            };
            Cart.prototype.load = function(id, next) {
                var scope = this;
                return $http.get(URL_API + id).success(function(data) {
                    scope.setData(data);
                    if(next)
                        next(data);
                }).error(function(data, status) {
                    scope._id = -1;
                    scope.error_api = data;
                    $rootScope.$broadcast('errorApi', data);
                });
            };
            Cart.prototype.addProduct = function(product, price, qty) {
                var obj = {id: product._id, name: product.name, quantity: qty, price: price, tags: product.tags, product: product, availableIngredients: []};

                if(this.products.length > 0 && obj.id == this.products[this.products.length - 1].id && obj.price == this.products[this.products.length - 1].price) {
                    this.products[this.products.length - 1].quantity = parseInt(this.products[this.products.length - 1].quantity) + 1
                } else {
                    for (var i = 0; i < product.tags.length; i++) {
                        obj.availableIngredients.push({name: product.tags[i], price: 0});
                    }

                    obj.tags = obj.availableIngredients;

                    for (var i = 0; i < product.categories.length; i++) {
                        obj.availableIngredients = obj.availableIngredients.concat(product.categories[i].ingredients);
                    }

                    this.products.push(obj);
                }
            };
            Cart.prototype.checkQuantityProduct = function(product, index) {
                if(product.quantity == 0) {
                    // We remove the product because the quantity is 0
                    this.products.splice(index, 1);
                }
            };
            Cart.prototype.checkDeliveryPartner = function() {
                if(this.shipping == 'ONSITE' || this.shipping == 'PICKUP')
                    this.setDeliveryPartner(this.shipping);
                else {
                    this.setDeliveryPartner("DELIVER");
                }
            };
            Cart.prototype.setDeliveryPartner = function(type) {
                if(type == 'ONSITE' || type == 'PICKUP' || type == 'DELIVER') {
                    if(type == 'ONSITE' || type == 'PICKUP') {
                        this.shipping = type;
                    }
                    this.delivery_partner = type;
                } else {
                    this.delivery_partner = null;
                    console.log("wrong type " + type);
                }
            };
            Cart.prototype.clearUser = function() {
                this.user = null;
            };
            Cart.prototype.getAmount = function(noUpdate, noDiscount) {
                var onsite = false;
                if(this.delivery_partner == 'ONSITE')
                    onsite = true;

                if(!noUpdate) {
                    this.amount = 0;

                    for (var i = 0; i < this.products.length; i++) {
                        this.amount = this.amount + parseFloat(this.getProductPrice(this.products[i].price, this.products[i].quantity, this.products[i].tags, onsite));
                    }

                    if(this.discount && !noDiscount)
                        this.amount = this.amount - this.discount;
                }


                return parseFloat(this.amount).toFixed(2) + " €";
            };
            Cart.prototype.getVat = function() {
                var onsite = false;
                if(this.delivery_partner == 'ONSITE')
                    onsite = true;

                this.vat = 0;

                for(var i = 0; i < this.products.length; i++) {
                    this.vat = this.vat + parseFloat(this.getProductVat(this.products[i].price, this.products[i].quantity, this.products[i].tags, onsite));
                }

                if(this.discount) {
                    var globalVatRat = this.vat / parseFloat(this.getAmount(false, true));
                    this.vat = this.vat - (this.discount * globalVatRat);
                }

                return parseFloat(this.vat).toFixed(2) + " €";

            };
            Cart.prototype.getProductPrice = function(price, quantity, ingredients, onsite) {
                var costIngredients = 0;

                if(ingredients != undefined) {
                    for (var i = 0; i < ingredients.length; i++) {
                        if(parseFloat(ingredients[i].price) > 0)
                            costIngredients = parseFloat(parseFloat(costIngredients) + parseFloat(parseFloat(ingredients[i].price).toFixed(2)));
                    }
                }

                var value = price.value;
                if(onsite != undefined && onsite == true)
                    value = price.value_onsite;

                if(price.isVatIncl) {
                    return ((parseFloat(value) + parseFloat(costIngredients)).toFixed(2) * quantity).toFixed(2) + " €";
                } else {
                    return ((parseFloat((parseFloat(value) * (1 + parseFloat(price.vat) / 100)).toFixed(2)) + parseFloat(costIngredients))* quantity).toFixed(2) + " €";
                }
            };
            Cart.prototype.getProductVat = function(price, quantity, ingredients, onsite) {
                var costIngredients = 0;

                if(ingredients != undefined) {
                    for (var i = 0; i < ingredients.length; i++) {
                        if(parseFloat(ingredients[i].price) > 0)
                            costIngredients = parseFloat(parseFloat(costIngredients) + parseFloat(parseFloat(ingredients[i].price).toFixed(2)));
                    }
                }

                var value = price.value;
                if(onsite != undefined && onsite == true)
                    value = price.value_onsite;

                if(price.isVatIncl) {
                    return (
                        (
                            (parseFloat(value) + costIngredients) /
                            (1 + parseFloat(price.vat) / 100) * price.vat
                        ).toFixed(2) * quantity
                    ).toFixed(2) + " €";
                } else {
                    return (
                        parseFloat(
                            parseFloat(parseFloat(value) * (parseFloat(price.vat) / 100)).toFixed(2)
                        ) +
                        (
                            parseFloat((costIngredients * (parseFloat(price.vat) / 100)).toFixed(2))
                        ) * quantity
                    ).toFixed(2) + " €";
                }
            };
            Cart.prototype.querySearchIngredients = function(query, product) {
                if(query) {
                    var returnValue = [];
                    for(var i = 0; i < product.availableIngredients.length; i++) {
                        if((product.availableIngredients[i].name != undefined && product.availableIngredients[i].name.toLowerCase().search(query.toLowerCase()) > -1) || 
                            (product.availableIngredients[i].name == undefined && product.availableIngredients[i].toLowerCase().search(query.toLowerCase()) > -1 )) {
                            returnValue.push(product.availableIngredients[i]);
                        }
                    }
                    return returnValue;
                } else
                    return [];
            };
            Cart.prototype.addPayment = function() {
                if(this.payments[this.payments.length - 1].status || this.payments[this.payments.length - 1].amount || this.payments[this.payments.length - 1].provider_name)
                    this.payments.push({});
            };
            /**
             * To be able to save the cart needs to NOT be in a specific status (1 + 6 + 7 + 10) AND at least with a user (unless it is a pickup or on site) and a product
             *
             * @returns {boolean}
             */
            Cart.prototype.isSavable = function() {
                return ((this.status != 1 && this.status != 6 && this.status != 7 && this.status != 10) && ((this.delivery_partner == 'ONSITE' || this.delivery_partner == 'PICKUP') || (this.user != null && (this.shipping != null || this.billing !=  null))));
            };
            /**
             * To know if the cart has been properly been paid
             *
             * @returns {boolean}
             */
            Cart.prototype.isPaid = function () {
                var totalPaid = 0;
                for(var i = 0; i < this.payments.length; i++) {
                    if(this.payments[i].status == 1)
                        totalPaid += parseFloat(this.payments[i].amount);
                }

                var totalAmount = parseFloat(this.getAmount());

                return (totalPaid == totalAmount && totalAmount > 0)
            };

            /**
             * Calculate the money to be given back to the customer.
             * If -1 is return, not enough money is given
             *
             * @returns {number}
             */
            Cart.prototype.getReturnMoney = function () {
                return parseFloat(this.getPaid()) - parseFloat(this.getAmount());
            };

            Cart.prototype.getPaid = function() {
                var totalPaid = 0;
                for(var i = 0; i < this.payments.length; i++) {
                    if(this.payments[i].amount)
                        totalPaid += parseFloat(this.payments[i].amount);
                }

                return parseFloat(totalPaid).toFixed(2) + " €";

            };

            Cart.build = function(data) {
                return new Cart(data.id ? data.id : data._id, data.site, data.totalAmount ? data.totalAmount : data.amount, data.vat, data.productList ? data.productList : data.products, data.date, data.user, data.delivery_partner, data.created_by, data.created_from, data.status, data.status_text, data.shipping, data.billing, data.delivery_time, data.created_at, data.payments, data.last_refresh);
            };

            Cart.statusNotStarted = function() {
                return [3, 4];
            };
            Cart.statusOngoing = function() {
                return [2, 21, 22];
            };
            Cart.statusDone = function() {
                return [1];
            };
            Cart.statusCancel = function() {
                return [10, 5, 6];
            };
            return Cart;
        }]);
})();

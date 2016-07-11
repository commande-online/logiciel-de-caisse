(function(){
    'use strict';

    angular.module('products', [ 'ngMaterial' ])
        .factory("Product", ['$http', '$filter', '$rootScope', '$timeout', function($http, $filter, $rootScope, $timeout) {
        var URL_API = DOMAIN_API + "/api/1/bo-management/products/";
        var MAX_PER_PAGE = 50;


        function Product(_id, site, name, owner, last_update, template, website, barcode, order_button_color, rating, fields, prices, comments, tags, categories, status, logStatus, last_refresh) {
            // Public properties, assigned to the instance ('this')
            this._id = _id;
            this.site = site;
            this.name = name;
            this.owner = owner;
            this.last_update = last_update;
            this.status = status;
            this.logStatus = logStatus;
            this.website = website ? true : false;
            this.barcode = barcode;
            this.order_button_color = order_button_color;
            this.rating = rating;

            if(fields == undefined)
                this.fields = [];
            else
                this.fields = fields;

            if(prices == undefined)
                this.prices = [];
            else
                this.prices = prices;
            if(comments == undefined)
                this.comments = [];
            else
                this.comments = comments;
            if(tags == undefined)
                this.tags = [];
            else
                this.tags = tags;
            if(categories == undefined)
                this.categories = [];
            else
                this.categories = categories;

            this.template = template;

            if(last_refresh) {
                this.last_refresh = last_refresh
            } else {
                var dateUpdate = new Date();
                this.last_refresh = dateUpdate.getTime();
            }
        }


            Product.prototype.setData = function(data) {
                if(data._id && data._id.$id) {
                    // We need to remove the $id
                    data._id = data._id.$id;
                }
                angular.extend(this, data);
            };
            Product.prototype.load = function(id) {
                var scope = this;
                return $http.get(URL_API + id).success(function(data) {
                    scope.setData(data);
                }).error(function(data, status) {
                    scope._id = -1;
                    scope.error_api = data;
                    $rootScope.$broadcast('errorApi', data);
                });
            };
            Product.prototype.loadFromField = function(id) {
                var scope = this;
                return $http.get(URL_API + "field/"+ id).success(function(data) {
                    scope.setData(data);
                }).error(function(data, status) {
                    scope._id = -1;
                    scope.error_api = data;
                    $rootScope.$broadcast('errorApi', data);
                });
            };
            Product.prototype.save = function (next) {
                var scope = this;
                if(this._id == undefined)
                    this._id = "";

                return $http.post(URL_API + this._id, this).success(function(data, status) {
                    if(scope._id == "") {
                        scope._id = data._id;
                    }

                    next(data);
                }).error(function(data, status) {
                    scope._id = -1;
                    scope.error_api = data;
                    $rootScope.$broadcast('errorApi', data);
                });
            };
            Product.prototype.delete = function(next) {
                var scope = this;
                $http.delete(URL_API + this._id).success(function(data, status) {
                    if(next)
                        next(data);
                }).error(function(data, status) {
                    scope._id = -1;
                    scope.error_api = data;
                    $rootScope.$broadcast('errorApi', data);
                });
            };

            Product.prototype.getField = function(id, lang) {
                for(var i = 0; i < this.fields.length; i++) {
                    if(this.fields[i].field == id && this.fields[i].lang == lang) {
                        return this.fields[i];
                    } else {
                        //console.log(this.fields[i].field, id);
                    }
                }
                return null;
            };

            Product.prototype.getPrice = function(id) {
                for(var i = 0; i < this.prices.length; i++) {
                    if(this.prices[i].field == id) {
                        return this.prices[i];
                    } else {
                        //console.log(this.prices[i].field, id);
                    }
                }
                return null;
            };

            Product.prototype.getPriceById = function(id) {
                for(var i = 0; i < this.prices.length; i++) {
                    if(this.prices[i]._id.$id == id) {
                        return this.prices[i];
                    } else {
                        //console.log(this.prices[i]._id.$id, id);
                    }
                }
                return null;
            };

            Product.prototype.addPrice = function(field) {
                var price = {field: field._id.$id, value: field.value, value_onsite: field.value_onsite, vat: field.vat, isVatIncl: field.isVatIncl, stock: field.stock};
                this.prices.push(price);
            };
            Product.prototype.addField = function(field, allLanguage) {
                var f = {field: field._id.$id, infos: {}, type: field.type, lang: field.lang};

                for(var i = 0; i < allLanguage.length; i++) {
                    if(field[allLanguage[i].key] != undefined && (field[allLanguage[i].key].value != undefined || field[allLanguage[i].key].data != undefined) && field[allLanguage[i].key].value != "") {
                        f.infos[allLanguage[i].key] = {value: field[allLanguage[i].key].value, lang: allLanguage[i].key};

                        if(f.type == 3) {
                            // Picture
                            f.infos[allLanguage[i].key].value = [];
                            for(var n = 0; n < field[allLanguage[i].key].data.length; n++) {
                                f.infos[allLanguage[i].key].value.push(field[allLanguage[i].key].data[n]._id);
                            }
                        }
                    }
                }

                this.fields.push(f);
            };

            Product.prototype.getBackgroundColorStyle = function() {
                if(this.order_button_color != undefined && this.order_button_color != "") {
                    return {"background-color":  this.order_button_color};
                } else {
                    return "";
                }
            };

            Product.prototype.inCategory = function(cat) {
                if(cat != undefined) {
                    for(var i = 0; i < this.categories.length; i++) {
                        if(this.categories[i]._id.$id == cat._id) {
                            return true;
                        }
                    }
                } else {
                    return true;
                }

                return false;
            };

            Product.build = function(data) {
                return new Product(data._id ? data._id.$id ? data._id.$id : data._id : undefined, data.site, data.name, data.owner, data.last_update, data.template, data.website, data.barcode, data.order_button_color, data.rating, data.fields, data.prices, data.comments, data.tags, data.categories, data.status, data.logStatus, data.last_refresh);
            };

        return Product;
    }]);
})();

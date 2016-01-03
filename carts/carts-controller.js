(function(){
    angular
        .module('carts')
        .controller('CartsListController', [
            'cartService', '$mdSidenav', '$interval', '$http', '$timeout', '$scope', '$rootScope', 'indexedDBService',
            CartsListController
        ]).controller('CartsNewController', [
            '$mdDialog', '$scope', '$mdBottomSheet', 'Product', 'productService', 'User', 'categoryService', 'Cart', 'userService', 'templateService', '$stateParams', 'cartService', '$rootScope', '$timeout', '$mdToast', '$window', '$location', '$interval', 'User', 'indexedDBService',
            CartsNewController
        ]).controller('CartBottomSheetSelectCategory', ['$scope', '$mdBottomSheet', 'categoryService', 'currentCat',
            CartBottomSheetSelectCategory
        ]).controller('CartBottomSheetSelectProduct', ['$scope', '$mdBottomSheet', 'templateService', 'product', 'cart',
            CartBottomSheetSelectProduct
        ]).controller('CartBottomSheetMoreOptions', ['$scope', '$mdBottomSheet', 'templateService', 'cart',
            CartBottomSheetMoreOptions
        ]).controller('CartBottomSheetPaymentOptions', ['$scope', '$mdBottomSheet', 'templateService', 'cart',
            CartBottomSheetPaymentOptions
        ]);



    function CartsListController(cartService, $mdSidenav, $interval, $http, $timeout, $scope, $rootScope, indexedDBService) {
        var self = this;
        $scope.listCarts = [];
        //self.listCarts = cartService.getCarts();

        $scope.begDate = new Date();
        $scope.begDate.setHours(0);
        $scope.begDate.setMinutes(0);
        $scope.endDate = new Date($scope.begDate.getTime() + 24 * 60 * 60 * 1000);
        $scope.endDate.setHours(23);
        $scope.endDate.setMinutes(59);
        $scope.begDate.setMonth($scope.begDate.getMonth() - 1);
        $scope.statusCart = {notStarted: false, ongoing: true, completed: false, canceled: false};
        $scope.displaySavableCarts = true;

        $scope.cartPrint = function(cart) {
            var popupWin = window.open('/bo-management/order-print-ticket/cart/'+cart._id, '_blank', 'width=400,height=600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWin.window.focus();
            popupWin.onbeforeunload = function (event) {
                popupWin.close();
            };
            popupWin.onabort = function (event) {
                popupWin.document.close();
                popupWin.close();
            };
        };

        $scope.validateCart = function(cart) {
            cartService.findById(cart._id, true, indexedDBService.getDB()).validate((function(data) {
                $rootScope.$broadcast('addNotification', 'La commande '+ cart._id +'a bien été validée');
            }));
        };

        $scope.refreshCartsList = function() {
            $rootScope.$broadcast('loadingNotification');
            $scope.listCarts = [];
            cartService.findDB($scope.begDate, $scope.endDate, $scope.statusCart, indexedDBService.getDB()).then(function(data) {
                $scope.listCarts = data;
                $timeout(function() {$rootScope.$broadcast('stopLoadingNotification');}, 500);
                console.log($scope.listCarts);
            });
        };

        $scope.displaySavableCarts = false;

        var infoInterval = $interval(function() {
            if($http.pendingRequests.length == 0 && indexedDBService.getDB()) {
                //console.log("OK");
                $scope.refreshCartsList();
                $interval.cancel(infoInterval);
            }
        }, 1000);
    }

    function CartsNewController($mdDialog, $scope, $mdBottomSheet, Product, productService, Category, categoryService, Cart, userService, templateService, $stateParams, cartService, $rootScope, $timeout, $mdToast, $window, $location, $interval, User, indexedDBService) {
        $rootScope.$broadcast('loadingNotification');

        $scope.loadController = function() {
            $scope.listCategories = categoryService.getCategories();
            $scope.listProducts = productService.getProducts();
            $scope.listTemplates = templateService.getTemplates();

            $scope.hideProducts = true;
            if ($stateParams.cartId == undefined) {
                var params = $location.search();
                $scope.cart = new Cart();
                $scope.cart.parsed = true;

                if (params && params.user) {
                     userService.findById(params.user).then(function(user) {
                         $scope.cart.user = user;
                    });
                } else {
                }
            } else {
                cartService.findById($stateParams.cartId, true, indexedDBService.getDB()).then(function (data) {
                    $scope.cart = data;

                    if ($scope.cart) {
                        console.log("Cart : ", $scope.cart);
                    } else {
                        $scope.cart = new Cart();
                    }
                });

            }
        };

        var infoInterval = $interval(function () {
            if (indexedDBService.getDB()) {
                $scope.loadController();
                $rootScope.$broadcast('stopLoadingNotification');
                $interval.cancel(infoInterval);
            } else {
                //console.log("not yet");
            }
        }, 1000);


        $scope.newUser = function(ev) {
            var user = new User();

            $mdDialog.show({
                controller: 'UsersEditController',
                templateUrl: 'partials/users-form.html',
                targetEvent: ev,
                locals: {elt: user},
                bindToController: true

            })
                .then(function(answer) {
                    user.save(function (data) {
                        if(data.OK == 1) {
                            //categoryService.resetCategories();
                            $scope.cart.user = user;

                            $rootScope.$broadcast('addNotification', 'Le client a bien été sauvegardé');
                        } else {
                            $rootScope.$broadcast('errorApi', data);
                        }
                    });
                    console.log("OK");
                }, function() { /* CANCEL */ });
        };

        $scope.editUser = function(ev) {
            var user = angular.copy($scope.cart.user);

            $mdDialog.show({
                controller: 'UsersEditController',
                templateUrl: 'partials/users-form.html',
                targetEvent: ev,
                locals: {elt: user},
                bindToController: true

            })
                .then(function(answer) {
                    user.save(function (data) {
                        if(data.OK == 1) {
                            //categoryService.resetCategories();
                            $scope.cart.user = user;

                            $rootScope.$broadcast('addNotification', 'Le client a bien été sauvegardé');
                        } else {
                            $rootScope.$broadcast('errorApi', data);
                        }
                    });
                    console.log("OK");
                }, function() { /* CANCEL */ });
        };


        $scope.searchText = "";
        $scope.templateService = templateService;

        $scope.findUser = userService.findUser;

        $scope.currentCat = null;

        $scope.selectCategory = function(cat) {
            $scope.currentProduct = null;
            if($scope.currentCat == cat) {
                $scope.currentCat = null;
            } else {
                $scope.currentCat = cat;
            }
        };

        // For the height of the list
        var decreaseForMaxHeight = 180;
        $(".mainCartItem").height(window.innerHeight - decreaseForMaxHeight);
        $("#listProducts md-content").height(window.innerHeight - decreaseForMaxHeight - 200);

        $(window).on("resize.doResize", function () {
            $scope.$apply(function () {
                $(".mainCartItem").height(window.innerHeight - decreaseForMaxHeight);
                $("#listProducts md-content").height(window.innerHeight - decreaseForMaxHeight - parseInt($("#listCategories").height()) - parseInt($("#listSizes").height()) + 40);
            });
        });

        $scope.$on("$destroy", function () {
            $(window).off("resize.doResize"); //remove the handler added earlier
        });
        // End of the height thingy


        $scope.showSelectProduct = function($event, product) {
            $scope.currentProduct = product;

            if(product.prices.length == 1) {
                $scope.listItemClick(product, product.prices[0], 1);
            }

            /* @deprecated
            $mdBottomSheet.show({
                templateUrl: 'partials/cart-bottom-sheet-select-product.html',
                controller: 'CartBottomSheetSelectProduct',
                targetEvent: $event,
                locals: {product: product, cart: $scope.cart}
            }).then(function(data) {

            });*/
        };
        $scope.hideMoreOptions = true;
        $scope.showCartMoreOptions = function($event) {
            $scope.hideMoreOptions = $scope.hideMoreOptions ? false : true;
            /*$mdBottomSheet.show({
                templateUrl: 'partials/cart-bottom-sheet-more-options.html',
                controller: 'CartBottomSheetMoreOptions',
                targetEvent: $event,
                locals: {cart: $scope.cart}
            }).then(function(data) {
            });*/
        };
        $scope.showPaymentOptions = function($event) {
            $mdBottomSheet.show({
                templateUrl: 'partials/cart-bottom-sheet-payment-options.html',
                controller: 'CartBottomSheetPaymentOptions',
                targetEvent: $event,
                locals: {cart: $scope.cart}
            }).then(function(data) {
            });
        };
        $scope.userSelected = function() {
            if($scope.cart.user) {
                console.log($scope.cart.user.getDefaultAddress());
                $scope.cart.billing = $scope.cart.user.getDefaultAddress();
                if($scope.cart.billing)
                    $scope.cart.billing = $scope.cart.billing.id;
            }
        };
        /**
         * When displaying the list of all prices for one product, making sure we show the right price based on the cart type
         *
         * @param price
         * @returns {string}
         */
        $scope.parsePrice = function(price) {
            var value = price.value;
            if($scope.cart.delivery_partner == 'ONSITE')
                value = price.value_onsite;

            $("#listProducts md-content").height(window.innerHeight - decreaseForMaxHeight - parseInt($("#listCategories").height()) - parseInt($("#listSizes").height()) + 40);
            $(".mainCartItem").height(window.innerHeight - decreaseForMaxHeight);

            if(price.isVatIncl) {
                return parseFloat(value).toFixed(2);
            } else {
                return parseFloat(parseFloat(value) * (1+ parseFloat(price.vat)/100)).toFixed(2);
            }
        };
        /**
         * Add a product to the cart
         *
         * @param product
         * @param price
         * @param qty
         */
        $scope.listItemClick = function(product, price, qty) {
            $scope.cart.addProduct(product, price, qty);
            $rootScope.$broadcast('addNotification', 'Le produit '+product.name+' a bien été ajoutée à la commande. TOTAL : '+ $scope.cart.getAmount());
        };
        /**
         * Will save the cart to the DB (local + remote)
         * @param $event
         */
        $scope.cartSave = function($event) {
            // Remote
            $scope.cart.save(function() {
                // Notification
                $rootScope.$broadcast('addNotification', 'La commande ' + $scope.cart._id + ' a bien été mise à jour. TOTAL : '+ $scope.cart.getAmount());
                // Save to the local list
                cartService.addCart($scope.cart, true);
                // Save to the local DB
                $scope.cart.load($scope.cart._id, function() {
                    cartService.saveToDbCart($scope.cart);
                });
                // Redirect
                $window.location.href = '#home';
            });

        };
        $scope.cartPrint = function() {
            var popupWin = window.open('/bo-management/order-print-ticket/cart/'+$scope.cart._id, '_blank', 'width=400,height=600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWin.window.focus();
            popupWin.onbeforeunload = function (event) {
                popupWin.close();
            };
            popupWin.onabort = function (event) {
                popupWin.document.close();
                popupWin.close();
            };
        };
    }

    function CartBottomSheetSelectCategory($scope, $mdBottomSheet, categoryService, currentCat) {
        $scope.listCategories = categoryService.getCategories();
        $scope.currentCat = currentCat;

        $scope.listItemClick = function(cat) {
            $mdBottomSheet.hide(cat);
        };

        $scope.hideCheck = function(item) {
            if(currentCat == null || currentCat._id != item._id)
                return true;
        };
    }

    function CartBottomSheetSelectProduct($scope, $mdBottomSheet, templateService, product, cart) {
        $scope.templateService = templateService;
        $scope.product = product;

        $scope.parsePrice = function(price) {
            var value = price.value;
            if(cart.delivery_partner == 'ONSITE')
                value = price.value_onsite;

            if(price.isVatIncl) {
                return parseFloat(value).toFixed(2);
            } else {
                return parseFloat(parseFloat(value) * (1+ parseFloat(price.vat)/100)).toFixed(2);
            }
        };

        $scope.listItemClick = function(product, price, qty) {
            cart.addProduct(product, price, qty);
        };
    }

    function CartBottomSheetMoreOptions($scope, $mdBottomSheet, templateService, cart) {
        $scope.cart = cart;
    }

    function CartBottomSheetPaymentOptions($scope, $mdBottomSheet, templateService, cart) {
        $scope.cart = cart;
    }

})();


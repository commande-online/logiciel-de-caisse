(function(){
    'use strict';

    angular.module('products')
        .service('productService', ['$http', 'Product', '$q', '$log', '$rootScope', 'indexedDBService', productService]);

    function productService($http, Product, $q, $log, $rootScope, indexedDBService){
        var URL_API = DOMAIN_API + "/api/1/bo-management/products/";
        var MAX_PER_PAGE = 100;
        var MAX_TOTAL = 10000;
        var products = [];
        var loading = false;

        var transaction = null;
        var store = null;
        var nameTable = "products";

        var maxRefresh = 5 * 60 * 1000;//5 min

        return {
            getProducts: function() {
                var db = indexedDBService.getDB();

                if(db && products.length == 0) {
                    // If we have a DB we load all the information from the DB
                    transaction = db.transaction([nameTable], "readonly");
                    store = transaction.objectStore(nameTable).index("statusIndex");
                    var boundKeyRange = IDBKeyRange.only(1);
                    store.openCursor(boundKeyRange).onsuccess = function(event) {
                        var cursor = event.target.result;
                        if (cursor) {
                            var product = Product.build(cursor.value);
                            products.push(product);
                            cursor.continue();
                        }
                    };
                    store.openCursor(boundKeyRange).onerror = function(event) {
                        $log.warn("cursor error", event);
                    };
                }

                return products;
            },
            updateProducts: function(since) {
                if(!since) {
                    since = new Date();
                    since.setMinutes(since.getMinutes() - 10);
                }
                var db = indexedDBService.getDB();
                var _this = this;

                return $http.get(URL_API + "list/update/"+encodeURIComponent(since.toISOString())).then(function(data) {
                    var data = data.data;
                    if(db) {
                        transaction = db.transaction([nameTable], "readwrite");
                        store = transaction.objectStore(nameTable);
                    }
                    for(var i = 0; i < data.length; i++) {
                        var product = Product.build(data[i]);

                        if(db)
                            store.put(product);

                        _this.addProduct(product);
                    }
                }, function(data) {
                    throw data.data.message;
                });
            },
            addProduct: function(product) {
                var founded = false;
                for(var i = 0; i < products.length && !founded; i++) {
                    if(products[i]._id == product._id)
                        founded = true;
                }
                if(!founded)
                    products.push(product);
            },
            loadProducts: function(start) {
                loading = true;
                var db = indexedDBService.getDB();
                if(start == undefined) start = 0;
                var _this = this;

                $log.debug(URL_API + "list/"+start+"/"+MAX_PER_PAGE);
                return $http.get(URL_API + "list/"+start+"/"+MAX_PER_PAGE).then(function(dataR) {
                    var data = dataR.data;
                    if(db) {
                        transaction = db.transaction([nameTable], "readwrite");
                        store = transaction.objectStore(nameTable);
                    }
                    for(var i = 0; i < data.length; i++) {
                        var product = Product.build(data[i]);

                        if(db)
                            store.put(product);

                        _this.addProduct(product);
                    }
                    if(data.length == MAX_PER_PAGE && products.length < MAX_TOTAL) {
                        _this.loadProducts(start + MAX_PER_PAGE);
                    } else
                        loading = false;
                }, function(data) {
                    throw data.data.message;
                });
            },
            resetProducts: function() {
                products = [];
                return this.loadProducts();
            },
            findByPrice: function(id) {
                var deferred = $q.defer();
                var db = indexedDBService.getDB();
                transaction = db.transaction([nameTable], "readonly");
                store = transaction.objectStore(nameTable).index("statusIndex");
                var boundKeyRange = IDBKeyRange.only(1);
                store.openCursor(boundKeyRange).onsuccess = function(event) {
                    var cursor = event.target.result;
                    if (cursor) {
                        var product = (cursor.value);
                        var founded = false;
                        for(var j = 0; j < product.prices.length; j++) {
                            if(product.prices[j]._id.$id == id) {
                                deferred.resolve(product);
                                founded = true;
                            }
                        }
                        if(!founded)
                            cursor.continue();
                    } else {
                        deferred.resolve(null);
                    }
                    $rootScope.$apply();
                };
                store.openCursor(boundKeyRange).onerror = function(event) {
                    $log.warn("cursor error", event);

                    totalStatusDone++;
                    if(totalStatusDone == aStatus.length)
                        deferred.resolve(data);
                };
                return deferred.promise;
            },
            /**
             *
             * @param id
             * @param data data to be forwarded
             * @returns Product
             */
            findById: function(id, data) {
                var deferred = $q.defer();
                var date = new Date();
                var db = indexedDBService.getDB();

                if(id == null || id == undefined || !db)
                    deferred.resolve(null);
                else {
                    transaction = db.transaction([nameTable], "readonly");
                    store = transaction.objectStore(nameTable);

                    var objectStoreRequest = store.get(id);
                    objectStoreRequest.onsuccess = function (event) {
                        if (objectStoreRequest.result) {
                            var product = Product.build(objectStoreRequest.result);
                            if (product.last_refresh + maxRefresh < date.getTime() && product._id ) {
                                $log.info("product " + product._id + " needs to be refreshed");
                                // Refresh needed

                                product.load(product._id).then(function () {
                                    transaction = db.transaction([nameTable], "readwrite");
                                    store = transaction.objectStore(nameTable);
                                    var date = new Date();

                                    product.last_refresh = date.getTime();

                                    store.put(product);
                                    deferred.resolve({product: product, data: data});
                                });
                            } else {
                                // No refresh needed
                                $log.info("product " + product._id + " doens't to be refreshed", product.last_refresh, product.last_refresh + maxRefresh, date.getTime());
                                deferred.resolve({product: product, data: data});
                            }
                        } else {
                            deferred.resolve(null);
                        }

                        $rootScope.$apply();
                    };
                }
                return deferred.promise;
            }
        };
    }

})();


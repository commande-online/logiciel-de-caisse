(function(){
    'use strict';

    angular.module('carts')
        .service('cartService', ['Cart', '$http', '$q', '$log', '$rootScope', 'indexedDBService', cartService]);

    function cartService(Cart, $http, $q, $log, $rootScope, indexedDBService){
        var URL_API = DOMAIN_API + "/api/1/bo-management/carts/";
        var MAX_PER_PAGE = 100;
        var MAX_TOTAL = 500;
        var carts = [];
        var loading = false;

        var transaction = null;
        var store = null;
        var nameTable = "carts";

        var maxRefresh = 5 * 60 * 1000;//5 min

        return {
            getCarts: function() {
                var db = indexedDBService.getDB();

                /*if(db && carts.length == 0) {
                    // If we have a DB we load all the information from the DB
                    transaction = db.transaction([nameTable], "readonly");
                    store = transaction.objectStore(nameTable).index("statusIndex");
                    var boundKeyRange = IDBKeyRange.only(1);
                    store.openCursor(boundKeyRange).onsuccess = function(event) {
                        var cursor = event.target.result;
                        if (cursor) {
                            var cart = Cart.build(cursor.value);
                            carts.push(cart);
                            cursor.continue();
                        }
                    };
                    store.openCursor(boundKeyRange).onerror = function(event) {
                        $log.warn("cursor error", event);
                    };
                }*/

                return carts;
            },
            updateCarts: function(since) {
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
                        var cart = Cart.build(data[i]);

                        if(db)
                            store.put(cart);

                        _this.addCart(cart);
                    }
                }, function(data) {
                    throw data.data.message;
                });
            },
            addCart: function(cart) {
                var founded = false;
                for(var i = 0; i < carts.length && !founded; i++) {
                    if(carts[i]._id == cart._id)
                        founded = true;
                }
                if(!founded)
                    carts.push(cart);

                return founded;
            },
            saveToDbCart: function(cart) {
                var db = indexedDBService.getDB();

                transaction = db.transaction([nameTable], "readwrite");
                store = transaction.objectStore(nameTable);

                $log.debug("cart being saved to the IndexedDB");
                store.put(cart);
            },
            loadCarts: function(start) {
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
                        var cart = Cart.build(data[i]);

                        if(db)
                            store.put(cart);

                        _this.addCart(cart);
                    }
                    if(data.length == MAX_PER_PAGE && carts.length < MAX_TOTAL) {
                        _this.loadCarts(start + MAX_PER_PAGE);
                    } else
                        loading = false;
                }, function(data) {
                    throw data.data.message;
                });
            },
            findById: function(id) {
                var deferred = $q.defer();
                var date = new Date();
                var db = indexedDBService.getDB();

                transaction = db.transaction([nameTable], "readonly");
                store = transaction.objectStore(nameTable);

                if(id == null || id == undefined)
                    deferred.resolve(null);
                else {
                    var objectStoreRequest = store.get(id);
                    objectStoreRequest.onsuccess = function (event) {
                        if (objectStoreRequest.result) {
                            var cart = Cart.build(objectStoreRequest.result);
                            if (cart.last_refresh + maxRefresh < date.getTime()) {
                                $log.info("cart " + cart._id + " needs to be refreshed", cart);
                                // Refresh needed
                                cart.load(cart._id).then(function () {
                                    var date = new Date();
                                    cart.parse().then(function() {
                                        cart.last_refresh = date.getTime();
                                        
                                        transaction = db.transaction([nameTable], "readwrite");
                                        store = transaction.objectStore(nameTable);

                                        store.put(cart);
                                        deferred.resolve(cart);
                                    });
                                });
                            } else {
                                // No refresh needed
                                $log.info("cart " + cart._id + " doesn't need to be refreshed", cart.last_refresh, cart.last_refresh + maxRefresh, date.getTime(), cart);
                                cart.parse().then(function() {
                                    deferred.resolve(cart);
                                });
                            }
                        } else {
                            deferred.resolve(null);
                        }

                        $rootScope.$apply();
                    };
                }
                return deferred.promise;
            },
            findDB: function(begDate, endDate, status) {
                var deferred = $q.defer();
                var db = indexedDBService.getDB();
                if(!begDate) begDate = new Date();
                if(!endDate) endDate = new Date();

                $log.info("find DB called");
                $log.debug("begDate", begDate.getTime());
                $log.debug("endDate", endDate.getTime());
                $log.debug("status", status);
                if(db || true) {
                    var data = [];

                    var aStatus = [];
                    if(status && status.notStarted) {
                        var newStatus = Cart.statusNotStarted();
                        for(var i = 0; i < newStatus.length; i++)
                            aStatus.push(newStatus[i]);
                    }
                    if(status && status.ongoing) {
                        var newStatus = Cart.statusOngoing();
                        for(var i = 0; i < newStatus.length; i++)
                            aStatus.push(newStatus[i]);
                    }
                    if(status && status.completed) {
                        var newStatus = Cart.statusDone();
                        for(var i = 0; i < newStatus.length; i++)
                            aStatus.push(newStatus[i]);
                    }
                    if(status && status.canceled) {
                        var newStatus = Cart.statusCancel();
                        for(var i = 0; i < newStatus.length; i++)
                            aStatus.push(newStatus[i]);
                    }
                    $log.debug("status list", aStatus);
                    var totalStatusDone = 0;
                    for(var i = 0; i < aStatus.length; i++) {
                        transaction = db.transaction([nameTable], "readonly");
                        store = transaction.objectStore(nameTable).index("statusIndex");
                        var boundKeyRange = IDBKeyRange.only(aStatus[i]);
                        store.openCursor(boundKeyRange).onsuccess = function(event) {
                            var cursor = event.target.result;
                            if (cursor) {
                                if(cursor.value.date > begDate.getTime() && cursor.value.date < endDate.getTime()) {
                                    var cart = Cart.build(cursor.value);
                                    cart.parse();
                                    data.push(cart);

                                }else {
                                }
                                cursor.continue();
                            } else {
                                $log.info("cursor done");
                                totalStatusDone++;
                                if(totalStatusDone == aStatus.length)
                                    deferred.resolve(data);
                            }

                            $rootScope.$apply();
                        };
                        store.openCursor(boundKeyRange).onerror = function(event) {
                            $log.warn("cursor error", event);
                            totalStatusDone++;
                            if(totalStatusDone == aStatus.length)
                                deferred.resolve(data);
                        }
                    }

                    if(aStatus.length == 0)
                        deferred.resolve([]);

                } else {
                    deferred.resolve([]);
                }

                return deferred.promise;
            }
        };
    }

})();

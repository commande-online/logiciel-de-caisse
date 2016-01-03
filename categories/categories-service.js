(function(){
    'use strict';

    angular.module('categories')
        .service('categoryService', ['$http', 'Category', '$q', '$log', '$rootScope', 'indexedDBService', categoryService]);

    function categoryService($http, Category, $q, $log, $rootScope, indexedDBService){
        var URL_API = DOMAIN_API + "/api/1/bo-management/categories/";
        var MAX_PER_PAGE = 100;
        var MAX_TOTAL = 10000;
        var categories = [];
        var loading = false;

        var transaction = null;
        var store = null;
        var nameTable = "categories";

        var maxRefresh = 5 * 60 * 1000;//5 min

        return {
            getCategories: function() {
                var db = indexedDBService.getDB();

                if(db && categories.length == 0) {
                    // If we have a DB we load all the information from the DB
                    transaction = db.transaction([nameTable], "readonly");
                    store = transaction.objectStore(nameTable).index("statusIndex");
                    var boundKeyRange = IDBKeyRange.only(1);
                    store.openCursor(boundKeyRange).onsuccess = function(event) {
                        var cursor = event.target.result;
                        if (cursor) {
                            var category = Category.build(cursor.value);
                            categories.push(category);
                            cursor.continue();
                        }
                    };
                    store.openCursor(boundKeyRange).onerror = function(event) {
                        $log.warn("cursor error", event);
                    };
                }

                return categories;
            },
            addCategory: function(category) {
                var founded = false;
                for(var i = 0; i < categories.length && !founded; i++) {
                    if(categories[i]._id == category._id)
                        founded = true;
                }
                if(!founded)
                    categories.push(category);
            },
            updateCategories: function(since) {
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
                        var category = Category.build(data[i]);

                        if(db)
                            store.put(category);

                        _this.addCategory(category);
                    }
                }, function(data) {
                    throw data.data.message;
                });
            },
            loadCategories: function(start) {
                loading = true;
                var db = indexedDBService.getDB();
                if(start == undefined) start = 0;
                var _this = this;

                $log.debug(URL_API + "list/"+start+"/"+MAX_PER_PAGE);
                return $http.get(URL_API + "list/"+start+"/"+MAX_PER_PAGE).then(function(data) {
                    var data = data.data;
                    if(db) {
                        transaction = db.transaction([nameTable], "readwrite");
                        store = transaction.objectStore(nameTable);
                    }

                    for(var i = 0; i < data.length; i++) {
                        var category = Category.build(data[i]);
                        if(db && category)
                            store.put(category);

                        if(category)
                            _this.addCategory(category);
                    }
                    if(data.length == MAX_PER_PAGE && categories.length < MAX_TOTAL) {
                        _this.loadCategories(start + MAX_PER_PAGE);
                    } else
                        loading = false;
                }, function(data) {
                    throw data.data.message;
                });
            },
            resetCategories: function() {
                categories = [];
                return this.loadCategories();
            }
        };
    }

})();


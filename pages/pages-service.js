(function(){
    'use strict';

    angular.module('pages')
        .service('pageService', ['$http', 'Page', '$q', '$log', '$rootScope', 'indexedDBService', pageService]);

    function pageService($http, Page, $q, $log, $rootScope, indexedDBService){
        var URL_API = DOMAIN_API + "/api/1/bo-management/pages/";
        var MAX_PER_PAGE = 100;
        var MAX_TOTAL = 10000;
        var pages = [];
        var loading = false;

        var transaction = null;
        var store = null;
        var nameTable = "pages";

        return {
            getPages: function() {
                var db = indexedDBService.getDB();
                console.log("getPages");

                if(db && pages.length == 0) {
                    console.log("db loading");
                    // If we have a DB we load all the information from the DB
                    transaction = db.transaction([nameTable], "readonly");
                    store = transaction.objectStore(nameTable).index("statusIndex");
                    var boundKeyRange = IDBKeyRange.only(1);
                    store.openCursor(boundKeyRange).onsuccess = function(event) {
                        var cursor = event.target.result;
                        if (cursor) {
                            var page = Page.build(cursor.value);
                            console.log(page);
                            pages.push(page);
                            cursor.continue();
                        }
                    };
                    store.openCursor(boundKeyRange).onerror = function(event) {
                        $log.warn("cursor error", event);
                    };
                } else {
                    $log.debug("no need of the DB for getPages");
                }

                return pages;
            },
            addPage: function(page) {
                var founded = false;
                for(var i = 0; i < pages.length && !founded; i++) {
                    if(pages[i]._id == page._id)
                        founded = true;
                }
                if(!founded)
                    pages.push(page);
            },
            updatePages: function(since) {
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
                        var page = Page.build(data[i]);

                        if(db)
                            store.put(page);

                        _this.addPage(page);
                    }
                }, function(data) {
                    throw data.data.message;
                });
            },
            loadPages: function(start) {
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
                        var page = Page.build(data[i]);
                        if(db)
                            store.put(page);

                        _this.addPage(page);
                    }
                    if(data.length == MAX_PER_PAGE && _this.pages.length < MAX_TOTAL) {
                        _this.loadPages(start + MAX_PER_PAGE);
                    } else
                        loading = false;
                }, function(data) {
                    throw data.data.message;
                });
            },
            resetPages: function() {
                pages = [];
                return this.loadPages();
            },
        };
    }

})();

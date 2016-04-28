(function(){
    'use strict';

    angular.module('shops')
        .service('languageService', ['$http', 'indexedDBService', languageService]);

    function languageService($http, indexedDBService){
        var URL_API = DOMAIN_API + "/api/1/bo-management/languages";
        var languages = [];

        var transaction = null;
        var store = null;
        var nameTable = "config";
        var typeTable = "language";

        return {
            getLanguages: function() {
                var db = indexedDBService.getDB();

                if(db && languages.length == 0) {
                    // If we have a DB we load all the information from the DB
                    transaction = db.transaction([nameTable], "readonly");
                    store = transaction.objectStore(nameTable).index("typeIndex");
                    var boundKeyRange = IDBKeyRange.only(typeTable);
                    store.openCursor(boundKeyRange).onsuccess = function(event) {
                        var cursor = event.target.result;
                        if (cursor) {
                            languages.push(cursor.value.lang);
                            cursor.continue();
                        }
                    };
                    store.openCursor(boundKeyRange).onerror = function(event) {
                        $log.warn("cursor error", event);
                    };
                }

                return languages;
            },
            loadLanguages: function() {
                var db = indexedDBService.getDB();

                return $http.get(URL_API).then(function(date) {
                    languages = date.data;

                    if(db) {
                        transaction = db.transaction([nameTable], "readwrite");
                        store = transaction.objectStore(nameTable);

                        for(var i = 0; i < languages.length; i++) {
                            store.put({_id: languages[i].key, lang: languages[i], type: typeTable});
                        }
                    }
                });
            }
        };
    }

})();


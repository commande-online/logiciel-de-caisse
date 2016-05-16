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
            /**
             * Load all the languages already stores
             * @param noDb only for unit testing purposes
             * @returns {Array}
             */
            getLanguages: function(noDb) {
                if(noDb) {
                    // We don't want to query the DB
                } else
                    this.getLanguagesDB();
                return languages;
            },
            loadLanguages: function() {
                var _this = this;
                return $http.get(URL_API).then(function(date) {
                    languages = date.data;
                    _this.saveLanguagesDB(languages);
                });
            },
            /***************************************
             *****      DB related methods      ****
             **************************************/
            getLanguagesDB: function() {
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
            },
            /**
             * save the languages in the DB
             *
             * @param langs from the API request
             * @param local only used for unit testing
             */
            saveLanguagesDB: function(langs, local) {
                var db = indexedDBService.getDB();

                if(db) {
                    // For unit testing purposes
                    if(local)
                        languages = langs;

                    transaction = db.transaction([nameTable], "readwrite");
                    store = transaction.objectStore(nameTable);

                    for(var i = 0; i < langs.length; i++) {
                        store.put({_id: langs[i].key, lang: langs[i], type: typeTable});
                    }
                }

            }
        };
    }

})();


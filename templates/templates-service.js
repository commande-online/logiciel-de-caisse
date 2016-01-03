(function(){
    'use strict';

    angular.module('templates')
        .service('templateService', ['$http', 'Template', '$q', '$log', '$rootScope', 'indexedDBService', templateService]);

    function templateService($http, Template, $q, $log, $rootScope, indexedDBService){
        var URL_API = DOMAIN_API + "/api/1/bo-management/templates/";
        var MAX_PER_PAGE = 100;
        var MAX_TOTAL = 10000;
        var templates = [];
        var loading = false;

        var transaction = null;
        var store = null;
        var nameTable = "templates";

        return {
            getTemplates: function() {
                var db = indexedDBService.getDB();

                if(db && templates.length == 0) {
                    // If we have a DB we load all the information from the DB
                    transaction = db.transaction([nameTable], "readonly");
                    store = transaction.objectStore(nameTable).index("statusIndex");
                    var boundKeyRange = IDBKeyRange.only(1);
                    store.openCursor(boundKeyRange).onsuccess = function(event) {
                        var cursor = event.target.result;
                        if (cursor) {
                            var template = Template.build(cursor.value);
                            templates.push(template);
                            cursor.continue();
                        }
                    };
                    store.openCursor(boundKeyRange).onerror = function(event) {
                        $log.warn("cursor error", event);
                    };
                }

                return templates;
            },
            addTemplate: function(template) {
                var founded = false;
                for(var i = 0; i < templates.length && !founded; i++) {
                    if(templates[i]._id == template._id)
                        founded = true;
                }
                if(!founded)
                    templates.push(template);
            },
            updateTemplates: function(since) {
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
                        var template = Template.build(data[i]);

                        if(db)
                            store.put(template);

                        _this.addTemplate(template);
                    }
                }, function(data) {
                    throw data.data.message;
                });
            },
            loadTemplates: function(start) {
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
                        var template = Template.build(data[i]);
                        if(db)
                            store.put(template);

                        _this.addTemplate(template);
                    }
                    if(data.length == MAX_PER_PAGE && template.length < MAX_TOTAL) {
                        _this.loadTemplates(start + MAX_PER_PAGE);
                    } else
                        loading = false;
                }, function(data) {
                    throw data.data.message;
                });
            },
            resetTemplates: function() {
                templates = [];
                return this.loadTemplates();
            },
            findByField: function(field) {
                for(var i = 0; i < templates.length; i++) {
                    for(var j = 0; j < templates[i].fields.length; j++) {
                        if(templates[i].fields[j]._id.$id == field)
                            return templates[i];
                    }
                }
            },
            getField: function(field) {
                for(var i = 0; i < templates.length; i++) {
                    for(var j = 0; j < templates[i].fields.length; j++) {
                        if(templates[i].fields[j]._id.$id == field)
                            return templates[i].fields[j];
                    }
                }

            }
        };
    }

})();


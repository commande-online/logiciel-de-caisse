(function(){
    'use strict';

    angular.module('indexedDB', [ 'ngMaterial' ])
        .service('indexedDBService', ['$window', '$http', '$q', '$rootScope', '$log',
            indexedDBService]);

    function indexedDBService($window, $http, $q, $rootScope, $log){
        var indexedDB = null;
        var requestDB = null;
        var db = null;

        var version = 1;
        var name = "myCOL";

        var lastConnection = null;
        var lastUpdate = null;

        var UPDATE_NEEDED_THRESHOLDS = 300000; // 5 min

        return {
            getLastConnection: function() {
                return lastConnection;
            },
            getLastUpdate: function() {
                return lastUpdate;
            },
            getDbName: function() {
                return name;
            },
            getDbVersion: function() {
                return version;
            },
            retrieveLastUpdate: function() {
                var deferred = $q.defer();
                var store = db.transaction("last_update", "readonly").objectStore("last_update");
                store.openCursor(null, "prev").onsuccess = function(event) {
                    var cursor = event.target.result;
                    if(cursor != null)
                        lastUpdate = cursor.value;

                    deferred.resolve("last_update OK");
                    $rootScope.$apply();
                };

                return deferred.promise;
            },
            update: function() {
                var transaction = db.transaction(["last_update"], "readwrite");
                var store = transaction.objectStore("last_update");
                var date = new Date();

                store.add(date.getTime());
            },
            needToUpdate: function() {
                var date = new Date();
                return (lastUpdate == null || date.getTime() - lastUpdate > UPDATE_NEEDED_THRESHOLDS);
            },
            reinit: function() {
                indexedDB = $window.indexedDB;
                indexedDB.deleteDatabase(name);
            },
            init: function(forceReinit, nameDB, versionDB) {
                if(nameDB)
                    name = nameDB;
                if(versionDB)
                    version = versionDB;

                var deferred = $q.defer();
                indexedDB = $window.indexedDB;
                var _this = this;

                // to re-init
                if(forceReinit /*|| true*/) {
                    indexedDB.deleteDatabase(name);
                    $rootScope.$apply();
                    $log.debug("db deleted");
                }

                requestDB = indexedDB.open(name, version);

                // Only needed for upgrade
                requestDB.onupgradeneeded = function(e) {
                    db = e.target.result;
                    e.target.transaction.onerror = indexedDB.onerror;
                    $log.debug("DB is upgraded");
                    if(!db.objectStoreNames.contains("carts")) {
                        var carts = db.createObjectStore("carts",
                            {keyPath: "_id"});
                        carts.createIndex("statusIndex", "status", { unique: false });
                        carts.createIndex("last_refreshIndex", "last_refresh", { unique: false });
                    }
                    if(!db.objectStoreNames.contains("products")) {
                        var products = db.createObjectStore("products",
                            {keyPath: "_id"});
                        products.createIndex("statusIndex", "status", { unique: false });
                        products.createIndex("last_refreshIndex", "last_refresh", { unique: false });
                    }
                    if(!db.objectStoreNames.contains("categories")) {
                        var categories = db.createObjectStore("categories",
                            {keyPath: "_id"});
                        categories.createIndex("statusIndex", "status", { unique: false });
                        categories.createIndex("last_refreshIndex", "last_refresh", { unique: false });
                    }
                    if(!db.objectStoreNames.contains("templates")) {
                        var templates = db.createObjectStore("templates",
                            {keyPath: "_id"});
                        templates.createIndex("statusIndex", "status", { unique: false });
                        templates.createIndex("last_refreshIndex", "last_refresh", { unique: false });
                    }
                    if(!db.objectStoreNames.contains("pages")) {
                        var pages = db.createObjectStore("pages",
                            {keyPath: "_id"});
                        pages.createIndex("statusIndex", "status", { unique: false });
                        pages.createIndex("last_refreshIndex", "last_refresh", { unique: false });
                    }
                    if(!db.objectStoreNames.contains("users")) {
                        var users = db.createObjectStore("users",
                            {keyPath: "_id"});
                        users.createIndex("statusIndex", "status", { unique: false });
                        users.createIndex("last_refreshIndex", "last_refresh", { unique: false });
                    }
                    if(!db.objectStoreNames.contains("last_connection")) {
                        db.createObjectStore("last_connection",
                            { autoIncrement: true });
                    }
                    if(!db.objectStoreNames.contains("last_update")) {
                        db.createObjectStore("last_update",
                            { autoIncrement: true });
                    }
                };
                requestDB.onsuccess = function(e) {
                    $log.debug("connected to DB");

                    db = e.target.result;


                    // We add a line to the table last_connection
                    var transaction = db.transaction(["last_connection"], "readwrite");
                    var store = transaction.objectStore("last_connection");
                    var date = new Date();

                    store.add(date.getTime());

                    // We put the value in cache
                    lastConnection = date.getTime();

                    // Works

                    // Retrieve the last update
                    _this.retrieveLastUpdate().then(function(data) {
                        // It was never updated, init
                        if(lastUpdate == null)
                            deferred.resolve({init: true});
                        // Simple update is needed
                        else if(_this.needToUpdate())
                            deferred.resolve({update: true});
                        // Everything is fine
                        else {
                            deferred.resolve(undefined);
                        }
                    });
                };
                requestDB.onerror = function(){
                };

                return deferred.promise;
            },
            getDB: function() {
                return db;
            }
        };
    }

})();

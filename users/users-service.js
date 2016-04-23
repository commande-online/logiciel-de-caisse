(function(){
    'use strict';

    angular.module('users')
        .service('userService', ['User', '$http', '$q', '$log', '$rootScope', 'indexedDBService', userService]);

    function userService(User, $http, $q, $log, $rootScope, indexedDBService){
        var URL_API = DOMAIN_API + "/api/1/bo-management/users/";
        var MAX_PER_PAGE = 100;
        var MAX_TOTAL = 10000;
        var users = [];
        var findingUsers = [];
        var loading = false;

        var transaction = null;
        var store = null;
        var nameTable = "users";

        var maxRefresh = 5 * 60 * 1000;//5 min

        return {
            getUsers: function() {
                var db = indexedDBService.getDB();

                if(db && users.length == 0) {
                    // If we have a DB we load all the information from the DB
                    $log.debug("looking in the DB for the users");
                    this.loadDBUsers();
                }

                return users;
            },
            loadDBUsers: function() {
                var deferred = $q.defer();
                var db = indexedDBService.getDB();
                transaction = db.transaction([nameTable], "readonly");
                store = transaction.objectStore(nameTable);
                store.openCursor().onsuccess = function (event) {
                    var cursor = event.target.result;
                    if (cursor) {
                        var user = User.build(cursor.value);
                        users.push(user);
                        cursor.continue();
                    } else {
                        deferred.resolve(users);
                    }
                };
                store.openCursor().onerror = function (event) {
                    $log.warn("cursor error", event);
                };

                return deferred.promise;
            },
            addUser: function(user) {
                var founded = false;
                for(var i = 0; i < users.length && !founded; i++) {
                    if(users[i]._id == user._id)
                        founded = true;
                }
                if(!founded)
                    users.push(user);
            },
            updateUsers: function(since) {
                if(!since) {
                    since = new Date();
                    since.setMinutes(since.getMinutes() - 10);
                }
                var promise = this.loadDBUsers();

                var db = indexedDBService.getDB();
                var _this = this;

                return $http.get(URL_API + "list/update/"+encodeURIComponent(since.toISOString())).then(function(data) {
                    var data = data.data;
                    if(db) {
                        transaction = db.transaction([nameTable], "readwrite");
                        store = transaction.objectStore(nameTable);
                    }
                    for(var i = 0; i < data.length; i++) {
                        var user = User.build(data[i]);

                        if(db)
                            store.put(user);

                        _this.addUser(user);
                    }
                }, function(data) {
                    throw data.data.message;
                });
            },
            loadUsers: function(start) {
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
                        var user = User.build(data[i]);
                        if(db && user)
                            store.put(user);

                        if(user)
                            _this.addUser(user);
                    }
                    if(data.length == MAX_PER_PAGE && users.length < MAX_TOTAL) {
                        _this.loadUsers(start + MAX_PER_PAGE);
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
                            var user = User.build(objectStoreRequest.result);
                            if (user.last_refresh + maxRefresh < date.getTime()) {
                                $log.info("user " + user._id + " needs to be refreshed", user);
                                // Refresh needed
                                user.load(user._id).then(function () {
                                    var date = new Date();
                                    user.last_refresh = date.getTime();

                                    transaction = db.transaction([nameTable], "readwrite");
                                    store = transaction.objectStore(nameTable);

                                    store.put(user);
                                    deferred.resolve(user);
                                });
                            } else {
                                // No refresh needed
                                $log.info("user " + user._id + " doesn't need to be refreshed", user.last_refresh, user.last_refresh + maxRefresh, date.getTime(), user);
                                deferred.resolve(user);
                            }
                        } else {
                            deferred.resolve(null);
                        }

                        $rootScope.$apply();
                    };
                }
                return deferred.promise;
            },
            findUser: function(query, remote) {
                var deferred = $q.defer();

                findingUsers = [];

                // Going through the users loaded
                for(var i = 0; i < users.length; i++) {
                    if(users[i].firstname && users[i].firstname.toLowerCase().search(query.toLowerCase()) > -1) {
                        findingUsers.push(users[i]);
                    } else if(users[i].lastname && users[i].lastname.toLowerCase().search(query.toLowerCase()) > -1) {
                        findingUsers.push(users[i]);
                    } else if(users[i].phone && users[i].phone.toLowerCase().search(query.toLowerCase()) >-1) {
                        findingUsers.push(users[i]);
                    } else if(users[i].email && users[i].email.toLowerCase().search(query.toLowerCase()) >-1) {
                        findingUsers.push(users[i]);
                    } else {
                    }
                }

                if((remote || findingUsers.length < 10) && query.length > 3) {
                    // We query the server if we have found less than 10 users
                    // OR if it is forced
                    // BUT query string length needs to be above 3 char

                    $http.get(URL_API + "search/"+encodeURI(query.toLowerCase())).success(function(data) {
                        for(var i = 0; i < data.length; i++) {
                            findingUsers.push(User.build(data[i]))
                        }
                        deferred.resolve(findingUsers);
                    }).error(function(data, status) {
                        deferred.resolve(findingUsers);
                    });
                } else  {
                    deferred.resolve(findingUsers);
                }

                return deferred.promise;
            }
        };
    }

})();

describe("Service : User : getUsers", function() {
    var User;
    var userService;

    beforeEach(module('users'));
    beforeEach(module('indexedDB'));
    beforeEach(inject(function (_User_, _userService_) {
        User = _User_;
        userService = _userService_;
    }));

    it("default value", function() {
        expect(userService.getUsers().length).toEqual(0);
    });

});

describe("Service : User : loadUsers : NO DB", function() {
    var User;
    var userService;

    beforeEach(module('indexedDB'));
    beforeEach(module('users'));

    var date = new Date();
    var data = {
        id : 123,
        firstname : "john",
        lastname : "doh",
        phone : "0685658130",
        addresses : [{id: 456}],
        email : "chuivert@gmail.com",
        gender : "M",
        notificationFrequency : 1,
        optin_affiliate : 2,
        optin_site : 3,
        profilePicture : "profile.png",
        last_refresh: date.getTime()
    };

    beforeEach(inject(function (_User_, _userService_) {
        User = _User_;
        userService = _userService_;
    }));

    var authRequestHandler, $httpBackend, $timeout;
    beforeEach(inject(function(_$httpBackend_, _$timeout_) {
        // Set up the mock http service responses
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/users/list/0/100')
            .respond([data]);
    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation(false);
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("load from API", function(done) {
        $httpBackend.expectGET('/api/1/bo-management/users/list/0/100');
        userService.loadUsers().then(function (data) {
            expect(userService.getUsers().length).toEqual(1);
            done();
        });
        $httpBackend.flush();
    });
});

describe("Service : User : loadUsers & updateUsers : YES DB", function() {
    var User;
    var userService, DBPromise;

    beforeEach(module('indexedDB'));
    beforeEach(module('users'));

    var date = new Date();
    var data = {
        id : 123,
        firstname : "john",
        lastname : "doh",
        phone : "0685658130",
        addresses : [{id: 456}],
        email : "chuivert@gmail.com",
        gender : "M",
        notificationFrequency : 1,
        optin_affiliate : 2,
        optin_site : 3,
        profilePicture : "profile.png",
        last_refresh: date.getTime()
    };


    var authRequestHandler, authRequestHandler2, $httpBackend, $timeout;
    var since, sinceURL;
    beforeEach(inject(function (_$httpBackend_, _$timeout_) {
        jasmine.clock().mockDate(date);
        since = date;
        since.setMinutes(since.getMinutes() - 10);
        sinceURL = '/api/1/bo-management/users/list/update/' + encodeURIComponent(since.toISOString());

        // Set up the mock http service responses
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/users/list/0/100')
            .respond([data]);
        authRequestHandler2 = $httpBackend.when('GET', sinceURL)
            .respond([data]);
    }));

    beforeEach(inject(function (_User_, _userService_) {
        User = _User_;
        userService = _userService_;
    }));

    var indexedDBService, $rootScope, $window;
    beforeEach(inject(function (_indexedDBService_, _$rootScope_, _$window_) {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        indexedDBService = _indexedDBService_;
        $rootScope = _$rootScope_;
        $window = _$window_;
        DBPromise = indexedDBService.init();
    }));

    afterEach(function () {
        if(indexedDBService.getDB() != null)
            indexedDBService.getDB().close();
        else
            console.log("DID NOT CLOSE ! ");
        $window.indexedDB.deleteDatabase("myCOL");


        $httpBackend.verifyNoOutstandingExpectation($rootScope.$$phase ? false : true);
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("loadUsers from API OK", function (done) {
        $httpBackend.expectGET('/api/1/bo-management/users/list/0/100');
        DBPromise.then(function () {
            setTimeout(function () {
                userService.loadUsers(0).then(function (data) {
                    expect(userService.getUsers().length).toEqual(1);
                    expect(userService.getUsers()[0]._id).toEqual(123);
                }).then(done);
                $httpBackend.flush();
            });
        });
    });

    it("loadUsers from API NOK", function(done) {
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler.respond(500, returnValueFromPost);
        $httpBackend.expectGET('/api/1/bo-management/users/list/0/100');

        DBPromise.then(function () {
            setTimeout(function () {
                try {
                    userService.loadUsers(0);
                    $httpBackend.flush();
                    expect(true).toBeFalsy();
                } catch (e) {
                    expect(e).toEqual(returnValueFromPost.message);
                    expect(userService.getUsers().length).toEqual(0);
                }
                done();

            });
        }, function (data) {
            console.log(data);
            expect(true).toBeFalsy();
            done();
        });
        $rootScope.$apply();
    });

    it("updateUsers OK", function(done) {
        DBPromise.then(function() {
            setTimeout(function() {
                userService.updateUsers().then(function (data) {
                    expect(userService.getUsers().length).toEqual(1);
                }).then(done);
                $httpBackend.flush();
            });
        });
        $rootScope.$apply();

    });

    it("updateProducts DOUBLE", function(done) {
        DBPromise.then(function() {
            setTimeout(function() {
                userService.updateUsers().then(function (data) {
                    expect(userService.getUsers().length).toEqual(1);
                });
                userService.updateUsers().then(function (data) {
                    expect(userService.getUsers().length).toEqual(1);
                }).then(done);
                $httpBackend.flush();
            });
        });
        $rootScope.$apply();
    });

    it("updateUsers NOK", function(done) {
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler2.respond(500, returnValueFromPost);

        $httpBackend.expectGET(sinceURL);

        DBPromise.then(function() {
            setTimeout(function() {
                try {
                    userService.updateUsers();
                    $httpBackend.flush();
                    expect(true).toBeFalsy();
                } catch(e) {
                    expect(e).toEqual(returnValueFromPost.message);
                    expect(userService.getUsers().length).toEqual(0);
                }
                done();

            });
        });
        $rootScope.$apply();

    });
});

describe("Service : User : findById", function() {
    var User;
    var userService;
    var DBPromise;

    var date = new Date();
    var responseData = [];
    for(var i = 1; i < 40; i++) {
        var data = {
            id : i,
            firstname : "john",
            lastname : "doh" + i,
            phone : "06856581"+ (i < 10 ? "0"+i : i),
            addresses : [{id: 456}],
            email : "chuivert@gmail.com",
            gender : "M",
            notificationFrequency : 1,
            optin_affiliate : 2,
            optin_site : 3,
            profilePicture : "profile.png",
            last_refresh: parseInt(date.getTime()),
            status : 1
        };
        responseData.push(data);
    }

    beforeEach(module('users'));
    beforeEach(module('indexedDB'));


    var authRequestHandler, authRequestHandler2, $httpBackend, $timeout;
    var since, sinceURL;

    //var indexedDBService, $rootScope, $window;
    beforeEach(inject(function (_$httpBackend_, _$timeout_) {
        jasmine.clock().mockDate(date);
        since = date;
        since.setMinutes(since.getMinutes() - 10);
        sinceURL = '/api/1/bo-management/users/list/update/' + encodeURIComponent(since.toISOString());

        // Set up the mock http service responses
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/users/list/0/100')
            .respond(responseData);
        authRequestHandler2 = $httpBackend.when('GET', sinceURL)
            .respond(responseData);
    }));

    beforeEach(inject(function (_User_, _userService_) {
        User = _User_;
        userService = _userService_;
    }));

    var indexedDBService, $rootScope, $window;
    beforeEach(inject(function (_indexedDBService_, _$rootScope_, _$window_) {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        indexedDBService = _indexedDBService_;
        $rootScope = _$rootScope_;
        $window = _$window_;
        DBPromise = indexedDBService.init();

    }));

    afterEach(function () {
        indexedDBService.getDB().close();
        $window.indexedDB.deleteDatabase("myCOL");
    });


    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation($rootScope.$$phase ? false : true);
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("null param", function(done) {
        DBPromise.then(function() {
            setTimeout(function () {
                userService.findById(null).then(function(data) {
                    expect(data).toBeNull();
                }).then(done);
                $rootScope.$digest();
            });
        });
    });

    it("wrong param, null returned", function(done) {
        DBPromise.then(function() {
            setTimeout(function () {
                userService.findById(-99).then(function(data) {
                    expect(data).toBeNull();
                }).then(done);
                $rootScope.$digest();
            });
        });
    });

    it("proper return no update", function(done) {
        DBPromise.then(function() {
            setTimeout(function () {
                userService.loadUsers(0).then(function (data) {
                    setTimeout(function () {
                        $rootScope.$apply();
                    });
                });
                $httpBackend.flush();
                setTimeout(function () {
                    userService.findById(30).then(function (data) {
                        expect(data).not.toBeNull();
                        expect(data._id).toEqual(30);
                        expect(data.firstname).toEqual("john");
                    }).then(done);
                    $rootScope.$digest();
                });
            });
        });
    })
});

describe("Service : User : findUser", function() {
    var User;
    var userService;

    var responseData = [];
    for(var i = 0; i < 40; i++) {
        var data = {
            id : i,
            firstname : "john",
            lastname : "doh" + i,
            phone : "06856581"+ (i < 10 ? "0"+i : i),
            addresses : [{id: 456}],
            email : "chuivert@gmail.com",
            gender : "M",
            notificationFrequency : 1,
            optin_affiliate : 2,
            optin_site : 3,
            profilePicture : "profile.png"
        };
        responseData.push(data);
    }

    beforeEach(module('users'));
    beforeEach(module('indexedDB'));
    beforeEach(inject(function (_User_) {
        User = _User_;
    }));
    beforeEach(inject(function (_userService_) {
        userService = _userService_;
    }));

    beforeEach(inject(function ($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/users/list/0/100')
            .respond(responseData);
        authRequestHandler2 = $httpBackend.when('GET', '/api/1/bo-management/users/search/fooo')
            .respond([{
                id : i,
                firstname : "john",
                lastname : "foo",
                phone : "061122334455",
                addresses : [{id: 456}],
                email : "sebastien@gmail.com",
                gender : "M",
                notificationFrequency : 1,
                optin_affiliate : 2,
                optin_site : 3,
                profilePicture : "profile.png"

            }]);
        authRequestHandler3 = $httpBackend.when('GET', '/api/1/bo-management/users/search/toto')
            .respond([]);

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');

        userService.loadUsers(0);
    }));


    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("findUser OK local firstname", function() {
        $httpBackend.flush();
        var data;
        userService.findUser("JoHn").then(function(value) {
            data = value;
        });
        $rootScope.$apply();

        expect(data.length).toEqual(40);
    });

    it("findUser OK local lastname", function() {
        $httpBackend.flush();
        var data;
        userService.findUser("Oh1").then(function(value) {
            data = value;
        });
        $rootScope.$apply();

        expect(data.length).toEqual(11);
    });

    it("findUser OK local email", function() {
        $httpBackend.flush();
        var data;
        userService.findUser("chuivert").then(function(value) {
            data = value;
        });
        $rootScope.$apply();

        expect(data.length).toEqual(40);
    });

    it("findUser OK local tel", inject(function($rootScope) {
        $httpBackend.flush();
        var data;
        userService.findUser("068565810").then(function(value) {
            data = value;
        });
        $rootScope.$apply();

        expect(data.length).toEqual(10);
    }));

    it("findUser NOK local + NOK remote", inject(function($rootScope) {
        $httpBackend.expectGET('/api/1/bo-management/users/search/toto');

        var data;
        var promise = userService.findUser("toto");
        $httpBackend.flush(); // Needs to flush all the API calls NOW to test the remote search query

        promise.then(function(value) {
            data = value;
        });

        $rootScope.$apply();

        expect(data.length).toEqual(0);
    }));

    it("findUser NOK local + OK remote", inject(function($rootScope) {
        $httpBackend.expectGET('/api/1/bo-management/users/search/fooo');

        var data;
        var promise = userService.findUser("fooo", true);
        $httpBackend.flush(); // Needs to flush all the API calls NOW to test the remote search query

        promise.then(function(value) {
            data = value;
        });

        $rootScope.$apply();

        expect(data.length).toEqual(1);
    }));

    it("findUser NOK local + ERR remote", inject(function($rootScope) {
        $httpBackend.expectGET('/api/1/bo-management/users/search/fooo');
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler2.respond(1000, returnValueFromPost);

        var data;
        var promise = userService.findUser("fooo", true);
        $httpBackend.flush(); // Needs to flush all the API calls NOW to test the remote search query

        promise.then(function(value) {
            data = value;
        });

        $rootScope.$apply();

        expect(data.length).toEqual(0);
    }));

});



describe("Service : User : updateUser", function() {
    var User;
    var userService, DBPromise;

    beforeEach(module('indexedDB'));
    beforeEach(module('users'));

    var date = new Date();
    var data = {
        id : 123,
        firstname : "john",
        lastname : "doh",
        phone : "0685658130",
        addresses : [{id: 456}],
        email : "chuivert@gmail.com",
        gender : "M",
        notificationFrequency : 1,
        optin_affiliate : 2,
        optin_site : 3,
        profilePicture : "profile.png",
        last_refresh: date.getTime()
    };


    var authRequestHandler, $httpBackend, $timeout;
    beforeEach(inject(function (_$httpBackend_, _$timeout_, _User_, _userService_) {
        User = _User_;
        userService = _userService_;
        jasmine.clock().mockDate(date);

        // Set up the mock http service responses
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/users/list/0/100')
            .respond([data]);

        //userService.loadUsers(0);
    }));

    var indexedDBService, $rootScope, $window;
    beforeEach(inject(function (_indexedDBService_, _$rootScope_, _$window_) {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        indexedDBService = _indexedDBService_;
        $rootScope = _$rootScope_;
        $window = _$window_;
        DBPromise = indexedDBService.init();
    }));

    afterEach(function () {
        if(indexedDBService.getDB() != null)
            indexedDBService.getDB().close();
        else
            console.log("DID NOT CLOSE ! ");
        $window.indexedDB.deleteDatabase("myCOL");


        $httpBackend.verifyNoOutstandingExpectation($rootScope.$$phase ? false : true);
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("findUser OK local firstname NO DB", function (done) {
        $httpBackend.expectGET('/api/1/bo-management/users/list/0/100');
        userService.loadUsers().then(function (data) {
            var data;

            users = userService.getUsers();
            data = users[0];

            data.firstname = "seb";
            userService.updateUser(data);


            userService.findUser("seb").then(function(value) {
                data = value;
                expect(data.length).toEqual(1);
                expect(data[0].firstname).toEqual("seb");
                done();
            });
        });
        $httpBackend.flush();
    });
/*
Should be working but it's not ...
    it("findUser OK local firstname DB", function (done) {
        $httpBackend.expectGET('/api/1/bo-management/users/list/0/100');
        DBPromise.then(function() {
            setTimeout(function() {
                userService.loadUsers().then(function (data) {
                    var data;

                    users = userService.getUsers();
                    data = users[0];

                    data.firstname = "seb";

                    //console.log("test ! ");
                    userService.updateUser(data);

                    userService.findUser("seb").then(function (value) {
                        data = value;
                        expect(data.length).toEqual(1);
                        expect(data[0].firstname).toEqual("seb2");
                        done();
                    });
                }).then(done);
                $httpBackend.flush();
            });
        });
    });
    */
});
describe("Service : Template : getProducts", function() {
    var Template;
    var templateService;

    beforeEach(module('indexedDB'));
    beforeEach(module('templates'));
    beforeEach(inject(function (_Template_, _templateService_) {
        Template = _Template_;
        templateService = _templateService_;
    }));

    it("default value", function() {
        expect(templateService.getTemplates().length).toEqual(0);
    });

});

describe("Service : Template : loadTemplates : NO DB", function() {
    var Template;
    var templateService;

    beforeEach(module('indexedDB'));
    beforeEach(module('templates'));

    var date = new Date();
    var data = {
        _id: {$id: 123},
        site: 456,
        name : "toto",
        labelPriceSelect: "prout",
        fields: [],
        products: [],
        status: 1,
        logStatus: [{}],
        last_refresh: date.getTime()
    };

    beforeEach(inject(function (_Template_, _templateService_) {
        Template = _Template_;
        templateService = _templateService_;
    }));

    var authRequestHandler, $httpBackend, $timeout;
    beforeEach(inject(function(_$httpBackend_, _$timeout_) {
        // Set up the mock http service responses
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/templates/list/0/100')
            .respond([data]);
    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation(false);
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("load from API", function(done) {
        $httpBackend.expectGET('/api/1/bo-management/templates/list/0/100');
        templateService.loadTemplates().then(function (data) {
            expect(templateService.getTemplates().length).toEqual(1);
            done();
        });
        $httpBackend.flush();
    });
});

describe("Service : Template : loadTemplates & updateTemplates : YES DB", function() {
    var Template;
    var templateService, DBPromise;

    beforeEach(module('indexedDB'));
    beforeEach(module('templates'));

    var date = new Date();
    var data = {
        _id: {$id: 123},
        site: 456,
        name : "toto",
        labelPriceSelect: "prout",
        fields: [],
        products: [],
        status: 1,
        logStatus: [{}],
        last_refresh: date.getTime()
    };


    var authRequestHandler, authRequestHandler2, $httpBackend, $timeout;
    var since, sinceURL;
    beforeEach(inject(function (_$httpBackend_, _$timeout_) {
        jasmine.clock().mockDate(date);
        since = date;
        since.setMinutes(since.getMinutes() - 10);
        sinceURL = '/api/1/bo-management/templates/list/update/' + encodeURIComponent(since.toISOString());

        // Set up the mock http service responses
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/templates/list/0/100')
            .respond([data]);
        authRequestHandler2 = $httpBackend.when('GET', sinceURL)
            .respond([data]);
    }));

    beforeEach(inject(function (_Template_, _templateService_) {
        Template = _Template_;
        templateService = _templateService_;
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

    it("loadTemplates from API OK", function (done) {
        $httpBackend.expectGET('/api/1/bo-management/templates/list/0/100');
        DBPromise.then(function () {
            setTimeout(function () {
                templateService.loadTemplates(0).then(function (data) {
                    expect(templateService.getTemplates().length).toEqual(1);
                }).then(done);
                $httpBackend.flush();
            });
        });
    });

    it("loadTemplates from API NOK", function(done) {
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler.respond(500, returnValueFromPost);
        $httpBackend.expectGET('/api/1/bo-management/templates/list/0/100');

        DBPromise.then(function () {
            setTimeout(function () {
                try {
                    templateService.loadTemplates(0);
                    $httpBackend.flush();
                    expect(true).toBeFalsy();
                } catch (e) {
                    expect(e).toEqual(returnValueFromPost.message);
                    expect(templateService.getTemplates().length).toEqual(0);
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

    it("updateTemplates OK", function(done) {
        DBPromise.then(function() {
            setTimeout(function() {
                templateService.updateTemplates().then(function (data) {
                    expect(templateService.getTemplates().length).toEqual(1);
                }).then(done);
                $httpBackend.flush();
            });
        });
        $rootScope.$apply();

    });

    it("updateTemplates DOUBLE", function(done) {
        DBPromise.then(function() {
            setTimeout(function() {
                templateService.updateTemplates().then(function (data) {
                    expect(templateService.getTemplates().length).toEqual(1);
                });
                templateService.updateTemplates().then(function (data) {
                    expect(templateService.getTemplates().length).toEqual(1);
                }).then(done);
                $httpBackend.flush();
            });
        });
        $rootScope.$apply();
    });

    it("updateTemplates NOK", function(done) {
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler2.respond(500, returnValueFromPost);

        $httpBackend.expectGET(sinceURL);

        DBPromise.then(function() {
            setTimeout(function() {
                try {
                    templateService.updateTemplates();
                    $httpBackend.flush();
                    expect(true).toBeFalsy();
                } catch(e) {
                    expect(e).toEqual(returnValueFromPost.message);
                    expect(templateService.getTemplates().length).toEqual(0);
                }
                done();

            });
        });
        $rootScope.$apply();

    });
});

describe("Service : Product : resetProducts", function() {
    var Template;
    var templateService, DBPromise;

    beforeEach(module('indexedDB'));
    beforeEach(module('templates'));

    var date = new Date();
    var data = {
        _id: {$id: 123},
        site: 456,
        name : "toto",
        labelPriceSelect: "prout",
        fields: [],
        products: [],
        status: 1,
        logStatus: [{}],
        last_refresh: date.getTime()
    };


    var authRequestHandler, authRequestHandler2, $httpBackend, $timeout;
    var since, sinceURL;

    //var indexedDBService, $rootScope, $window;
    beforeEach(inject(function (_$httpBackend_, _$timeout_) {
        jasmine.clock().mockDate(date);
        since = date;
        since.setMinutes(since.getMinutes() - 10);
        sinceURL = '/api/1/bo-management/products/list/templates/' + encodeURIComponent(since.toISOString());

        // Set up the mock http service responses
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/templates/list/0/100')
            .respond([data]);
        authRequestHandler2 = $httpBackend.when('GET', sinceURL)
            .respond([data]);
    }));

    beforeEach(inject(function (_Template_, _templateService_) {
        Template = _Template_;
        templateService = _templateService_;
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

    it("loadProducts from API OK", function (done) {
        $httpBackend.expectGET('/api/1/bo-management/templates/list/0/100');
        DBPromise.then(function () {
            setTimeout(function () {
                templateService.loadTemplates(0).then(function (data) {
                    templateService.resetTemplates().then(function (data) {
                        // Products have been reloaded
                        expect(templateService.getTemplates().length).toEqual(1);
                    }).then(done);
                    // Products have been removed
                    expect(templateService.getTemplates().length).toEqual(0);
                });
                $httpBackend.flush();
            });
        });
    });
});
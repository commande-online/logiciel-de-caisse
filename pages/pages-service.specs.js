describe("Service : Page : getPages", function() {
    var Page;
    var pageService;

    beforeEach(module('indexedDB'));
    beforeEach(module('pages'));
    beforeEach(inject(function (_Page_, _pageService_) {
        Page = _Page_;
        pageService = _pageService_;
    }));

    it("default value", function() {
        expect(pageService.getPages().length).toEqual(0);
    });

});

describe("Service : Page : loadPages : NO DB", function() {
    var Page;
    var pageService;

    beforeEach(module('indexedDB'));
    beforeEach(module('pages'));

    var date = new Date();
    var data = {
        _id: {$id: 123},
        site: 456,
        name : "toto",
        title: "prout",
        lang: "fr",
        comment: true,
        versions: ["ok"],
        tags: ["hl"],
        links: ["olkisdjf"],
        comments: ["poisdfjc;"],
        last_refresh: date.getTime()
    };

    beforeEach(inject(function (_Page_, _pageService_) {
        Page = _Page_;
        pageService = _pageService_;
    }));

    var authRequestHandler, $httpBackend, $timeout;
    beforeEach(inject(function(_$httpBackend_, _$timeout_) {
        // Set up the mock http service responses
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/pages/list/0/100')
            .respond([data]);
    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation(false);
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("load from API", function(done) {
        $httpBackend.expectGET('/api/1/bo-management/pages/list/0/100');
        pageService.loadPages().then(function (data) {
            expect(pageService.getPages().length).toEqual(1);
            done();
        });
        $httpBackend.flush();
    });
});

describe("Service : Page : loadPages & updatePages : YES DB", function() {
    var Page;
    var pageService, DBPromise;

    beforeEach(module('indexedDB'));
    beforeEach(module('pages'));

    var date = new Date();
    var data = {
        _id: {$id: 123},
        site: 456,
        name : "toto",
        title: "prout",
        lang: "fr",
        comment: true,
        versions: ["ok"],
        tags: ["hl"],
        links: ["olkisdjf"],
        comments: ["poisdfjc;"],
        last_refresh: date.getTime()
    };


    var authRequestHandler, authRequestHandler2, $httpBackend, $timeout;
    var since, sinceURL;
    beforeEach(inject(function (_$httpBackend_, _$timeout_) {
        jasmine.clock().mockDate(date);
        since = date;
        since.setMinutes(since.getMinutes() - 10);
        sinceURL = '/api/1/bo-management/pages/list/update/' + encodeURIComponent(since.toISOString());

        // Set up the mock http service responses
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/pages/list/0/100')
            .respond([data]);
        authRequestHandler2 = $httpBackend.when('GET', sinceURL)
            .respond([data]);
    }));

    beforeEach(inject(function (_Page_, _pageService_) {
        Page = _Page_;
        pageService = _pageService_;
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

    it("loadPages from API OK", function (done) {
        $httpBackend.expectGET('/api/1/bo-management/pages/list/0/100');
        DBPromise.then(function () {
            setTimeout(function () {
                pageService.loadPages(0).then(function (data) {
                    expect(pageService.getPages().length).toEqual(1);
                }).then(done);
                $httpBackend.flush();
            });
        });
    });

    it("loadPages from API NOK", function(done) {
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler.respond(500, returnValueFromPost);
        $httpBackend.expectGET('/api/1/bo-management/pages/list/0/100');

        DBPromise.then(function () {
            setTimeout(function () {
                try {
                    pageService.loadPages(0);
                    $httpBackend.flush();
                    expect(true).toBeFalsy();
                } catch (e) {
                    expect(e).toEqual(returnValueFromPost.message);
                    expect(pageService.getPages().length).toEqual(0);
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

    it("updatePages OK", function(done) {
        DBPromise.then(function() {
            setTimeout(function() {
                pageService.updatePages().then(function (data) {
                    expect(pageService.getPages().length).toEqual(1);
                }).then(done);
                $httpBackend.flush();
            });
        });
        $rootScope.$apply();

    });

    it("updatePages DOUBLE", function(done) {
        DBPromise.then(function() {
            setTimeout(function() {
                pageService.updatePages().then(function (data) {
                    expect(pageService.getPages().length).toEqual(1);
                });
                pageService.updatePages().then(function (data) {
                    expect(pageService.getPages().length).toEqual(1);
                }).then(done);
                $httpBackend.flush();
            });
        });
        $rootScope.$apply();
    });

    it("updatePages NOK", function(done) {
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler2.respond(500, returnValueFromPost);

        $httpBackend.expectGET(sinceURL);

        DBPromise.then(function() {
            setTimeout(function() {
                try {
                    pageService.updatePages();
                    $httpBackend.flush();
                    expect(true).toBeFalsy();
                } catch(e) {
                    expect(e).toEqual(returnValueFromPost.message);
                    expect(pageService.getPages().length).toEqual(0);
                }
                done();

            });
        });
        $rootScope.$apply();

    });
});
/**/
describe("Service : Page : resetPages", function() {
    var Page;
    var pageService, DBPromise;

    beforeEach(module('indexedDB'));
    beforeEach(module('pages'));

    var date = new Date();
    var data = {
        _id: {$id: 123},
        site: 456,
        name : "toto",
        title: "prout",
        lang: "fr",
        comment: true,
        versions: ["ok"],
        tags: ["hl"],
        links: ["olkisdjf"],
        comments: ["poisdfjc;"],
        last_refresh: date.getTime()
    };


    var authRequestHandler, authRequestHandler2, $httpBackend, $timeout;
    var since, sinceURL;

    //var indexedDBService, $rootScope, $window;
    beforeEach(inject(function (_$httpBackend_, _$timeout_) {
        jasmine.clock().mockDate(date);
        since = date;
        since.setMinutes(since.getMinutes() - 10);
        sinceURL = '/api/1/bo-management/products/list/pages/' + encodeURIComponent(since.toISOString());

        // Set up the mock http service responses
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/pages/list/0/100')
            .respond([data]);
        authRequestHandler2 = $httpBackend.when('GET', sinceURL)
            .respond([data]);
    }));

    beforeEach(inject(function (_Page_, _pageService_) {
        Page = _Page_;
        pageService = _pageService_;
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

    it("loadPages from API OK", function (done) {
        $httpBackend.expectGET('/api/1/bo-management/pages/list/0/100');
        DBPromise.then(function () {
            setTimeout(function () {
                pageService.loadPages(0).then(function (data) {
                    pageService.resetPages().then(function (data) {
                        // Pages have been reloaded
                        expect(pageService.getPages().length).toEqual(1);
                    }).then(done);
                    // Pages have been removed
                    expect(pageService.getPages().length).toEqual(0);
                });
                $httpBackend.flush();
            });
        });
    });
});
/**/
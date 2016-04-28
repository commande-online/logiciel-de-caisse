describe("Service : Language : getLanguages", function() {
    var languageService;

    beforeEach(module('indexedDB'));
    beforeEach(module('shops'));
    beforeEach(inject(function (_languageService_) {
        languageService = _languageService_;
    }));

    it("default value", function() {
        expect(languageService.getLanguages().length).toEqual(0);
    });

});

describe("Service : Language : loadLanguages & getLanguages : NO DB", function() {
    var languageService;

    var date = new Date();
    var data = {key: "fr", name: "français", flag: "fr"};

    beforeEach(module('indexedDB'));
    beforeEach(module('shops'));
    beforeEach(inject(function (_languageService_) {
        languageService = _languageService_;
    }));

    var authRequestHandler, $httpBackend, $timeout;
    beforeEach(inject(function(_$httpBackend_, _$timeout_) {
        // Set up the mock http service responses
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/languages')
            .respond([data]);
    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation(false);
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("load from API", function(done) {
        $httpBackend.expectGET('/api/1/bo-management/languages');
        languageService.loadLanguages().then(function (data) {
            expect(languageService.getLanguages().length).toEqual(1);
            done();
        });
        $httpBackend.flush();
    });
});

describe("Service : Language : loadLanguages & getLanguages : YES DB", function() {
    var languageService, DBPromise;

    beforeEach(module('indexedDB'));
    beforeEach(module('shops'));
    beforeEach(inject(function (_languageService_) {
        languageService = _languageService_;
    }));

    var date = new Date();
    var data = {key: "fr", name: "français", flag: "fr"};


    var authRequestHandler, authRequestHandler2, $httpBackend, $timeout;
    var since, sinceURL;
    beforeEach(inject(function (_$httpBackend_, _$timeout_) {
        // Set up the mock http service responses
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/languages')
            .respond([data]);
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

    it("loadLanguages from API OK", function (done) {
        $httpBackend.expectGET('/api/1/bo-management/languages');
        DBPromise.then(function () {
            setTimeout(function () {
                languageService.loadLanguages().then(function (data) {
                    expect(languageService.getLanguages().length).toEqual(1);
                }).then(done);
                $httpBackend.flush();
            });
        });
    });
});
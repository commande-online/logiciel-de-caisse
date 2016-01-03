describe("Service : Category : getProducts", function() {
    var Category;
    var categoryService;

    beforeEach(module('indexedDB'));
    beforeEach(module('categories'));
    beforeEach(inject(function (_Category_, _categoryService_) {
        Category = _Category_;
        categoryService = _categoryService_;
    }));

    it("default value", function() {
        expect(categoryService.getCategories().length).toEqual(0);
    });

});

describe("Service : Category : loadCategories : NO DB", function() {
    var Category;
    var categoryService;

    beforeEach(module('indexedDB'));
    beforeEach(module('categories'));

    var date = new Date();
    var data = {
        _id: {$id: 123},
        site: 456,
        infos : {fr: {lang: "fr", name: "product"}},
        products: [],
        ingredients: [],
        position: 9,
        status: 1,
        logStatus: [{}],
        order_button_color: "#CC00EE",
        last_refresh: date.getTime()
    };

    beforeEach(inject(function (_Category_, _categoryService_) {
        Category = _Category_;
        categoryService = _categoryService_;
    }));

    var authRequestHandler, $httpBackend, $timeout;
    beforeEach(inject(function(_$httpBackend_, _$timeout_) {
        // Set up the mock http service responses
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/categories/list/0/100')
            .respond([data]);
    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation(false);
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("load from API", function(done) {
        $httpBackend.expectGET('/api/1/bo-management/categories/list/0/100');
        categoryService.loadCategories().then(function (data) {
            expect(categoryService.getCategories().length).toEqual(1);
            done();
        });
        $httpBackend.flush();
    });
});

describe("Service : Category : loadCategories & updateCategories : YES DB", function() {
    var Category;
    var categoryService, DBPromise;

    beforeEach(module('indexedDB'));
    beforeEach(module('categories'));

    var date = new Date();
    var data = {
        _id: {$id: 123},
        site: 456,
        infos : {fr: {lang: "fr", name: "product"}},
        products: [],
        ingredients: [],
        position: 9,
        status: 1,
        logStatus: [{}],
        order_button_color: "#CC00EE",
        last_refresh: date.getTime()
    };


    var authRequestHandler, authRequestHandler2, $httpBackend, $timeout;
    var since, sinceURL;
    beforeEach(inject(function (_$httpBackend_, _$timeout_) {
        jasmine.clock().mockDate(date);
        since = date;
        since.setMinutes(since.getMinutes() - 10);
        sinceURL = '/api/1/bo-management/categories/list/update/' + encodeURIComponent(since.toISOString());

        // Set up the mock http service responses
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/categories/list/0/100')
            .respond([data]);
        authRequestHandler2 = $httpBackend.when('GET', sinceURL)
            .respond([data]);
    }));

    beforeEach(inject(function (_Category_, _categoryService_) {
        Category = _Category_;
        categoryService = _categoryService_;
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

    it("loadCategories from API OK", function (done) {
        $httpBackend.expectGET('/api/1/bo-management/categories/list/0/100');
        DBPromise.then(function () {
            setTimeout(function () {
                categoryService.loadCategories(0).then(function (data) {
                    expect(categoryService.getCategories().length).toEqual(1);
                }).then(done);
                $httpBackend.flush();
            });
        });
    });

    it("loadCategories from API NOK", function(done) {
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler.respond(500, returnValueFromPost);
        $httpBackend.expectGET('/api/1/bo-management/categories/list/0/100');

        DBPromise.then(function () {
            setTimeout(function () {
                try {
                    categoryService.loadCategories(0);
                    $httpBackend.flush();
                    expect(true).toBeFalsy();
                } catch (e) {
                    expect(e).toEqual(returnValueFromPost.message);
                    expect(categoryService.getCategories().length).toEqual(0);
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

    it("updateCategories OK", function(done) {
        DBPromise.then(function() {
            setTimeout(function() {
                categoryService.updateCategories().then(function (data) {
                    expect(categoryService.getCategories().length).toEqual(1);
                }).then(done);
                $httpBackend.flush();
            });
        });
        $rootScope.$apply();

    });

    it("updateProducts DOUBLE", function(done) {
        DBPromise.then(function() {
            setTimeout(function() {
                categoryService.updateCategories().then(function (data) {
                    expect(categoryService.getCategories().length).toEqual(1);
                });
                categoryService.updateCategories().then(function (data) {
                    expect(categoryService.getCategories().length).toEqual(1);
                }).then(done);
                $httpBackend.flush();
            });
        });
        $rootScope.$apply();
    });

    it("updateCarts NOK", function(done) {
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler2.respond(500, returnValueFromPost);

        $httpBackend.expectGET(sinceURL);

        DBPromise.then(function() {
            setTimeout(function() {
                try {
                    categoryService.updateCategories();
                    $httpBackend.flush();
                    expect(true).toBeFalsy();
                } catch(e) {
                    expect(e).toEqual(returnValueFromPost.message);
                    expect(categoryService.getCategories().length).toEqual(0);
                }
                done();

            });
        });
        $rootScope.$apply();

    });
});

describe("Service : Product : resetProducts", function() {
    var Category;
    var categoryService, DBPromise;

    beforeEach(module('indexedDB'));
    beforeEach(module('categories'));

    var date = new Date();
    var data = {
        _id: {$id: 123},
        site: 456,
        infos : {fr: {lang: "fr", name: "product"}},
        products: [],
        ingredients: [],
        position: 9,
        status: 1,
        logStatus: [{}],
        order_button_color: "#CC00EE",
        last_refresh: date.getTime()
    };


    var authRequestHandler, authRequestHandler2, $httpBackend, $timeout;
    var since, sinceURL;

    //var indexedDBService, $rootScope, $window;
    beforeEach(inject(function (_$httpBackend_, _$timeout_) {
        jasmine.clock().mockDate(date);
        since = date;
        since.setMinutes(since.getMinutes() - 10);
        sinceURL = '/api/1/bo-management/products/list/categories/' + encodeURIComponent(since.toISOString());

        // Set up the mock http service responses
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/categories/list/0/100')
            .respond([data]);
        authRequestHandler2 = $httpBackend.when('GET', sinceURL)
            .respond([data]);
    }));

    beforeEach(inject(function (_Category_, _categoryService_) {
        Category = _Category_;
        categoryService = _categoryService_;
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
        $httpBackend.expectGET('/api/1/bo-management/categories/list/0/100');
        DBPromise.then(function () {
            setTimeout(function () {
                categoryService.loadCategories(0).then(function (data) {
                    categoryService.resetCategories().then(function (data) {
                        // Products have been reloaded
                        expect(categoryService.getCategories().length).toEqual(1);
                    }).then(done);
                    // Products have been removed
                    expect(categoryService.getCategories().length).toEqual(0);
                });
                $httpBackend.flush();
            });
        });
    });
});
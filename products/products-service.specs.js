describe("Service : Product : getProducts", function() {
    var Product;
    var productService;

    beforeEach(module('indexedDB'));
    beforeEach(module('products'));
    beforeEach(inject(function (_Product_, _productService_) {
        Product = _Product_;
        productService = _productService_;
    }));

    it("default value", function() {
        expect(productService.getProducts().length).toEqual(0);
    });

});

describe("Service : Product : loadProducts : NO DB", function() {
    var Product, productService;

    beforeEach(module('indexedDB'));
    beforeEach(module('carts'));
    beforeEach(module('products'));
    beforeEach(module('users'));


    var date = new Date();
    var data = {
        _id: 123,
        site: 456,
        name : "product",
        owner: 8,
        last_update: date,
        status: 1,
        logStatus: [{}],
        website: true,
        order_button_color: "#CC00EE",
        barcode: "1234587876352131231",
        rating: 1.5,
        template: "123546879123456987123400",

        fields: [{id: 789}],
        prices: [{id: 102}],
        comments: [{id: 987}],
        tags: [{id: 645}],
        categories: [{id: 321}]
    };

    beforeEach(inject(function (_Product_, _productService_) {
        Product = _Product_;
        productService = _productService_;
    }));

    var authRequestHandler, $httpBackend, $timeout;
    beforeEach(inject(function(_$httpBackend_, _$timeout_) {
        // Set up the mock http service responses
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/products/list/0/100')
            .respond([data]);
    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation(false);
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("load from API", function(done) {
        $httpBackend.expectGET('/api/1/bo-management/products/list/0/100');
        productService.loadProducts().then(function (data) {
            expect(productService.getProducts().length).toEqual(1);
            done();
        });
        $httpBackend.flush();
    });
});

describe("Service : Product : loadCarts & updateCarts : YES DB", function() {
    var Product, productService;
    var DBPromise;

    beforeEach(module('indexedDB'));
    beforeEach(module('carts'));
    beforeEach(module('products'));
    beforeEach(module('users'));

    var date = new Date();
    var data = {
        _id: {$id: 123},
        site: 456,
        name: "product",
        owner: 8,
        last_update: date,
        status: 1,
        logStatus: [{}],
        website: true,
        order_button_color: "#CC00EE",
        barcode: "1234587876352131231",
        rating: 1.5,
        template: "123546879123456987123400",

        fields: [{id: 789}],
        prices: [{id: 102}],
        comments: [{id: 987}],
        tags: [{id: 645}],
        categories: [{id: 321}]
    };


    var authRequestHandler, authRequestHandler2, $httpBackend, $timeout;
    var since, sinceURL;

    //var indexedDBService, $rootScope, $window;
    beforeEach(inject(function (_$httpBackend_, _$timeout_) {
        jasmine.clock().mockDate(date);
        since = date;
        since.setMinutes(since.getMinutes() - 10);
        sinceURL = '/api/1/bo-management/products/list/update/' + encodeURIComponent(since.toISOString());

        // Set up the mock http service responses
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/products/list/0/100')
            .respond([data]);
        authRequestHandler2 = $httpBackend.when('GET', sinceURL)
            .respond([data]);
    }));

    beforeEach(inject(function (_Product_, _productService_) {
        Product = _Product_;
        productService = _productService_;
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
        $httpBackend.expectGET('/api/1/bo-management/products/list/0/100');
        DBPromise.then(function () {
            setTimeout(function () {
                productService.loadProducts(0).then(function (data) {
                    expect(productService.getProducts().length).toEqual(1);
                }).then(done);
                $httpBackend.flush();
            });
        });
    });

    it("loadProducts from API NOK", function(done) {
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler.respond(500, returnValueFromPost);
        $httpBackend.expectGET('/api/1/bo-management/products/list/0/100');

        DBPromise.then(function () {
            setTimeout(function () {
                try {
                    productService.loadProducts(0);
                    $httpBackend.flush();
                    expect(true).toBeFalsy();
                } catch (e) {
                    expect(e).toEqual(returnValueFromPost.message);
                    expect(productService.getProducts().length).toEqual(0);
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

    it("updateProducts OK", function(done) {
        DBPromise.then(function() {
            setTimeout(function() {
                productService.updateProducts().then(function (data) {
                    expect(productService.getProducts().length).toEqual(1);
                }).then(done);
                $httpBackend.flush();
            });
        });
        $rootScope.$apply();

    });

    it("updateProducts DOUBLE", function(done) {
        DBPromise.then(function() {
            setTimeout(function() {
                productService.updateProducts().then(function (data) {
                    expect(productService.getProducts().length).toEqual(1);
                });
                productService.updateProducts().then(function (data) {
                    expect(productService.getProducts().length).toEqual(1);
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
                    productService.updateProducts();
                    $httpBackend.flush();
                    expect(true).toBeFalsy();
                } catch(e) {
                    expect(e).toEqual(returnValueFromPost.message);
                    expect(productService.getProducts().length).toEqual(0);
                }
                done();

            });
        });
        $rootScope.$apply();

    });
});

describe("Service : Product : resetProducts", function() {
    var Product, productService;
    var DBPromise;

    beforeEach(module('indexedDB'));
    beforeEach(module('carts'));
    beforeEach(module('products'));
    beforeEach(module('users'));

    var date = new Date();
    var data = {
        _id: {$id: 123},
        site: 456,
        name: "product",
        owner: 8,
        last_update: date,
        status: 1,
        logStatus: [{}],
        website: true,
        order_button_color: "#CC00EE",
        barcode: "1234587876352131231",
        rating: 1.5,
        template: "123546879123456987123400",

        fields: [{id: 789}],
        prices: [{id: 102}],
        comments: [{id: 987}],
        tags: [{id: 645}],
        categories: [{id: 321}]
    };


    var authRequestHandler, authRequestHandler2, $httpBackend, $timeout;
    var since, sinceURL;

    //var indexedDBService, $rootScope, $window;
    beforeEach(inject(function (_$httpBackend_, _$timeout_) {
        jasmine.clock().mockDate(date);
        since = date;
        since.setMinutes(since.getMinutes() - 10);
        sinceURL = '/api/1/bo-management/products/list/update/' + encodeURIComponent(since.toISOString());

        // Set up the mock http service responses
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/products/list/0/100')
            .respond([data]);
        authRequestHandler2 = $httpBackend.when('GET', sinceURL)
            .respond([data]);
    }));

    beforeEach(inject(function (_Product_, _productService_) {
        Product = _Product_;
        productService = _productService_;
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
        $httpBackend.expectGET('/api/1/bo-management/products/list/0/100');
        DBPromise.then(function () {
            setTimeout(function () {
                productService.loadProducts(0).then(function (data) {
                    productService.resetProducts().then(function (data) {
                        // Products have been reloaded
                        expect(productService.getProducts().length).toEqual(1);
                    }).then(done);
                    // Products have been removed
                    expect(productService.getProducts().length).toEqual(0);
                });
                $httpBackend.flush();
            });
        });
    });
});

describe("Service : Product : findByPrice", function() {
    var Product, productService;
    var DBPromise;

    beforeEach(module('indexedDB'));
    beforeEach(module('carts'));
    beforeEach(module('products'));
    beforeEach(module('users'));

    var date = new Date();
    var data = {
        _id: {$id: 123},
        site: 456,
        name: "product",
        owner: 8,
        last_update: date,
        status: 1,
        logStatus: [{}],
        website: true,
        order_button_color: "#CC00EE",
        barcode: "1234587876352131231",
        rating: 1.5,
        template: "123546879123456987123400",

        fields: [{id: 789}],
        prices: [{_id: {$id: 102}}],
        comments: [{id: 987}],
        tags: [{id: 645}],
        categories: [{id: 321}]
    };


    var authRequestHandler, authRequestHandler2, $httpBackend, $timeout;
    var since, sinceURL;

    //var indexedDBService, $rootScope, $window;
    beforeEach(inject(function (_$httpBackend_, _$timeout_) {
        jasmine.clock().mockDate(date);
        since = date;
        since.setMinutes(since.getMinutes() - 10);
        sinceURL = '/api/1/bo-management/products/list/update/' + encodeURIComponent(since.toISOString());

        // Set up the mock http service responses
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/products/list/0/100')
            .respond([data]);
        authRequestHandler2 = $httpBackend.when('GET', sinceURL)
            .respond([data]);
    }));

    beforeEach(inject(function (_Product_, _productService_) {
        Product = _Product_;
        productService = _productService_;
    }));

    var indexedDBService, $rootScope, $window;
    beforeEach(inject(function (_indexedDBService_, _$rootScope_, _$window_) {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        indexedDBService = _indexedDBService_;
        $rootScope = _$rootScope_;
        $window = _$window_;
        DBPromise = indexedDBService.init().then(function() {
            setTimeout(function () {
                productService.loadProducts(0);
                $httpBackend.flush();
            });
        });

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

    it("findByPrice OK", function (done) {
        DBPromise.then(function () {
            setTimeout(function () {
                productService.findByPrice(102).then(function(data) {
                    expect(data).not.toBeNull();
                    expect(data._id).toEqual(123);
                    done();
                }).then(done);
                $rootScope.$digest();
            });
        });
    });

    it("findByPrice NOK", function (done) {
        DBPromise.then(function () {
            setTimeout(function () {
                productService.findByPrice(-99).then(function(data) {
                    expect(data).toBeNull();
                }).then(done);
                $rootScope.$digest();
            });
        });
    });
});

describe("Service : Product : findById", function() {
    var Product, productService;
    var DBPromise;

    beforeEach(module('indexedDB'));
    beforeEach(module('carts'));
    beforeEach(module('products'));
    beforeEach(module('users'));

    var date = new Date();
    var data = {
        _id: {$id: 123},
        site: 456,
        name: "product",
        owner: 8,
        last_update: date,
        status: 1,
        logStatus: [{}],
        website: true,
        order_button_color: "#CC00EE",
        barcode: "1234587876352131231",
        rating: 1.5,
        template: "123546879123456987123400",

        fields: [{id: 789}],
        prices: [{_id: {$id: 102}}],
        comments: [{id: 987}],
        tags: [{id: 645}],
        categories: [{id: 321}]
    };


    var authRequestHandler, authRequestHandler2, $httpBackend, $timeout;
    var since, sinceURL;

    //var indexedDBService, $rootScope, $window;
    beforeEach(inject(function (_$httpBackend_, _$timeout_) {
        jasmine.clock().mockDate(date);

        // Set up the mock http service responses
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/products/list/0/100')
            .respond([data]);
        authRequestHandler2 = $httpBackend.when('GET', '/api/1/bo-management/products/123')
            .respond(data);
    }));

    beforeEach(inject(function (_Product_, _productService_) {
        Product = _Product_;
        productService = _productService_;
    }));

    var indexedDBService, $rootScope, $window;
    beforeEach(inject(function (_indexedDBService_, _$rootScope_, _$window_) {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        indexedDBService = _indexedDBService_;
        $rootScope = _$rootScope_;
        $window = _$window_;
        DBPromise = indexedDBService.init().then(function() {
            setTimeout(function () {
                productService.loadProducts(0);
                $httpBackend.flush();
            });
        });
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

    it("findById OK", function (done) {
        DBPromise.then(function () {
            setTimeout(function () {
                var dataInput = {ok: 1, prout: "this is the message"};
                productService.findById(123, dataInput).then(function(data) {
                    //expect(data).toBeNull();
                    expect(data).not.toBeNull();
                    expect(data.product._id).toEqual(123);
                    expect(data.data).toEqual(dataInput);
                    done();
                }).then(done);
                $rootScope.$digest();
            });
        });
    });

    it("findById NOK", function (done) {
        DBPromise.then(function () {
            setTimeout(function () {
                var dataInput = {ok: 1, prout: "this is the message"};
                productService.findById(-99, dataInput).then(function(data) {
                    expect(data).toBeNull();
                }).then(done);
                $rootScope.$digest();
            });
        });
    });
/*
-----------------------------------------------------
         DON'T KNOW HOW TO MAKE IT WORK !
-----------------------------------------------------

    it("findById OK with refresh", function(done) {
        DBPromise.then(function () {
            $httpBackend.expectGET('/api/1/bo-management/products/123');
            setTimeout(function () {
                var date2 = new Date();
                date2.setMinutes(date2.getMinutes() + 75);
                jasmine.clock().mockDate(date2);

                var dataInput = {ok: 1, prout: "this is the message"};
                productService.findById(123, dataInput).then(function(data) {
                    //expect(data).toBeNull();
                    expect(data).not.toBeNull();
                    expect(data.product._id).toEqual(123);
                    expect(data.data).toEqual(dataInput);
                    done();
                }).then(done);
                $rootScope.$digest();
                $httpBackend.flush();
            });
        });
    })
    */
});
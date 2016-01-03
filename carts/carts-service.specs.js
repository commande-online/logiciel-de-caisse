describe("Service : Cart : getCarts", function() {
    var Cart;
    var cartService, indexedDBService;

    beforeEach(module('indexedDB'));
    beforeEach(module('carts'));
    beforeEach(module('products'));
    beforeEach(module('users'));
    beforeEach(inject(function (_Cart_, _cartService_) {
        Cart = _Cart_;
        cartService = _cartService_;
    }));

    it("default value", function() {
        expect(cartService.getCarts().length).toEqual(0);
    });

});

describe("Service : Cart : loadCarts : NO DB", function() {
    var Cart, cartService;
    var DBPromise;

    beforeEach(module('indexedDB'));
    beforeEach(module('carts'));
    beforeEach(module('products'));
    beforeEach(module('users'));


    var date = new Date();
    var data = {
        id: 123,
        site: 456,
        totalAmount : 9,
        vat: 8,
        productList: [{id: {$id: 789}, price: {id: {$id: 456}}, tags: []}],
        user: [{id: 7}],
        delivery_partner: "ONSITE",
        created_by: 6,
        created_from: "BO",
        status: 1,
        status_text: "OK",
        shipping: null,
        billing: 5,
        delivery_time: parseInt(date.getTime() / 1000),
        created_at: parseInt(date.getTime() / 1000),
        date: parseInt(date.getTime() / 1000),
        last_refresh: parseInt(date.getTime()),
        payments: [{id: 987}]
    };


    beforeEach(inject(function (_Cart_, _cartService_) {
        Cart = _Cart_;
        cartService = _cartService_;
    }));

    var authRequestHandler, $httpBackend, $timeout;
    beforeEach(inject(function(_$httpBackend_, _$timeout_) {
        // Set up the mock http service responses
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/carts/list/0/100')
            .respond([data]);
    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation(false);
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("load from API", function(done) {
        $httpBackend.expectGET('/api/1/bo-management/carts/list/0/100');
        cartService.loadCarts(0).then(function (data) {
            expect(cartService.getCarts().length).toEqual(1);
            done();
        });
        $httpBackend.flush();
    });
});

describe("Service : Cart : loadCarts & updateCarts : YES DB", function() {

    var Cart, cartService;
    var DBPromise;

    beforeEach(module('indexedDB'));
    beforeEach(module('carts'));
    beforeEach(module('products'));
    beforeEach(module('users'));

    var date = new Date();
    var data = {
        id: 123,
        site: 456,
        totalAmount : 9,
        vat: 8,
        productList: [{id: {$id: 799}, price: {id: {$id: 456}}, tags: [], last_refresh: parseInt(date.getTime())}],
        user: [{id: 7}],
        delivery_partner: "ONSITE",
        created_by: 6,
        created_from: "BO",
        status: 1,
        status_text: "OK",
        shipping: null,
        billing: 5,
        delivery_time: parseInt(date.getTime() / 1000),
        created_at: parseInt(date.getTime() / 1000),
        date: parseInt(date.getTime() / 1000),
        last_refresh: parseInt(date.getTime()),
        payments: [{id: 987}]
    };


    var authRequestHandler, authRequestHandler2, $httpBackend, $timeout;
    var since, sinceURL;

    //var indexedDBService, $rootScope, $window;
    beforeEach(inject(function(_$httpBackend_, _$timeout_) {
        jasmine.clock().mockDate(date);
        since = date;
        since.setMinutes(since.getMinutes() - 10);
        sinceURL = '/api/1/bo-management/carts/list/update/'+encodeURIComponent(since.toISOString());

        // Set up the mock http service responses
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/carts/list/0/100')
            .respond([data]);
        authRequestHandler2 = $httpBackend.when('GET', sinceURL)
            .respond([data]);
    }));

    beforeEach(inject(function (_Cart_, _cartService_) {
        Cart = _Cart_;
        cartService = _cartService_;
    }));

    var indexedDBService, $rootScope, $window;
    beforeEach(inject(function(_indexedDBService_, _$rootScope_, _$window_) {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        indexedDBService = _indexedDBService_;
        $rootScope = _$rootScope_;
        $window = _$window_;
        DBPromise = indexedDBService.init();

    }));

    afterEach(function() {
        indexedDBService.getDB().close();
        $window.indexedDB.deleteDatabase("myCOL");
    });


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation($rootScope.$$phase ? false : true);
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("loadCarts from API OK", function(done) {
        $httpBackend.expectGET('/api/1/bo-management/carts/list/0/100');
        DBPromise.then(function() {
            setTimeout(function() {
                cartService.loadCarts(0).then(function (data) {
                    expect(cartService.getCarts().length).toEqual(1);
                }).then(done);
                $httpBackend.flush();
            });
        });
    });

    it("loadCarts from API NOK", function(done) {
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler.respond(500, returnValueFromPost);
        $httpBackend.expectGET('/api/1/bo-management/carts/list/0/100');

        DBPromise.then(function() {
            setTimeout(function() {
                try {
                    cartService.loadCarts(0);
                    $httpBackend.flush();
                    expect(true).toBeFalsy();
                } catch(e) {
                    expect(e).toEqual(returnValueFromPost.message);
                    expect(cartService.getCarts().length).toEqual(0);
                }
                done();

            });
        });
    });

    it("updateCarts OK", function(done) {
        DBPromise.then(function() {
            setTimeout(function() {
                cartService.updateCarts().then(function (data) {
                    expect(cartService.getCarts().length).toEqual(1);
                }).then(done);
                $httpBackend.flush();
            });
        });

    });

    it("updateCarts DOUBLE", function(done) {
        DBPromise.then(function() {
            setTimeout(function() {
                cartService.updateCarts().then(function (data) {
                    expect(cartService.getCarts().length).toEqual(1);
                });
                cartService.updateCarts().then(function (data) {
                    expect(cartService.getCarts().length).toEqual(1);
                }).then(done);
                $httpBackend.flush();
            });
        });

    });

    it("updateCarts NOK", function(done) {
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler2.respond(500, returnValueFromPost);

        $httpBackend.expectGET(sinceURL);

        DBPromise.then(function() {
            setTimeout(function() {
                try {
                    cartService.updateCarts();
                    $httpBackend.flush();
                    expect(true).toBeFalsy();
                } catch(e) {
                    expect(e).toEqual(returnValueFromPost.message);
                    expect(cartService.getCarts().length).toEqual(0);
                }
                done();

            });
        });

    });
});

describe("Service : Cart : findById", function() {

    var Cart, cartService;
    var DBPromise;

    beforeEach(module('indexedDB'));
    beforeEach(module('carts'));
    beforeEach(module('products'));
    beforeEach(module('users'));

    var date = new Date();
    var data = {
        id: 123,
        site: 456,
        totalAmount: 9,
        vat: 8,
        productList: [{id: {$id: 1789}, price: {id: {$id: 456}}, tags: []}],
        user: [{id: 7}],
        delivery_partner: "ONSITE",
        created_by: 6,
        created_from: "BO",
        status: 1,
        status_text: "OK",
        shipping: null,
        billing: 5,
        delivery_time: parseInt(date.getTime() / 1000),
        created_at: parseInt(date.getTime() / 1000),
        date: parseInt(date.getTime() / 1000),
        last_refresh: parseInt(date.getTime()),
        payments: [{id: 987}]
    };


    var authRequestHandler, authRequestHandler2, $httpBackend, $timeout;
    var since, sinceURL;

    //var indexedDBService, $rootScope, $window;
    beforeEach(inject(function (_$httpBackend_, _$timeout_) {
        jasmine.clock().mockDate(date);
        since = date;
        since.setMinutes(since.getMinutes() - 10);
        sinceURL = '/api/1/bo-management/carts/list/update/' + encodeURIComponent(since.toISOString());

        // Set up the mock http service responses
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/carts/list/0/100')
            .respond([data]);
        authRequestHandler2 = $httpBackend.when('GET', sinceURL)
            .respond([data]);
    }));

    beforeEach(inject(function (_Cart_, _cartService_) {
        Cart = _Cart_;
        cartService = _cartService_;
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
                cartService.findById(null).then(function(data) {
                    expect(data).toBeNull();
                }).then(done);
                $rootScope.$digest();
            });
        });
    });

    it("wrong param, null returned", function(done) {
        DBPromise.then(function() {
            setTimeout(function () {
                cartService.findById(-99).then(function(data) {
                    expect(data).toBeNull();
                }).then(done);
                $rootScope.$digest();
            });
        });
    });

    it("proper return no update", function(done) {
        DBPromise.then(function() {
            setTimeout(function () {
                cartService.loadCarts(0).then(function (data) {
                    setTimeout(function () {
                        $rootScope.$apply();
                    });
                });
                $httpBackend.flush();
                setTimeout(function () {
                    cartService.findById(123).then(function (data) {
                        expect(data).not.toBeNull();
                        expect(data._id).toEqual(123);
                        expect(data.site).toEqual(456);
                    }).then(done);
                    $rootScope.$digest();
                });
            });
        });
    })

});

describe("Service : Cart : findDB", function() {

    var Cart, cartService;
    var DBPromise;

    beforeEach(module('indexedDB'));
    beforeEach(module('carts'));
    beforeEach(module('products'));
    beforeEach(module('users'));

    var date = new Date();
    var data = {
        id: 123,
        site: 456,
        totalAmount: 9,
        vat: 8,
        productList: [{id: {$id: 2789}, price: {id: {$id: 456}}, tags: []}],
        user: [{id: 7}],
        delivery_partner: "ONSITE",
        created_by: 6,
        created_from: "BO",
        status: 1,
        status_text: "OK",
        shipping: null,
        billing: 5,
        delivery_time: parseInt(date.getTime() / 1000),
        created_at: parseInt(date.getTime() / 1000),
        date: parseInt(date.getTime() / 1000),
        last_refresh: parseInt(date.getTime()),
        payments: [{id: 987}]
    };


    var authRequestHandler, authRequestHandler2, $httpBackend, $timeout;
    var since, sinceURL;

    //var indexedDBService, $rootScope, $window;
    beforeEach(inject(function (_$httpBackend_, _$timeout_) {
        jasmine.clock().mockDate(date);
        since = date;
        since.setMinutes(since.getMinutes() - 10);
        sinceURL = '/api/1/bo-management/carts/list/update/' + encodeURIComponent(since.toISOString());

        // Set up the mock http service responses
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/carts/list/0/100')
            .respond([data]);
        authRequestHandler2 = $httpBackend.when('GET', sinceURL)
            .respond([data]);
    }));

    beforeEach(inject(function (_Cart_, _cartService_) {
        Cart = _Cart_;
        cartService = _cartService_;
    }));

    var indexedDBService, $rootScope, $window, loadCartsPromise;
    beforeEach(inject(function (_indexedDBService_, _$rootScope_, _$window_) {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        indexedDBService = _indexedDBService_;
        $rootScope = _$rootScope_;
        $window = _$window_;
        DBPromise = indexedDBService.init().then(function() {
            setTimeout(function () {
                loadCartsPromise = cartService.loadCarts(0);
                $httpBackend.flush();
            });
        });

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
                cartService.findDB(null, null, null).then(function (data) {
                    expect(data.length).toEqual(0);
                }).then(done);
                $rootScope.$digest();
                //done();
            });
        });
    });

    it("OK param status done", function(done) {
        DBPromise.then(function() {
            setTimeout(function () {
                var begDate = new Date();
                begDate.setMinutes(begDate.getMinutes() - 5);
                var endDate = new Date();
                endDate.setMinutes(endDate.getMinutes() + 15);
                var status = {completed: 1};
                loadCartsPromise.then(function() {
                    setTimeout(function () {
                        cartService.findDB(begDate, endDate, status).then(function (data) {
                            expect(data.length).toEqual(1);
                            //if(data.length == 1)
                            expect(data[0]._id).toEqual(123);
                        }).then(done);

                        $rootScope.$digest();
                    });
                });
                $rootScope.$digest();
                //done();
            });
        });
    });

    it("OK param status other", function(done) {
        DBPromise.then(function() {
            setTimeout(function () {
                var begDate = new Date();
                begDate.setMinutes(begDate.getMinutes() - 5);
                var endDate = new Date();
                endDate.setMinutes(endDate.getMinutes() + 5);
                var status = {completed: 0, notStarted: 1, ongoing: 1, canceled: 1};
                cartService.findDB(begDate, endDate, status).then(function (data) {
                    expect(data.length).toEqual(0);
                }).then(done);
                $rootScope.$digest();
                //done();
            });
        });
    });

    it("NOK param status done", function(done) {
        DBPromise.then(function() {
            setTimeout(function () {
                var begDate = new Date();
                begDate.setMinutes(begDate.getMinutes() + 5);
                var endDate = new Date();
                endDate.setMinutes(endDate.getMinutes() + 15);
                var status = {completed: 1};
                cartService.findDB(begDate, endDate, status).then(function (data) {
                    expect(data.length).toEqual(0);
                }).then(done);
                $rootScope.$digest();
                //done();
            });
        });
    });
});

DOMAIN_API = "";

describe("Factory : Cart : Default value / setters / getters", function() {
    var Cart;

    beforeEach(module('carts'));
    beforeEach(module('products'));
    beforeEach(module('users'));
    beforeEach(module('indexedDB'));
    beforeEach(inject(function (_Cart_) {
        Cart = _Cart_;
    }));

    it("default value in the cart object", function() {
        var date = new Date();
        jasmine.clock().mockDate(date);
        c = new Cart();

        // Default Attributes
        expect(c._id).toBeUndefined();
        expect(c.site).toBeUndefined();
        expect(c.amount).toEqual(0);
        expect(c.vat).toEqual(0);
        expect(c.date).toBeUndefined();
        expect(c.user).toBeUndefined();
        expect(c.products.length).toEqual(0);
        expect(c.payments.length).toEqual(1);
        expect(c.payments).toContain({amount: 0});
        expect(c.delivery_partner).toBeUndefined();
        expect(c.created_by).toBeUndefined();
        expect(c.created_from).toBeUndefined();
        expect(c.status).toBe(2);
        expect(c.status_text).toBeUndefined();
        expect(c.shipping).toBeUndefined();
        expect(c.billing).toBeUndefined();
        expect(c.delivery_time.getTime()).toEqual(new Date().getTime());
        expect(c.last_refresh).toEqual(new Date().getTime());
        expect(c.parsed).toBeFalsy();
    });

    it("default getters", function() {
        c = new Cart();
        jasmine.clock().mockDate(c.delivery_time);

        // Default Methods
        expect(c.getPaid()).toEqual("0.00 €");
        expect(c.getAmount()).toEqual("0.00 €");
        expect(c.getVat()).toEqual("0.00 €");
        expect(c.getReturnMoney()).toEqual(0);
        expect(c.isPaid()).toBeFalsy();
        expect(c.isSavable()).toBeFalsy();
    });


    it("default value on parse", function() {
        c = new Cart();
        jasmine.clock().mockDate(c.delivery_time);

        c.parse();

        // Default Attributes
        expect(c._id).toBeUndefined();
        expect(c.site).toBeUndefined();
        expect(c.amount).toEqual(0);
        expect(c.vat).toEqual(0);
        expect(c.date).toBeUndefined();
        expect(c.user).toBeUndefined();
        expect(c.products.length).toEqual(0);
        expect(c.payments.length).toEqual(1);
        expect(c.payments).toContain({amount: 0});
        expect(c.delivery_partner).toBeUndefined();
        expect(c.created_by).toBeUndefined();
        expect(c.created_from).toBeUndefined();
        expect(c.status).toBe(2);
        expect(c.status_text).toBeUndefined();
        expect(c.shipping).toBeUndefined();
        expect(c.billing).toBeUndefined();
        expect(c.delivery_time.getTime()).toEqual(new Date().getTime());
        expect(c.last_refresh).toEqual(new Date().getTime());
        expect(c.parsed).toBeTruthy();
    });

    it("Cart.setDeliveryPartner : OK", function() {
        c = new Cart();
        jasmine.clock().mockDate(c.delivery_time);

        c.setDeliveryPartner("ONSITE");
        expect(c.delivery_partner).toEqual("ONSITE");

        c.setDeliveryPartner("PICKUP");
        expect(c.delivery_partner).toEqual("PICKUP");

        c.setDeliveryPartner("DELIVER");
        expect(c.delivery_partner).toEqual("DELIVER");

        c.shipping = "ONSITE";
        c.checkDeliveryPartner();
        expect(c.delivery_partner).toEqual("ONSITE");

        c.shipping = "PICKUP";
        c.checkDeliveryPartner();
        expect(c.delivery_partner).toEqual("PICKUP");

        c.shipping = "DELIVER";
        c.checkDeliveryPartner();
        expect(c.delivery_partner).toEqual("DELIVER");
    });

    it("Cart.setDeliveryPartner : NOK", function() {
        c = new Cart();
        jasmine.clock().mockDate(c.delivery_time);

        c.setDeliveryPartner("ONSITE");
        expect(c.delivery_partner).toEqual("ONSITE");

        c.setDeliveryPartner("ERROR");
        expect(c.delivery_partner).toBeNull();
    });

    it("Cart.clearUser", function() {
        c = new Cart();
        jasmine.clock().mockDate(c.delivery_time);

        c.user = 123;

        c.clearUser();
        expect(c.user).toBeNull();
    });

    it("Cart.validate", function() {
        c = new Cart();
        jasmine.clock().mockDate(c.delivery_time);

        c.validate();
        expect(c.status).toEqual(1);
        expect(c.status_text).toEqual("Livrée");

    });

    it("Cart.build", function() {
        var date = new Date();
        var data = {
            id: 123,
            site: 456,
            totalAmount : 9,
            vat: 8,
            productList: [{id: 789}],
            user: 7,
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
            payments: [{di: 987}]
        };
        jasmine.clock().mockDate(date);

        var c = Cart.build(data);

        expect(c._id).toEqual(data.id);
        expect(c.site).toEqual(data.site);
        expect(c.amount).toEqual(data.totalAmount);
        expect(c.vat).toEqual(data.vat);
        expect(c.date).toEqual(data.date * 1000);
        expect(c.user).toEqual(data.user);
        expect(c.products.length).toEqual(1);
        expect(c.products).toContain(data.productList[0]);
        expect(c.payments.length).toEqual(2);
        expect(c.payments).toContain(data.payments[0]);
        expect(c.delivery_partner).toEqual(data.delivery_partner);
        expect(c.created_by).toEqual(data.created_by);
        expect(c.created_from).toEqual(data.created_from);
        expect(c.status).toEqual(data.status);
        expect(c.status_text).toEqual(data.status_text);
        expect(c.shipping).toEqual(null);
        expect(c.billing).toEqual(data.billing);
        expect(c.delivery_time.getTime()).toEqual(data.delivery_time * 1000);
        expect(c.created_at.getTime()).toEqual(data.created_at * 1000);
        expect(c.last_refresh).toEqual(data.last_refresh);
        expect(c.parsed).toBeFalsy();
    });

    it("Cart.setData", function() {
        var date = new Date();
        var data = {
            id: 123,
            site: 456,
            totalAmount : 9,
            vat: 8,
            productList: [{id: 789}],
            user: 7,
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
            payments: [{di: 987}]
        };
        jasmine.clock().mockDate(date);

        c = new Cart();
        c.setData(data);

        expect(c._id).toEqual(data.id);
        expect(c.site).toEqual(data.site);
        expect(c.amount).toEqual(data.totalAmount);
        expect(c.vat).toEqual(data.vat);
        expect(c.date).toEqual(data.date * 1000);
        expect(c.user).toEqual(data.user);
        expect(c.products.length).toEqual(1);
        expect(c.products).toContain(data.productList[0]);
        expect(c.payments.length).toEqual(2);
        expect(c.payments).toContain(data.payments[0]);
        expect(c.delivery_partner).toEqual(data.delivery_partner);
        expect(c.created_by).toEqual(data.created_by);
        expect(c.created_from).toEqual(data.created_from);
        expect(c.status).toEqual(data.status);
        expect(c.status_text).toEqual(data.status_text);
        expect(c.shipping).toEqual(null);
        expect(c.billing).toEqual(data.billing);
        expect(c.delivery_time.getTime()).toEqual(data.delivery_time * 1000);
        expect(c.created_at.getTime()).toEqual(data.created_at * 1000);
        expect(c.last_refresh).toEqual(data.last_refresh);
        expect(c.parsed).toBeFalsy();
    });
});

describe("Factory : Cart : addPayment", function() {
    var Cart;

    beforeEach(module('carts'));
    beforeEach(module('products'));
    beforeEach(module('users'));
    beforeEach(module('indexedDB'));
    beforeEach(inject(function (_Cart_) {
        Cart = _Cart_;
    }));

    it("default value : should NOT add a payment", function() {
        c = new Cart();
        jasmine.clock().mockDate(c.delivery_time);
        c.addPayment();

        expect(c.payments.length).toEqual(1);
    });

    it("status : should add a payment", function() {
        c = new Cart();
        jasmine.clock().mockDate(c.delivery_time);
        c.payments[0].status = 1;
        c.addPayment();

        expect(c.payments.length).toEqual(2);
    });

    it("amount : should add a payment", function() {
        c = new Cart();
        jasmine.clock().mockDate(c.delivery_time);
        c.payments[0].amount = 1;
        c.addPayment();

        expect(c.payments.length).toEqual(2);
    });

    it("provider_name : should add a payment", function() {
        c = new Cart();
        jasmine.clock().mockDate(c.delivery_time);
        c.payments[0].provider_name = 1;
        c.addPayment();

        expect(c.payments.length).toEqual(2);
    });

    it("provider_name + amount  + status : should add a payment", function() {
        c = new Cart();
        jasmine.clock().mockDate(c.delivery_time);
        c.payments[0].provider_name = 1;
        c.payments[0].status = 1;
        c.payments[0].amount = 1;
        c.addPayment();

        expect(c.payments.length).toEqual(2);
    });

    it("before provider_name + amount  + status : should add ONLY ONE payment", function() {
        c = new Cart();
        jasmine.clock().mockDate(c.delivery_time);
        c.payments[0].provider_name = 1;
        c.payments[0].status = 1;
        c.payments[0].amount = 1;
        c.addPayment();
        c.addPayment();

        expect(c.payments.length).toEqual(2);
    });

    it("in between provider_name + amount  + status : should add ONLY ONE payment", function() {
        c = new Cart();
        jasmine.clock().mockDate(c.delivery_time);
        c.payments[0].provider_name = 1;
        c.addPayment();
        c.payments[0].status = 1;
        c.payments[0].amount = 1;
        c.addPayment();

        expect(c.payments.length).toEqual(2);
    });
});

describe("Factory : Cart : isSavable", function() {
    var Cart;

    beforeEach(module('carts'));
    beforeEach(module('products'));
    beforeEach(module('users'));
    beforeEach(module('indexedDB'));
    beforeEach(inject(function (_Cart_) {
        Cart = _Cart_;
    }));

    it("default value : should be not savable", function() {
        c = new Cart();
        jasmine.clock().mockDate(c.delivery_time);

        expect(c.isSavable()).toBeFalsy();
    });

    it("savable with default + pickup", function() {
        c = new Cart();
        jasmine.clock().mockDate(c.delivery_time);
        c.setDeliveryPartner("PICKUP");

        expect(c.isSavable()).toBeTruthy();
    });

    it("savable with default + onsite", function() {
        c = new Cart();
        jasmine.clock().mockDate(c.delivery_time);
        c.setDeliveryPartner("ONSITE");

        expect(c.isSavable()).toBeTruthy();
    });

    it("NOT savable with default + user", function() {
        c = new Cart();
        jasmine.clock().mockDate(c.delivery_time);
        c.user = 1;

        expect(c.isSavable()).toBeFalsy();
    });

    it("savable with default + user + shipping", function() {
        c = new Cart();
        jasmine.clock().mockDate(c.delivery_time);
        c.user = 1;
        c.shipping = 1;

        expect(c.isSavable()).toBeTruthy();
    });

    it("savable with default + user + billing", function() {
        c = new Cart();
        jasmine.clock().mockDate(c.delivery_time);
        c.user = 1;
        c.billing = 1;

        expect(c.isSavable()).toBeTruthy();
    });

    it("savable with default + user + billing + shipping", function() {
        c = new Cart();
        jasmine.clock().mockDate(c.delivery_time);
        c.user = 1;
        c.billing = 1;
        c.shipping = 1;

        expect(c.isSavable()).toBeTruthy();
    });

    it("NOT savable with default + user + billing + shipping + status 6", function() {
        c = new Cart();
        jasmine.clock().mockDate(c.delivery_time);
        c.user = 1;
        c.billing = 1;
        c.shipping = 1;
        c.status = 6;

        expect(c.isSavable()).toBeFalsy();
    });

    it("savable with default + pickup", function() {
        c = new Cart();
        jasmine.clock().mockDate(c.delivery_time);
        c.setDeliveryPartner("PICKUP");

        expect(c.isSavable()).toBeTruthy();
    });

    it("savable with default + pickup + user", function() {
        c = new Cart();
        jasmine.clock().mockDate(c.delivery_time);
        c.setDeliveryPartner("PICKUP");
        c.user = 1;

        expect(c.isSavable()).toBeTruthy();
    });

    it("savable with default + pickup + user + billing", function() {
        c = new Cart();
        jasmine.clock().mockDate(c.delivery_time);
        c.setDeliveryPartner("PICKUP");
        c.user = 1;
        c.billing = 1;

        expect(c.isSavable()).toBeTruthy();
    });

    it("savable with default + onsite", function() {
        c = new Cart();
        jasmine.clock().mockDate(c.delivery_time);
        c.setDeliveryPartner("ONSITE");

        expect(c.isSavable()).toBeTruthy();
    });

    it("savable with default + onsite + user", function() {
        c = new Cart();
        jasmine.clock().mockDate(c.delivery_time);
        c.setDeliveryPartner("ONSITE");
        c.user = 1;

        expect(c.isSavable()).toBeTruthy();
    });

    it("savable with default + onsite + user + billing", function() {
        c = new Cart();
        jasmine.clock().mockDate(c.delivery_time);
        c.setDeliveryPartner("ONSITE");
        c.user = 1;
        c.billing = 1;

        expect(c.isSavable()).toBeTruthy();
    });

    it("NOT savable with default + onsite + user + billing + status 1", function() {
        c = new Cart();
        jasmine.clock().mockDate(c.delivery_time);
        c.setDeliveryPartner("ONSITE");
        c.user = 1;
        c.billing = 1;
        c.status = 1;

        expect(c.isSavable()).toBeFalsy();
    });
});

describe("Factory : Cart : save & validate", function() {
    var $httpBackend, $rootScope, authRequestHandler;
    var Cart, Product, productService;

    beforeEach(module('carts'));
    beforeEach(module('products'));
    beforeEach(module('users'));
    beforeEach(module('indexedDB'));
    beforeEach(inject(function (_Cart_, _Product_, _productService_) {
        Cart = _Cart_;
        Product = _Product_;
        productService = _productService_;

        p = new Product();
        p._id = 789;

        _productService_.getProducts()[0] = p;
    }));

    beforeEach(inject(function($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('POST', '/api/1/bo-management/carts/')
            .respond({_id: 123});

        $httpBackend.when('POST', '/api/1/bo-management/carts/456')
            .respond({_id: 123});

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');
    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("saving a cart : OK", function() {
        $httpBackend.expectPOST('/api/1/bo-management/carts/');

        var c = new Cart();
        c.products.push({id: {$id: 789}, price: {id: {$id: 456}}, tags: []});
        jasmine.clock().mockDate(c.delivery_time);

        var date = c.delivery_time;

        c.save(function(data){});
        $httpBackend.flush();

        expect(c._id).toEqual(123);
        expect(c.delivery_time.getTime()).toEqual(date.getTime());
    });

    it("validating a cart : OK", function() {
        $httpBackend.expectPOST('/api/1/bo-management/carts/456');

        var c = new Cart();
        c.parsed = true;
        c._id = 456;
        jasmine.clock().mockDate(c.delivery_time);

        var date = c.delivery_time;

        c.validate();
        $httpBackend.flush();

        expect(c._id).toEqual(456);
        expect(c.delivery_time.getTime()).toEqual(date.getTime());
        expect(c.status).toEqual(1);
    });

    it("saving a cart : NOK", function() {
        $httpBackend.expectPOST('/api/1/bo-management/carts/');
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler.respond(500, returnValueFromPost);

        var c = new Cart();
        jasmine.clock().mockDate(c.delivery_time);

        var date = c.delivery_time;

        c.save();
        $httpBackend.flush();

        expect(c._id).toEqual(-1);
        expect(c.delivery_time.getTime()).toEqual(date.getTime());
        expect(c.error_api).toEqual(returnValueFromPost);
    });

});

describe("Factory : Cart : parse", function() {
    var Cart, $rootScope, indexedDBService, DBPromise;
    var authRequestHandler, $httpBackend, $window;

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
        payments: [{di: 987}]
    };

    beforeEach(module('carts'));
    beforeEach(module('products'));
    beforeEach(module('users'));
    beforeEach(module('indexedDB'));

    beforeEach(inject(function (_$httpBackend_, _Cart_, _productService_, _Product_, _$rootScope_, _indexedDBService_, _$window_) {
        $httpBackend = _$httpBackend_;
        $window = _$window_;
        Cart = _Cart_;
        $rootScope = _$rootScope_;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        indexedDBService = _indexedDBService_;

        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/products/list/0/100')
            .respond([{_id: {$id: 789}, status:1, tags: [], last_refresh: parseInt(date.getTime())}, {_id: {$id: 1789}, tags: [], status:1, last_refresh: parseInt(date.getTime())}]);


        DBPromise = indexedDBService.init().then(function() {
            setTimeout(function () {
                _productService_.loadProducts(0);
                $httpBackend.flush();
            });
        });
    }));

    afterEach(function () {
        indexedDBService.getDB().close();
        $window.indexedDB.deleteDatabase("myCOL");
    });

    it("default parse", function(done) {
        DBPromise.then(function() {
            var c = Cart.build(data);
            setTimeout(function () {
                c.parse().then(function() {
                    expect(c.parsed).toBeTruthy();
                    expect(c.products.length).toEqual(1);

                });
                $rootScope.$apply();
                done();
/*
                expect(c.parsed).toBeTruthy();
                setTimeout(function() {
                    $rootScope.$digest();
                    expect(c.products.length).toEqual(1);
                    done();
                });*/
            });
        });

    })
});

describe("Factory : Cart : load", function() {
    var $httpBackend, $rootScope, authRequestHandler;
    var Cart, Product, productService;

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
        payments: [{di: 987}]
    };

    beforeEach(module('carts'));
    beforeEach(module('products'));
    beforeEach(module('users'));
    beforeEach(module('indexedDB'));
    beforeEach(inject(function (_Cart_, _Product_, _productService_) {
        Cart = _Cart_;
        Product = _Product_;
        productService = _productService_;

        p = new Product();
        p._id = 789;

        _productService_.getProducts()[0] = p;
    }));

    beforeEach(inject(function($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/carts/123')
            .respond(data);


        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');
    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("loading a cart : OK", function() {
        $httpBackend.expectGET('/api/1/bo-management/carts/123');

        var c = new Cart();
        c.load(123);
        $httpBackend.flush();

        expect(c._id).toEqual(123);
        expect(c.delivery_time.getTime()).toEqual(data.delivery_time * 1000);
    });

    it("loading a cart : NOK", function() {
        $httpBackend.expectGET('/api/1/bo-management/carts/123');
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler.respond(500, returnValueFromPost);

        var c = new Cart();
        c.load(123);
        $httpBackend.flush();

        expect(c._id).toEqual(-1);
        expect(c.error_api).toEqual(returnValueFromPost);
    });
});

describe("Factory : Cart : status", function() {
    var Cart;

    beforeEach(module('carts'));
    beforeEach(module('products'));
    beforeEach(module('users'));
    beforeEach(module('indexedDB'));

    beforeEach(inject(function (_Cart_) {
        Cart = _Cart_;
    }));

    it("statusNotStarted", function() {
        expect(Cart.statusNotStarted().length).toEqual(2);
        expect(Cart.statusNotStarted()).toEqual([3, 4]);
    });

    it("statusOngoing", function() {
        expect(Cart.statusOngoing().length).toEqual(3);
        expect(Cart.statusOngoing()).toEqual([2, 21, 22]);
    });

    it("statusDone", function() {
        expect(Cart.statusDone().length).toEqual(1);
        expect(Cart.statusDone()).toEqual([1]);
    });

    it("statusCancel", function() {
        expect(Cart.statusCancel().length).toEqual(3);
        expect(Cart.statusCancel()).toEqual([10, 5, 6]);
    });
});
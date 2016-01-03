describe("Factory : Category : Default value / setters / getters", function() {
    var Category;

    beforeEach(module('categories'));
    beforeEach(inject(function (_Category_) {
        Category = _Category_;
    }));

    it("default value in the cart object", function() {
        c = new Category();

        // Default Attributes
        expect(c._id).toBeUndefined();
        expect(c.site).toBeUndefined();
        expect(c.infos).not.toBeUndefined();
        expect(c.products).toBeUndefined();
        expect(c.ingredients).toBeUndefined();
        expect(c.logStatus).toBeUndefined();
        expect(c.status).toBeUndefined();
        expect(c.logStatus).toBeUndefined();
        expect(c.last_refresh).not.toBeUndefined();
        expect(c.order_button_color).toBeUndefined();
    });

    it("default getters", function() {
        c = new Category();

        // Default Methods
        expect(c.getBackgroundColorStyle()).toEqual("");
    });

    it("Category.build", function() {
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
        jasmine.clock().mockDate(date);

        var p = Category.build(data);

        expect(p._id).toEqual(data._id.$id);
        expect(p.site).toEqual(data.site);
        expect(p.infos).toEqual(data.infos);
        expect(p.products).toEqual(data.products);
        expect(p.status).toEqual(data.status);
        expect(p.order_button_color).toEqual(data.order_button_color);
        expect(p.ingredients).toEqual(data.ingredients);
        expect(p.position).toEqual(data.position);
        expect(p.last_refresh).toEqual(data.last_refresh);

        expect(p.logStatus.length).toEqual(1);
    });

    it("Category.setData with $id", function() {
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
        jasmine.clock().mockDate(date);

        var p = new Category();
        p.setData(data);

        expect(p._id).toEqual(123);
        expect(p.site).toEqual(data.site);
        expect(p.infos).toEqual(data.infos);
        expect(p.products).toEqual(data.products);
        expect(p.status).toEqual(data.status);
        expect(p.order_button_color).toEqual(data.order_button_color);
        expect(p.ingredients).toEqual(data.ingredients);
        expect(p.position).toEqual(data.position);
        expect(p.last_refresh).toEqual(data.last_refresh);

        expect(p.logStatus.length).toEqual(1);
    });

    it("Category.setData without $id", function() {
        var date = new Date();
        var data = {
            _id: 123,
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
        jasmine.clock().mockDate(date);

        var p = new Category();
        p.setData(data);

        expect(p._id).toEqual(data._id);
        expect(p.site).toEqual(data.site);
        expect(p.infos).toEqual(data.infos);
        expect(p.products).toEqual(data.products);
        expect(p.status).toEqual(data.status);
        expect(p.order_button_color).toEqual(data.order_button_color);
        expect(p.ingredients).toEqual(data.ingredients);
        expect(p.position).toEqual(data.position);
        expect(p.last_refresh).toEqual(data.last_refresh);

        expect(p.logStatus.length).toEqual(1);
    });
});

describe("Factory : Product : getBackgroundColorStyle", function() {
    var Category;

    beforeEach(module('categories'));
    beforeEach(inject(function (_Category_) {
        Category = _Category_;
    }));

    it("default value empty|undefined", function() {
        p = new Category();

        expect(p.getBackgroundColorStyle()).toEqual("");
    });

    it("null value", function() {
        p = new Category();
        p.order_button_color = null;

        expect(p.getBackgroundColorStyle()).toEqual("");
    });

    it("with value", function() {
        p = new Category();
        p.order_button_color = "#CC0011";

        expect(p.getBackgroundColorStyle()).toEqual({"background-color": "#CC0011"});
    });
});

describe("Factory : Category : save", function() {
    var Category;

    beforeEach(module('categories'));
    beforeEach(inject(function (_Category_) {
        Category = _Category_;
    }));

    var $httpBackend, authRequestHandler, $rootScope;
    beforeEach(inject(function($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('POST', '/api/1/bo-management/categories/')
            .respond({_id: 123});

        $httpBackend.when('POST', '/api/1/bo-management/categories/456')
            .respond({_id: 123});

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');
    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("saving a category : OK", function() {
        $httpBackend.expectPOST('/api/1/bo-management/categories/');

        var c = new Category();

        c.save(function(data){});
        $httpBackend.flush();

        expect(c._id).toEqual(123);
    });

    it("saving an existing product : OK", function() {
        $httpBackend.expectPOST('/api/1/bo-management/categories/456');

        var c = new Category();
        c._id = 456;

        c.save(function(data){});
        $httpBackend.flush();

        expect(c._id).toEqual(456);
    });

    it("saving a product : NOK", function() {
        $httpBackend.expectPOST('/api/1/bo-management/categories/');
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler.respond(500, returnValueFromPost);

        var c = new Category();

        c.save();
        $httpBackend.flush();

        expect(c._id).toEqual(-1);
        expect(c.error_api).toEqual(returnValueFromPost);
    });

});

describe("Factory : Category : load", function() {
    var Category;
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

    beforeEach(module('categories'));
    beforeEach(inject(function (_Category_) {
        Category = _Category_;
    }));

    var $httpBackend, authRequestHandler, $rootScope;
    beforeEach(inject(function($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/categories/123')
            .respond(data);

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');
    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("loading a category : OK", function() {
        $httpBackend.expectGET('/api/1/bo-management/categories/123');

        var c = new Category();

        c.load(123);
        $httpBackend.flush();

        expect(c._id).toEqual(123);
    });

    it("loading a category : NOK", function() {
        $httpBackend.expectGET('/api/1/bo-management/categories/123');
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler.respond(500, returnValueFromPost);

        var c = new Category();

        c.load(123);
        $httpBackend.flush();

        expect(c._id).toEqual(-1);
        expect(c.error_api).toEqual(returnValueFromPost);
    });
});

describe("Factory : Category : delete", function() {
    var Category;
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

    beforeEach(module('categories'));
    beforeEach(inject(function (_Category_) {
        Category = _Category_;
    }));

    var $httpBackend, authRequestHandler, $rootScope;
    beforeEach(inject(function($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('DELETE', '/api/1/bo-management/categories/123')
            .respond(data);

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');
    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("deleting a category : OK 1", function() {
        $httpBackend.expectDELETE('/api/1/bo-management/categories/123');

        var c = Category.build(data);

        c.delete();
        $httpBackend.flush();

        expect(c._id).toEqual(123);
    });

    it("deleting a category : OK 2", function() {
        $httpBackend.expectDELETE('/api/1/bo-management/categories/123');

        var c = Category.build(data);

        c.delete(function(data) {});
        $httpBackend.flush();

        expect(c._id).toEqual(123);
    });

    it("deleting a category : NOK", function() {
        $httpBackend.expectDELETE('/api/1/bo-management/categories/123');
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler.respond(500, returnValueFromPost);

        var c = Category.build(data);

        c.delete();
        $httpBackend.flush();

        expect(c._id).toEqual(-1);
        expect(c.error_api).toEqual(returnValueFromPost);
    });
});
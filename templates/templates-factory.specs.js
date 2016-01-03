describe("Factory : Template : Default value / setters / getters", function() {
    var Template;

    beforeEach(module('templates'));
    beforeEach(inject(function (_Template_) {
        Template = _Template_;
    }));

    it("default value in the cart object", function() {
        c = new Template();

        // Default Attributes
        expect(c._id).toBeUndefined();
        expect(c.site).toBeUndefined();
        expect(c.name).toBeUndefined();
        expect(c.labelPriceSelect).toBeUndefined();
        expect(c.fields).toBeUndefined();
        expect(c.products).toBeUndefined();
        expect(c.status).toBeUndefined();
        expect(c.logStatus).toBeUndefined();
        expect(c.last_refresh).not.toBeUndefined();
    });

    it("default getters", function() {
        c = new Template();

        // Default Methods
    });

    it("Template.build", function() {
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
        jasmine.clock().mockDate(date);

        var p = Template.build(data);

        expect(p._id).toEqual(data._id.$id);
        expect(p.site).toEqual(data.site);
        expect(p.name).toEqual(data.name);
        expect(p.labelPriceSelect).toEqual(data.labelPriceSelect);
        expect(p.products).toEqual(data.products);
        expect(p.status).toEqual(data.status);
        expect(p.fields).toEqual(data.fields);
        expect(p.last_refresh).toEqual(data.last_refresh);

        expect(p.logStatus.length).toEqual(1);
    });

    it("Template.setData with $id", function() {
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
        jasmine.clock().mockDate(date);

        var p = new Template();
        p.setData(data);

        expect(p._id).toEqual(123);
        expect(p.site).toEqual(data.site);
        expect(p.name).toEqual(data.name);
        expect(p.labelPriceSelect).toEqual(data.labelPriceSelect);
        expect(p.products).toEqual(data.products);
        expect(p.status).toEqual(data.status);
        expect(p.fields).toEqual(data.fields);
        expect(p.last_refresh).toEqual(data.last_refresh);

        expect(p.logStatus.length).toEqual(1);
    });

    it("Template.setData without $id", function() {
        var date = new Date();
        var data = {
            _id: 123,
            site: 456,
            name : "toto",
            labelPriceSelect: "prout",
            fields: [],
            products: [],
            status: 1,
            logStatus: [{}],
            last_refresh: date.getTime()
        };
        jasmine.clock().mockDate(date);

        var p = new Template();
        p.setData(data);

        expect(p._id).toEqual(123);
        expect(p.site).toEqual(data.site);
        expect(p.name).toEqual(data.name);
        expect(p.labelPriceSelect).toEqual(data.labelPriceSelect);
        expect(p.products).toEqual(data.products);
        expect(p.status).toEqual(data.status);
        expect(p.fields).toEqual(data.fields);
        expect(p.last_refresh).toEqual(data.last_refresh);

        expect(p.logStatus.length).toEqual(1);
    });
});

describe("Factory : Template : save", function() {
    var Template;

    beforeEach(module('templates'));
    beforeEach(inject(function (_Template_) {
        Template = _Template_;
    }));

    var $httpBackend, authRequestHandler, $rootScope;
    beforeEach(inject(function($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('POST', '/api/1/bo-management/templates/')
            .respond({_id: 123});

        $httpBackend.when('POST', '/api/1/bo-management/templates/456')
            .respond({_id: 123});

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');
    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("saving a template : OK", function() {
        $httpBackend.expectPOST('/api/1/bo-management/templates/');

        var c = new Template();

        c.save(function(data){});
        $httpBackend.flush();

        expect(c._id).toEqual(123);
    });

    it("saving an existing product : OK", function() {
        $httpBackend.expectPOST('/api/1/bo-management/templates/456');

        var c = new Template();
        c._id = 456;

        c.save(function(data){});
        $httpBackend.flush();

        expect(c._id).toEqual(456);
    });

    it("saving a product : NOK", function() {
        $httpBackend.expectPOST('/api/1/bo-management/templates/');
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler.respond(500, returnValueFromPost);

        var c = new Template();

        c.save();
        $httpBackend.flush();

        expect(c._id).toEqual(-1);
        expect(c.error_api).toEqual(returnValueFromPost);
    });

});

describe("Factory : Template : load", function() {
    var Template;
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

    beforeEach(module('templates'));
    beforeEach(inject(function (_Template_) {
        Template = _Template_;
    }));

    var $httpBackend, authRequestHandler, $rootScope;
    beforeEach(inject(function($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/templates/123')
            .respond(data);

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');
    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("loading a template : OK", function() {
        $httpBackend.expectGET('/api/1/bo-management/templates/123');

        var c = new Template();

        c.load(123);
        $httpBackend.flush();

        expect(c._id).toEqual(123);
    });

    it("loading a template : NOK", function() {
        $httpBackend.expectGET('/api/1/bo-management/templates/123');
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler.respond(500, returnValueFromPost);

        var c = new Template();

        c.load(123);
        $httpBackend.flush();

        expect(c._id).toEqual(-1);
        expect(c.error_api).toEqual(returnValueFromPost);
    });
});

describe("Factory : Template : delete", function() {
    var Template;
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

    beforeEach(module('templates'));
    beforeEach(inject(function (_Template_) {
        Template = _Template_;
    }));

    var $httpBackend, authRequestHandler, $rootScope;
    beforeEach(inject(function($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('DELETE', '/api/1/bo-management/templates/123')
            .respond(data);

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');
    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("deleting a template : OK 1", function() {
        $httpBackend.expectDELETE('/api/1/bo-management/templates/123');

        var c = Template.build(data);

        c.delete();
        $httpBackend.flush();

        expect(c._id).toEqual(123);
    });

    it("deleting a template : OK 2", function() {
        $httpBackend.expectDELETE('/api/1/bo-management/templates/123');

        var c = Template.build(data);

        c.delete(function(data) {});
        $httpBackend.flush();

        expect(c._id).toEqual(123);
    });

    it("deleting a template : NOK", function() {
        $httpBackend.expectDELETE('/api/1/bo-management/templates/123');
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler.respond(500, returnValueFromPost);

        var c = Template.build(data);

        c.delete();
        $httpBackend.flush();

        expect(c._id).toEqual(-1);
        expect(c.error_api).toEqual(returnValueFromPost);
    });
});
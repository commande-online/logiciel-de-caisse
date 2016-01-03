describe("Factory : Page : Default value / setters / getters", function() {
    var Page;

    beforeEach(module('pages'));
    beforeEach(inject(function (_Page_) {
        Page = _Page_;
    }));

    it("default value in the cart object", function() {
        c = new Page();

        // Default Attributes
        expect(c._id).toBeUndefined();
        expect(c.site).toBeUndefined();
        expect(c.name).toBeUndefined();
        expect(c.title).toBeUndefined();
        expect(c.lang).toBeUndefined();
        expect(c.versions).toBeUndefined();
        expect(c.comment).toBeUndefined();
        expect(c.links.length).toEqual(0);
        expect(c.tags.length).toEqual(0);
        expect(c.comments).toBeUndefined();
        expect(c.last_refresh).not.toBeUndefined();
    });

    it("default getters", function() {
        c = new Page();

        // Default Methods
        expect(c.text()).toEqual("");
        expect(c.getVersion()).toBeNull("");
    });

    it("Page.build", function() {
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
        jasmine.clock().mockDate(date);

        var p = Page.build(data);

        expect(p._id).toEqual(data._id.$id);
        expect(p.site).toEqual(data.site);
        expect(p.name).toEqual(data.name);
        expect(p.title).toEqual(data.title);
        expect(p.lang).toEqual(data.lang);
        expect(p.comment).toBeTruthy();
        expect(p.versions).toEqual(data.versions);
        expect(p.tags).toEqual(data.tags);
        expect(p.links).toEqual(data.links);
        expect(p.comments).toEqual(data.comments);
        expect(p.last_refresh).toEqual(data.last_refresh);
    });

    it("Page.setData with $id", function() {
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
        jasmine.clock().mockDate(date);

        var p = new Page();
        p.setData(data);

        expect(p._id).toEqual(123);
        expect(p.site).toEqual(data.site);
        expect(p.name).toEqual(data.name);
        expect(p.title).toEqual(data.title);
        expect(p.lang).toEqual(data.lang);
        expect(p.comment).toBeTruthy();
        expect(p.versions).toEqual(data.versions);
        expect(p.tags).toEqual(data.tags);
        expect(p.links).toEqual(data.links);
        expect(p.comments).toEqual(data.comments);
        expect(p.last_refresh).toEqual(data.last_refresh);
    });

    it("Page.setData without $id", function() {
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
        jasmine.clock().mockDate(date);

        var p = new Page();
        p.setData(data);

        expect(p._id).toEqual(123);
        expect(p.site).toEqual(data.site);
        expect(p.name).toEqual(data.name);
        expect(p.title).toEqual(data.title);
        expect(p.lang).toEqual(data.lang);
        expect(p.comment).toBeTruthy();
        expect(p.versions).toEqual(data.versions);
        expect(p.tags).toEqual(data.tags);
        expect(p.links).toEqual(data.links);
        expect(p.comments).toEqual(data.comments);
        expect(p.last_refresh).toEqual(data.last_refresh);
    });
});

describe("Factory : Page : save", function() {
    var Page;

    beforeEach(module('pages'));
    beforeEach(inject(function (_Page_) {
        Page = _Page_;
    }));

    var $httpBackend, authRequestHandler, $rootScope;
    beforeEach(inject(function($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('POST', '/api/1/bo-management/pages/')
            .respond({_id: 123});

        $httpBackend.when('POST', '/api/1/bo-management/pages/456')
            .respond({_id: 123});

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');
    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("saving a page : OK", function() {
        $httpBackend.expectPOST('/api/1/bo-management/pages/');

        var c = new Page();

        c.save(function(data){});
        $httpBackend.flush();

        expect(c._id).toEqual(123);
    });

    it("saving an existing page : OK", function() {
        $httpBackend.expectPOST('/api/1/bo-management/pages/456');

        var c = new Page();
        c._id = 456;

        c.save(function(data){});
        $httpBackend.flush();

        expect(c._id).toEqual(456);
    });

    it("saving a page : NOK", function() {
        $httpBackend.expectPOST('/api/1/bo-management/pages/');
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler.respond(500, returnValueFromPost);

        var c = new Page();

        c.save();
        $httpBackend.flush();

        expect(c._id).toEqual(-1);
        expect(c.error_api).toEqual(returnValueFromPost);
    });

});

describe("Factory : Page : load", function() {
    var Page;
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

    beforeEach(module('pages'));
    beforeEach(inject(function (_Page_) {
        Page = _Page_;
    }));

    var $httpBackend, authRequestHandler, $rootScope;
    beforeEach(inject(function($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/pages/123')
            .respond(data);

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');
    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("loading a page : OK", function() {
        $httpBackend.expectGET('/api/1/bo-management/pages/123');

        var c = new Page();

        c.load(123);
        $httpBackend.flush();

        expect(c._id).toEqual(123);
    });

    it("loading a page : NOK", function() {
        $httpBackend.expectGET('/api/1/bo-management/pages/123');
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler.respond(500, returnValueFromPost);

        var c = new Page();

        c.load(123);
        $httpBackend.flush();

        expect(c._id).toEqual(-1);
        expect(c.error_api).toEqual(returnValueFromPost);
    });
});

describe("Factory : Page : delete", function() {
    var Page;
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

    beforeEach(module('pages'));
    beforeEach(inject(function (_Page_) {
        Page = _Page_;
    }));

    var $httpBackend, authRequestHandler, $rootScope;
    beforeEach(inject(function($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('DELETE', '/api/1/bo-management/pages/123')
            .respond(data);

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');
    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("deleting a page : OK 1", function() {
        $httpBackend.expectDELETE('/api/1/bo-management/pages/123');

        var c = Page.build(data);

        c.delete();
        $httpBackend.flush();

        expect(c._id).toEqual(123);
    });

    it("deleting a page : OK 2", function() {
        $httpBackend.expectDELETE('/api/1/bo-management/pages/123');

        var c = Page.build(data);

        c.delete(function(data) {});
        $httpBackend.flush();

        expect(c._id).toEqual(123);
    });

    it("deleting a page : NOK", function() {
        $httpBackend.expectDELETE('/api/1/bo-management/pages/123');
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler.respond(500, returnValueFromPost);

        var c = Page.build(data);

        c.delete();
        $httpBackend.flush();

        expect(c._id).toEqual(-1);
        expect(c.error_api).toEqual(returnValueFromPost);
    });
});
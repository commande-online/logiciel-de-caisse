describe("Factory : Media : Default value / setters / getters", function() {
    var Media;

    beforeEach(module('pages'));
    beforeEach(module('products'));
    beforeEach(module('medias'));
    beforeEach(inject(function (_Media_) {
        Media = _Media_;
    }));

    it("default value in the cart object", function() {
        c = new Media();

        // Default Attributes
        expect(c._id).toBeUndefined();
        expect(c.site).toBeUndefined();
        expect(c.user).toBeUndefined();
        expect(c.type).toBeUndefined();
        expect(c.status).toBeUndefined();
        expect(c.logStatus).toBeUndefined();
        expect(c.uploadDate).toBeUndefined();
        expect(c.url).toBeUndefined();
        expect(c.publicFlag).toBeUndefined();
        expect(c.infos).not.toBeUndefined();//
        expect(c.tags.length).toEqual(0);
        expect(c.links.length).toEqual(0);
        expect(c.resizeds.length).toEqual(0);
        expect(c.original).toBeUndefined();
        expect(c.widthHeightRatio).toBeUndefined();
        expect(c.height).toBeUndefined();
        expect(c.width).toBeUndefined();
        expect(c.filename).toBeUndefined();
        expect(c.length).toBeUndefined();
        expect(c.chunkSize).toBeUndefined();
        expect(c.md5).toBeUndefined();


        // For AddFile
        expect(c.file).toBeUndefined();
        expect(c.name).toBeUndefined();
    });

    it("default getters", function() {
        c = new Media();

        // Default Methods
        expect(c.getNameToLower()).toEqual("");
        expect(c.getLinkInfo()).toEqual("");
        expect(c.isPicture()).toBeFalsy();
    });

    it("Media.build", function() {
        var date = new Date();
        var data = {
            _id: {$id: 123},
            site: 456,
            user : "toto",
            type: "abc",
            status: 1,
            logStatus: [{}],
            uploadDate: date.getTime(),
            url: "http://truc.com/foo.png",
            public: true,
            infos: {en: {lang: "en"}},
            tags: ["tag1", "tag2"],
            links: ["link1", "link2"],
            resizeds: ["rez1", "rez2"],
            original: true,
            widthHeightRatio: 10,
            height: 100,
            width: 50,
            filename: "foot.png",
            length: 789,
            chunkSize: 963,
            md5: 852
        };
        jasmine.clock().mockDate(date);

        var c = Media.build(data);

        expect(c._id).toEqual(data._id.$id);
        expect(c.site).toEqual(data.site);
        expect(c.user).toEqual(data.user);
        expect(c.type).toEqual(data.type);
        expect(c.status).toEqual(data.status);
        expect(c.logStatus).toEqual(data.logStatus);
        expect(c.uploadDate).toEqual(data.uploadDate);
        expect(c.url).toEqual(data.url);
        expect(c.publicFlag).toEqual(data.public);
        expect(c.infos).toEqual(data.infos);
        expect(c.tags.length).toEqual(2);
        expect(c.tags).toEqual(data.tags);
        expect(c.links.length).toEqual(2);
        expect(c.links).toEqual(data.links);
        expect(c.resizeds.length).toEqual(2);
        expect(c.resizeds).toEqual(data.resizeds);
        expect(c.original).toEqual(data.original);
        expect(c.widthHeightRatio).toEqual(data.widthHeightRatio);
        expect(c.height).toEqual(data.height);
        expect(c.width).toEqual(data.width);
        expect(c.filename).toEqual(data.filename);
        expect(c.length).toEqual(data.length);
        expect(c.chunkSize).toEqual(data.chunkSize);
        expect(c.md5).toEqual(data.md5);
    });

    it("Media.setData with $id", function() {
        var date = new Date();
        var data = {
            _id: {$id: 123},
            site: 456,
            user : "toto",
            type: "abc",
            status: 1,
            logStatus: [{}],
            uploadDate: date.getTime(),
            url: "http://truc.com/foo.png",
            publicFlag: true,
            infos: {en: {lang: "en"}},
            tags: ["tag1", "tag2"],
            links: ["link1", "link2"],
            resizeds: ["rez1", "rez2"],
            original: true,
            widthHeightRatio: 10,
            height: 100,
            width: 50,
            filename: "foo.png",
            length: 789,
            chunkSize: 963,
            md5: 852
        };
        jasmine.clock().mockDate(date);

        var c = new Media();
        c.setData(data);

        expect(c._id).toEqual(123);
        expect(c.site).toEqual(data.site);
        expect(c.user).toEqual(data.user);
        expect(c.type).toEqual(data.type);
        expect(c.status).toEqual(data.status);
        expect(c.logStatus).toEqual(data.logStatus);
        expect(c.uploadDate).toEqual(data.uploadDate);
        expect(c.url).toEqual(data.url);
        expect(c.publicFlag).toEqual(data.publicFlag);
        expect(c.infos).toEqual(data.infos);
        expect(c.tags.length).toEqual(2);
        expect(c.tags).toEqual(data.tags);
        expect(c.links.length).toEqual(2);
        expect(c.links).toEqual(data.links);
        expect(c.resizeds.length).toEqual(2);
        expect(c.resizeds).toEqual(data.resizeds);
        expect(c.original).toEqual(data.original);
        expect(c.widthHeightRatio).toEqual(data.widthHeightRatio);
        expect(c.height).toEqual(data.height);
        expect(c.width).toEqual(data.width);
        expect(c.filename).toEqual(data.filename);
        expect(c.length).toEqual(data.length);
        expect(c.chunkSize).toEqual(data.chunkSize);
        expect(c.md5).toEqual(data.md5);
    });

    it("Media.setData without $id", function() {
        var date = new Date();
        var data = {
            _id: 123,
            site: 456,
            user : "toto",
            type: "abc",
            status: 1,
            logStatus: [{}],
            uploadDate: date.getTime(),
            url: "http://truc.com/foo.png",
            public: true,
            infos: {en: {lang: "en"}},
            tags: ["tag1", "tag2"],
            links: ["link1", "link2"],
            resizeds: ["rez1", "rez2"],
            original: true,
            widthHeightRatio: 10,
            height: 100,
            width: 50,
            filename: "foo.png",
            length: 789,
            chunkSize: 963,
            md5: 852
        };
        jasmine.clock().mockDate(date);

        var c = new Media();
        c.setData(data);

        expect(c._id).toEqual(data._id);
        expect(c.site).toEqual(data.site);
        expect(c.user).toEqual(data.user);
        expect(c.type).toEqual(data.type);
        expect(c.status).toEqual(data.status);
        expect(c.logStatus).toEqual(data.logStatus);
        expect(c.uploadDate).toEqual(data.uploadDate);
        expect(c.url).toEqual(data.url);
        expect(c.publicFlag).toEqual(data.publicFlag);
        expect(c.infos).toEqual(data.infos);
        expect(c.tags.length).toEqual(2);
        expect(c.tags).toEqual(data.tags);
        expect(c.links.length).toEqual(2);
        expect(c.links).toEqual(data.links);
        expect(c.resizeds.length).toEqual(2);
        expect(c.resizeds).toEqual(data.resizeds);
        expect(c.original).toEqual(data.original);
        expect(c.widthHeightRatio).toEqual(data.widthHeightRatio);
        expect(c.height).toEqual(data.height);
        expect(c.width).toEqual(data.width);
        expect(c.filename).toEqual(data.filename);
        expect(c.length).toEqual(data.length);
        expect(c.chunkSize).toEqual(data.chunkSize);
        expect(c.md5).toEqual(data.md5);
    });

    it("Media.getNameToLower", function() {
        var date = new Date();
        var data = {
            _id: {$id: 123},
            site: 456,
            user: "toto",
            type: "abc",
            status: 1,
            logStatus: [{}],
            uploadDate: date.getTime(),
            url: "http://truc.com/foo.png",
            public: true,
            infos: {en: {lang: "en", name: "PROUT"}, fr: {lang: "fr", name:"TOTO"}},
            tags: ["tag1", "tag2"],
            links: ["link1", "link2"],
            resizeds: ["rez1", "rez2"],
            original: true,
            widthHeightRatio: 10,
            height: 100,
            width: 50,
            filename: "foo.png",
            length: 789,
            chunkSize: 963,
            md5: 852
        };
        jasmine.clock().mockDate(date);

        var c = Media.build(data);

        expect(c.getNameToLower()).toEqual("toto");
    });

    it("Media.getLinkInfo", function() {
        var date = new Date();
        var data = {
            _id: {$id: 123},
            site: 456,
            user: "toto",
            type: "abc",
            status: 1,
            logStatus: [{}],
            uploadDate: date.getTime(),
            url: "http://truc.com/foo.png",
            public: true,
            infos: {en: {lang: "en", name: "PROUT"}, fr: {lang: "fr", name:"TOTO"}},
            tags: ["tag1", "tag2"],
            links: ["link1", "link2"],
            resizeds: ["rez1", "rez2"],
            original: true,
            widthHeightRatio: 10,
            height: 100,
            width: 50,
            filename: "foo.png",
            length: 789,
            chunkSize: 963,
            md5: 852
        };
        jasmine.clock().mockDate(date);

        var c = Media.build(data);

        var link1 = {type: "Product", data: {name: "toto"}, position: 1};
        var link2 = {type: "Page", data: {name: "prout"}, position: 2};
        var link3 = {type: "NOP", element: "wtf", position: 3};

        expect(c.getLinkInfo(link1)).toEqual("Produit : " + link1.data.name + " - position : " + link1.position);
        expect(c.getLinkInfo(link2)).toEqual("Page : " + link2.data.name + " - position : " + link2.position);
        expect(c.getLinkInfo(link3)).toEqual(link3.type + " - " + link3.element + " - " + link3.position);
    });


    it("Media.getLinkInfo png", function() {
        var date = new Date();
        var data = {
            _id: {$id: 123},
            site: 456,
            user: "toto",
            type: "abc",
            status: 1,
            logStatus: [{}],
            uploadDate: date.getTime(),
            url: "http://truc.com/foo.png",
            public: true,
            infos: {en: {lang: "en", name: "PROUT"}, fr: {lang: "fr", name: "TOTO"}},
            tags: ["tag1", "tag2"],
            links: ["link1", "link2"],
            resizeds: ["rez1", "rez2"],
            original: true,
            widthHeightRatio: 10,
            height: 100,
            width: 50,
            filename: "foo.png",
            length: 789,
            chunkSize: 963,
            md5: 852
        };
        jasmine.clock().mockDate(date);

        var c = Media.build(data);

        expect(c.isPicture()).toBeTruthy();
    });
    it("Media.getLinkInfo PNG", function() {
        var date = new Date();
        var data = {
            _id: {$id: 123},
            site: 456,
            user: "toto",
            type: "abc",
            status: 1,
            logStatus: [{}],
            uploadDate: date.getTime(),
            url: "http://truc.com/foo.png",
            public: true,
            infos: {en: {lang: "en", name: "PROUT"}, fr: {lang: "fr", name: "TOTO"}},
            tags: ["tag1", "tag2"],
            links: ["link1", "link2"],
            resizeds: ["rez1", "rez2"],
            original: true,
            widthHeightRatio: 10,
            height: 100,
            width: 50,
            filename: "foo.PNG",
            length: 789,
            chunkSize: 963,
            md5: 852
        };
        jasmine.clock().mockDate(date);

        var c = Media.build(data);

        expect(c.isPicture()).toBeTruthy();
    });
    it("Media.getLinkInfo gif", function() {
        var date = new Date();
        var data = {
            _id: {$id: 123},
            site: 456,
            user: "toto",
            type: "abc",
            status: 1,
            logStatus: [{}],
            uploadDate: date.getTime(),
            url: "http://truc.com/foo.png",
            public: true,
            infos: {en: {lang: "en", name: "PROUT"}, fr: {lang: "fr", name: "TOTO"}},
            tags: ["tag1", "tag2"],
            links: ["link1", "link2"],
            resizeds: ["rez1", "rez2"],
            original: true,
            widthHeightRatio: 10,
            height: 100,
            width: 50,
            filename: "foo.gif",
            length: 789,
            chunkSize: 963,
            md5: 852
        };
        jasmine.clock().mockDate(date);

        var c = Media.build(data);

        expect(c.isPicture()).toBeTruthy();
    });
    it("Media.getLinkInfo JPG", function() {
        var date = new Date();
        var data = {
            _id: {$id: 123},
            site: 456,
            user: "toto",
            type: "abc",
            status: 1,
            logStatus: [{}],
            uploadDate: date.getTime(),
            url: "http://truc.com/foo.png",
            public: true,
            infos: {en: {lang: "en", name: "PROUT"}, fr: {lang: "fr", name: "TOTO"}},
            tags: ["tag1", "tag2"],
            links: ["link1", "link2"],
            resizeds: ["rez1", "rez2"],
            original: true,
            widthHeightRatio: 10,
            height: 100,
            width: 50,
            filename: "foo.JPG",
            length: 789,
            chunkSize: 963,
            md5: 852
        };
        jasmine.clock().mockDate(date);

        var c = Media.build(data);

        expect(c.isPicture()).toBeTruthy();
    });
    it("Media.getLinkInfo JPeG", function() {
        var date = new Date();
        var data = {
            _id: {$id: 123},
            site: 456,
            user: "toto",
            type: "abc",
            status: 1,
            logStatus: [{}],
            uploadDate: date.getTime(),
            url: "http://truc.com/foo.png",
            public: true,
            infos: {en: {lang: "en", name: "PROUT"}, fr: {lang: "fr", name: "TOTO"}},
            tags: ["tag1", "tag2"],
            links: ["link1", "link2"],
            resizeds: ["rez1", "rez2"],
            original: true,
            widthHeightRatio: 10,
            height: 100,
            width: 50,
            filename: "foo.JPeG",
            length: 789,
            chunkSize: 963,
            md5: 852
        };
        jasmine.clock().mockDate(date);

        var c = Media.build(data);

        expect(c.isPicture()).toBeTruthy();
    });
    it("Media.getLinkInfo ZZZ", function() {
        var date = new Date();
        var data = {
            _id: {$id: 123},
            site: 456,
            user: "toto",
            type: "abc",
            status: 1,
            logStatus: [{}],
            uploadDate: date.getTime(),
            url: "http://truc.com/foo.png",
            public: true,
            infos: {en: {lang: "en", name: "PROUT"}, fr: {lang: "fr", name: "TOTO"}},
            tags: ["tag1", "tag2"],
            links: ["link1", "link2"],
            resizeds: ["rez1", "rez2"],
            original: true,
            widthHeightRatio: 10,
            height: 100,
            width: 50,
            filename: "foo.ZZZ",
            length: 789,
            chunkSize: 963,
            md5: 852
        };
        jasmine.clock().mockDate(date);

        var c = Media.build(data);

        expect(c.isPicture()).toBeFalsy();
    });

    it("Media.getLinkInfo ZZZ", function() {
        var date = new Date();
        var data = {
            _id: {$id: 123},
            site: 456,
            user: "toto",
            type: "abc",
            status: 1,
            logStatus: [{}],
            uploadDate: date.getTime(),
            url: "http://truc.com/foo.png",
            public: true,
            infos: {en: {lang: "en", name: "PROUT"}, fr: {lang: "fr", name: "TOTO"}},
            tags: ["tag1", "tag2"],
            links: ["link1", "link2"],
            resizeds: ["rez1", "rez2"],
            original: true,
            widthHeightRatio: 10,
            height: 100,
            width: 50,
            filename: "foo.ZZZ",
            length: 789,
            chunkSize: 963,
            md5: 852
        };
        jasmine.clock().mockDate(date);

        var c = Media.build(data);
        var file = {name: "prout"};
        c.addFile(file);

        expect(c.file).toEqual(file);
        expect(c.name).toEqual(file.name);

        var f2 = {name: "roro"};
        c.addFile(f2);
        expect(c.file).toEqual(f2);
        expect(c.name).toEqual(file.name);
    });
});


describe("Factory : Media : load", function() {
    var Media;
    var date = new Date();
    var data = {
        _id: {$id: 123},
        site: 456,
        user: "toto",
        type: "abc",
        status: 1,
        logStatus: [{}],
        uploadDate: date.getTime(),
        url: "http://truc.com/foo.png",
        public: true,
        infos: {en: {lang: "en", name: "PROUT"}, fr: {lang: "fr", name: "TOTO"}},
        tags: ["tag1", "tag2"],
        links: ["link1", "link2"],
        resizeds: ["rez1", "rez2"],
        original: true,
        widthHeightRatio: 10,
        height: 100,
        width: 50,
        filename: "foo.ZZZ",
        length: 789,
        chunkSize: 963,
        md5: 852
    };

    beforeEach(module('pages'));
    beforeEach(module('products'));
    beforeEach(module('medias'));
    beforeEach(inject(function (_Media_) {
        Media = _Media_;
    }));

    var $httpBackend, authRequestHandler, $rootScope;
    beforeEach(inject(function($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/medias/123')
            .respond(data);

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');
    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("loading a media : OK", function() {
        $httpBackend.expectGET('/api/1/bo-management/medias/123');

        var c = new Media();

        c.load(123);
        $httpBackend.flush();

        expect(c._id).toEqual(123);
    });

    it("loading a media : NOK", function() {
        $httpBackend.expectGET('/api/1/bo-management/medias/123');
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler.respond(500, returnValueFromPost);

        var c = new Media();

        c.load(123);
        $httpBackend.flush();

        expect(c._id).toEqual(-1);
        expect(c.error_api).toEqual(returnValueFromPost);
    });
});

describe("Factory : Media : delete", function() {
    var Media;
    var date = new Date();
    var data = {
        _id: {$id: 123},
        site: 456,
        user: "toto",
        type: "abc",
        status: 1,
        logStatus: [{}],
        uploadDate: date.getTime(),
        url: "http://truc.com/foo.png",
        public: true,
        infos: {en: {lang: "en", name: "PROUT"}, fr: {lang: "fr", name: "TOTO"}},
        tags: ["tag1", "tag2"],
        links: ["link1", "link2"],
        resizeds: ["rez1", "rez2"],
        original: true,
        widthHeightRatio: 10,
        height: 100,
        width: 50,
        filename: "foo.ZZZ",
        length: 789,
        chunkSize: 963,
        md5: 852
    };

    beforeEach(module('pages'));
    beforeEach(module('products'));
    beforeEach(module('medias'));
    beforeEach(inject(function (_Media_) {
        Media = _Media_;
    }));

    var $httpBackend, authRequestHandler, $rootScope;
    beforeEach(inject(function($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('DELETE', '/api/1/bo-management/medias/123')
            .respond(data);

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');
    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("deleting a media : OK 1", function() {
        $httpBackend.expectDELETE('/api/1/bo-management/medias/123');

        var c = Media.build(data);

        c.delete();
        $httpBackend.flush();

        expect(c._id).toEqual(123);
    });

    it("deleting a media : OK 2", function() {
        $httpBackend.expectDELETE('/api/1/bo-management/medias/123');

        var c = Media.build(data);

        c.delete(function(data) {});
        $httpBackend.flush();

        expect(c._id).toEqual(123);
    });

    it("deleting a media : NOK", function() {
        $httpBackend.expectDELETE('/api/1/bo-management/medias/123');
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler.respond(500, returnValueFromPost);

        var c = Media.build(data);

        c.delete();
        $httpBackend.flush();

        expect(c._id).toEqual(-1);
        expect(c.error_api).toEqual(returnValueFromPost);
    });
});


describe("Factory : Media : save", function() {
    var Media;
    var date = new Date();
    var data = {
        _id: {$id: 123},
        site: 456,
        user: "toto",
        type: "abc",
        status: 1,
        logStatus: [{}],
        uploadDate: date.getTime(),
        url: "http://truc.com/foo.png",
        public: true,
        infos: {en: {lang: "en", name: "PROUT"}, fr: {lang: "fr", name: "TOTO"}},
        tags: ["tag1", "tag2"],
        links: ["link1", "link2"],
        resizeds: ["rez1", "rez2"],
        original: true,
        widthHeightRatio: 10,
        height: 100,
        width: 50,
        filename: "foo.ZZZ",
        length: 789,
        chunkSize: 963,
        md5: 852
    };

    beforeEach(module('pages'));
    beforeEach(module('products'));
    beforeEach(module('medias'));
    beforeEach(inject(function (_Media_) {
        Media = _Media_;
    }));

    var $httpBackend, authRequestHandler, $rootScope;
    beforeEach(inject(function($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('POST', '/api/1/bo-management/medias/')
            .respond({_id: 123});

        $httpBackend.when('POST', '/api/1/bo-management/medias/456')
            .respond({_id: 123});

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');
    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("saving a template : OK", function() {
        $httpBackend.expectPOST('/api/1/bo-management/medias/');

        var c = new Media();

        c.save(function(data){});
        $httpBackend.flush();

        expect(c._id).toEqual(123);
    });

    it("saving an existing product : OK", function() {
        $httpBackend.expectPOST('/api/1/bo-management/medias/456');

        var c = new Media();
        c._id = 456;

        c.save(function(data){});
        $httpBackend.flush();

        expect(c._id).toEqual(456);
    });

    it("saving a product : NOK", function() {
        $httpBackend.expectPOST('/api/1/bo-management/medias/');
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler.respond(500, returnValueFromPost);

        var c = new Media();

        c.save();
        $httpBackend.flush();

        expect(c._id).toEqual(-1);
        expect(c.error_api).toEqual(returnValueFromPost);
    });

});
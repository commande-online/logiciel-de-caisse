describe("Factory : Product : Default value / setters / getters", function() {
    var Product;

    beforeEach(module('products'));
    beforeEach(inject(function (_Product_) {
        Product = _Product_;
    }));

    it("default value in the cart object", function() {
        p = new Product();

        // Default Attributes
        expect(p._id).toBeUndefined();
        expect(p.site).toBeUndefined();
        expect(p.name).toBeUndefined();
        expect(p.owner).toBeUndefined();
        expect(p.last_update).toBeUndefined();
        expect(p.status).toBeUndefined();
        expect(p.logStatus).toBeUndefined();
        expect(p.website).toBeFalsy();
        expect(p.order_button_color).toBeUndefined();
        expect(p.barcode).toBeUndefined();
        expect(p.rating).toBeUndefined();
        expect(p.template).toBeUndefined();

        expect(p.fields.length).toEqual(0);
        expect(p.prices.length).toEqual(0);
        expect(p.comments.length).toEqual(0);
        expect(p.tags.length).toEqual(0);
        expect(p.categories.length).toEqual(0);
    });

    it("default getters", function() {
        p = new Product();

        // Default Methods
        expect(p.getField()).toBeNull();
        expect(p.getPrice()).toBeNull();
        expect(p.getPriceById()).toBeNull();
        expect(p.getBackgroundColorStyle()).toEqual("");
        expect(p.inCategory()).toBeTruthy();
    });

    it("Product.build", function() {
        var date = new Date();
        var data = {
            _id: {$id: 123},
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
        jasmine.clock().mockDate(date);

        var p = Product.build(data);

        expect(p._id).toEqual(data._id.$id);
        expect(p.site).toEqual(data.site);
        expect(p.name).toEqual(data.name);
        expect(p.owner).toEqual(data.owner);
        expect(p.status).toEqual(data.status);
        expect(p.website).toBeTruthy();
        expect(p.order_button_color).toEqual(data.order_button_color);
        expect(p.barcode).toEqual(data.barcode);
        expect(p.rating).toEqual(data.rating);
        expect(p.template).toEqual(data.template);

        expect(p.logStatus.length).toEqual(1);

        expect(p.fields.length).toEqual(1);
        expect(p.fields).toContain(data.fields[0]);
        expect(p.prices.length).toEqual(1);
        expect(p.prices).toContain(data.prices[0]);
        expect(p.comments.length).toEqual(1);
        expect(p.comments).toContain(data.comments[0]);
        expect(p.tags.length).toEqual(1);
        expect(p.tags).toContain(data.tags[0]);
        expect(p.categories.length).toEqual(1);
        expect(p.categories).toContain(data.categories[0]);
    });

    it("Product.setData with $id", function() {
        var date = new Date();
        var data = {
            _id: {$id: 123},
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
        jasmine.clock().mockDate(date);

        var p = new Product();
        p.setData(data);

        expect(p._id).toEqual(123);
        expect(p.site).toEqual(data.site);
        expect(p.name).toEqual(data.name);
        expect(p.owner).toEqual(data.owner);
        expect(p.status).toEqual(data.status);
        expect(p.website).toBeTruthy();
        expect(p.order_button_color).toEqual(data.order_button_color);
        expect(p.barcode).toEqual(data.barcode);
        expect(p.rating).toEqual(data.rating);
        expect(p.template).toEqual(data.template);

        expect(p.logStatus.length).toEqual(1);

        expect(p.fields.length).toEqual(1);
        expect(p.fields).toContain(data.fields[0]);
        expect(p.prices.length).toEqual(1);
        expect(p.prices).toContain(data.prices[0]);
        expect(p.comments.length).toEqual(1);
        expect(p.comments).toContain(data.comments[0]);
        expect(p.tags.length).toEqual(1);
        expect(p.tags).toContain(data.tags[0]);
        expect(p.categories.length).toEqual(1);
        expect(p.categories).toContain(data.categories[0]);
    });

    it("Product.setData without $id", function() {
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
        jasmine.clock().mockDate(date);

        var p = new Product();
        p.setData(data);

        expect(p._id).toEqual(123);
        expect(p.site).toEqual(data.site);
        expect(p.name).toEqual(data.name);
        expect(p.owner).toEqual(data.owner);
        expect(p.status).toEqual(data.status);
        expect(p.website).toBeTruthy();
        expect(p.order_button_color).toEqual(data.order_button_color);
        expect(p.barcode).toEqual(data.barcode);
        expect(p.rating).toEqual(data.rating);
        expect(p.template).toEqual(data.template);

        expect(p.logStatus.length).toEqual(1);

        expect(p.fields.length).toEqual(1);
        expect(p.fields).toContain(data.fields[0]);
        expect(p.prices.length).toEqual(1);
        expect(p.prices).toContain(data.prices[0]);
        expect(p.comments.length).toEqual(1);
        expect(p.comments).toContain(data.comments[0]);
        expect(p.tags.length).toEqual(1);
        expect(p.tags).toContain(data.tags[0]);
        expect(p.categories.length).toEqual(1);
        expect(p.categories).toContain(data.categories[0]);
    });
});

describe("Factory : Product : getBackgroundColorStyle", function() {
    var Product;

    beforeEach(module('products'));
    beforeEach(inject(function (_Product_) {
        Product = _Product_;
    }));

    it("default value empty|undefined", function() {
        p = new Product();

        expect(p.getBackgroundColorStyle()).toEqual("");
    });

    it("null value", function() {
        p = new Product();
        p.order_button_color = null;

        expect(p.getBackgroundColorStyle()).toEqual("");
    });

    it("with value", function() {
        p = new Product();
        p.order_button_color = "#CC0011";

        expect(p.getBackgroundColorStyle()).toEqual({"background-color": "#CC0011"});
    });
});

describe("Factory : Product : getField", function() {
    var Product;
    var date = new Date();
    var data = {
        fields: [{field: 789, lang: "fe"}, {field: 799, lang: "fr"}, {field: 789, lang: "fr"}]
    };

    beforeEach(module('products'));
    beforeEach(inject(function (_Product_) {
        Product = _Product_;
    }));

    it("default value", function() {
        p = new Product();

        expect(p.getField()).toBeNull();
        expect(p.getField(-1)).toBeNull();
    });

    it("object found", function() {
        var p = Product.build(data);

        expect(p.getField(789, "fr").field).toEqual(789);
    });

    it("object NOT found : wrong lang", function() {
        var p = Product.build(data);

        expect(p.getField(789, "ru")).toBeNull();
    });

    it("object NOT found : wrong id", function() {
        var p = Product.build(data);

        expect(p.getField(790, "fr")).toBeNull();
    });

    it("object NOT found : wrong id + lang", function() {
        var p = Product.build(data);

        expect(p.getField(790, "ru")).toBeNull();
    });
});

describe("Factory : Product : getPrice", function() {
    var Product;
    var date = new Date();
    var data = {
        prices: [{field: 102}, {field: 204}, {field: 509}]
    };

    beforeEach(module('products'));
    beforeEach(inject(function (_Product_) {
        Product = _Product_;
    }));

    it("default value", function() {
        p = new Product();

        expect(p.getPrice()).toBeNull();
        expect(p.getPrice(-1)).toBeNull();
    });

    it("object found", function() {
        var p = Product.build(data);

        expect(p.getPrice(204).field).toEqual(204);
    });

    it("object NOT found : wrong id", function() {
        var p = Product.build(data);

        expect(p.getPrice(909)).toBeNull();
    });
});

describe("Factory : Product : getPriceById", function() {
    var Product;
    var date = new Date();
    var data = {
        prices: [{_id: {$id: 102}}, {_id: {$id: 204}}, {_id: {$id: 509}}]
    };

    beforeEach(module('products'));
    beforeEach(inject(function (_Product_) {
        Product = _Product_;
    }));

    it("default value", function() {
        p = new Product();

        expect(p.getPriceById()).toBeNull();
        expect(p.getPriceById(-1)).toBeNull();
    });

    it("object found", function() {
        var p = Product.build(data);

        expect(p.getPriceById(204)._id.$id).toEqual(204);
    });

    it("object NOT found : wrong id", function() {
        var p = Product.build(data);

        expect(p.getPriceById(909)).toBeNull();
    });
});

describe("Factory : Product : addPrice", function() {
    var Product;
    var date = new Date();
    //{field: field._id.$id, value: field.value, value_onsite: field.value_onsite, vat: field.vat, isVatIncl: field.isVatIncl, stock: field.stock};
    var fields = [
        {_id: {$id: 123456}, value: 1, value_onsite: 2, vat: 3, isVatIncl: 4, stock: 5},
        {_id: {$id: 987654}, value: 9, value_onsite: 8, vat: 7, isVatIncl: 6, stock: 0}
    ];

    beforeEach(module('products'));
    beforeEach(inject(function (_Product_) {
        Product = _Product_;
    }));

    it("adding two prices", function() {
        p = new Product();
        p.addPrice(fields[0]);
        p.addPrice(fields[1]);

        expect(p.prices.length).toEqual(fields.length);

        for(var i = 0; i < fields.length; i++) {
            var price = p.getPrice(fields[i]._id.$id);
            expect(price.field).toEqual(fields[i]._id.$id);
            expect(price.value).toEqual(fields[i].value);
            expect(price.value_onsite).toEqual(fields[i].value_onsite);
            expect(price.vat).toEqual(fields[i].vat);
            expect(price.isVatIncl).toEqual(fields[i].isVatIncl);
            expect(price.stock).toEqual(fields[i].stock);
        }
    });
});

describe("Factory : Product : addField", function() {
    var Product;
    var date = new Date();
    //{field: field._id.$id, infos: {}, type: field.type};
    //{value: field[allLanguage[i].key].value, lang: allLanguage[i].key};
    //f.infos[allLanguage[i].key].value.push(field[allLanguage[i].key].data[n]._id);
    var fields = [
        {_id: {$id: 123456}, type: 1, fr: {value: "blabla"}, lang: "fr"},
        {_id: {$id: 987654}, type: 3, en: {data: [{_id: "abcdef"}, {_id: "zyxuv"}]}, lang: "en"}
    ];
    var lang = [{key:"fr"}, {key:"it"}, {key:"en"}];

    beforeEach(module('products'));
    beforeEach(inject(function (_Product_) {
        Product = _Product_;
    }));

    it("adding two fields (one text & one image)", function() {
        p = new Product();
        p.addField(fields[0], lang);
        p.addField(fields[1], lang);

        expect(p.fields.length).toEqual(fields.length);

        for(var i = 0; i < fields.length; i++) {
            var f = p.getField(fields[i]._id.$id, fields[i].lang);
            expect(f).not.toBeNull();
            expect(f.field).toEqual(fields[i]._id.$id);
            expect(f.type).toEqual(fields[i].type);
            if(fields[i].type != 3)
                expect(f.infos[fields[i].lang].value).toEqual(fields[i][fields[i].lang].value);
            else {
                for(var j = 0; j < fields[i][fields[i].lang].data.length; j++)
                    expect(f.infos[fields[i].lang].value[j]).toEqual(fields[i][fields[i].lang].data[j]._id);
            }
        }
    });
});

describe("Factory : Product : inCategory", function() {
    var Product;
    var date = new Date();
    var data = {
        categories: [{_id: {$id: 321}}, {_id: {$id: 8778}}, {_id: {$id: 1201}}]
    };

    beforeEach(module('products'));
    beforeEach(inject(function (_Product_) {
        Product = _Product_;
    }));

    it("default value", function() {
        p = new Product();

        expect(p.inCategory()).toBeTruthy();
        expect(p.inCategory(-1)).toBeFalsy();
    });

    it("object found", function() {
        var p = Product.build(data);

        expect(p.inCategory({_id: 8778})).toBeTruthy();
    });

    it("object NOT found : wrong id", function() {
        var p = Product.build(data);

        expect(p.inCategory({_id: 909})).toBeFalsy();
        expect(p.inCategory(8778)).toBeFalsy();
    });
});

describe("Factory : Product : save", function() {
    var Product;
    var $httpBackend, authRequestHandler, $rootScope;

    beforeEach(module('products'));
    beforeEach(inject(function (_Product_) {
        Product = _Product_;
    }));

    beforeEach(inject(function($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('POST', '/api/1/bo-management/products/')
            .respond({_id: 123});

        $httpBackend.when('POST', '/api/1/bo-management/products/456')
            .respond({_id: 123});

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');
    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("saving a product : OK", function() {
        $httpBackend.expectPOST('/api/1/bo-management/products/');

        var c = new Product();

        c.save(function(data){});
        $httpBackend.flush();

        expect(c._id).toEqual(123);
    });

    it("saving an existing product : OK", function() {
        $httpBackend.expectPOST('/api/1/bo-management/products/456');

        var c = new Product();
        c._id = 456;

        c.save(function(data){});
        $httpBackend.flush();

        expect(c._id).toEqual(456);
    });

    it("saving a product : NOK", function() {
        $httpBackend.expectPOST('/api/1/bo-management/products/');
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler.respond(500, returnValueFromPost);

        var c = new Product();

        c.save();
        $httpBackend.flush();

        expect(c._id).toEqual(-1);
        expect(c.error_api).toEqual(returnValueFromPost);
    });
});

describe("Factory : Product : load", function() {
    var Product;
    var date = new Date();
    var data = {
        _id: {$id: 123},
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

    beforeEach(module('products'));
    beforeEach(inject(function (_Product_) {
        Product = _Product_;
    }));

    var $httpBackend, authRequestHandler, $rootScope;
    beforeEach(inject(function($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/products/123')
            .respond(data);

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');
    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("loading a product : OK", function() {
        $httpBackend.expectGET('/api/1/bo-management/products/123');

        var c = new Product();

        c.load(123);
        $httpBackend.flush();

        expect(c._id).toEqual(123);
    });

    it("loading a product : NOK", function() {
        $httpBackend.expectGET('/api/1/bo-management/products/123');
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler.respond(500, returnValueFromPost);

        var c = new Product();

        c.load(123);
        $httpBackend.flush();

        expect(c._id).toEqual(-1);
        expect(c.error_api).toEqual(returnValueFromPost);
    });
});

describe("Factory : Product : loadFromField", function() {
    var Product;
    var date = new Date();
    var data = {
        _id: {$id: 123},
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

    beforeEach(module('products'));
    beforeEach(inject(function (_Product_) {
        Product = _Product_;
    }));

    beforeEach(inject(function($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/products/field/123')
            .respond(data);

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');
    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("loading a product : OK", function() {
        $httpBackend.expectGET('/api/1/bo-management/products/field/123');

        var c = new Product();

        c.loadFromField(123);
        $httpBackend.flush();

        expect(c._id).toEqual(123);
    });

    it("loading a product : NOK", function() {
        $httpBackend.expectGET('/api/1/bo-management/products/field/123');
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler.respond(500, returnValueFromPost);

        var c = new Product();

        c.loadFromField(123);
        $httpBackend.flush();

        expect(c._id).toEqual(-1);
        expect(c.error_api).toEqual(returnValueFromPost);
    });
});

describe("Factory : Product : delete", function() {
    var Product;
    var date = new Date();
    var data = {
        _id: {$id: 123},
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

    beforeEach(module('products'));
    beforeEach(inject(function (_Product_) {
        Product = _Product_;
    }));

    var $httpBackend, authRequestHandler, $rootScope;
    beforeEach(inject(function($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('DELETE', '/api/1/bo-management/products/123')
            .respond(data);

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');
    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("deleting a product : OK 1", function() {
        $httpBackend.expectDELETE('/api/1/bo-management/products/123');

        var c = Product.build(data);

        c.delete();
        $httpBackend.flush();

        expect(c._id).toEqual(123);
    });

    it("deleting a product : OK 2", function() {
        $httpBackend.expectDELETE('/api/1/bo-management/products/123');

        var c = Product.build(data);

        c.delete(function(data) {});
        $httpBackend.flush();

        expect(c._id).toEqual(123);
    });

    it("deleting a product : NOK", function() {
        $httpBackend.expectDELETE('/api/1/bo-management/products/123');
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler.respond(500, returnValueFromPost);

        var c = Product.build(data);

        c.delete();
        $httpBackend.flush();

        expect(c._id).toEqual(-1);
        expect(c.error_api).toEqual(returnValueFromPost);
    });
});
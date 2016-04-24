describe("Factory : User : Default value / setters / getters", function() {
    var User;

    beforeEach(module('users'));
    beforeEach(inject(function (_User_) {
        User = _User_;
    }));

    it("default value in the cart object", function() {
        u = new User();

        // Default Attributes
        expect(u._id).toBeUndefined();
        expect(u.firstname).toBeUndefined();
        expect(u.lastname).toBeUndefined();
        expect(u.phone).toBeUndefined();
        expect(u.addresses.length).toEqual(0);
        expect(u.email).toBeUndefined();
        expect(u.gender).toBeUndefined();
        expect(u.notificationFrequency).toBeUndefined();
        expect(u.optin_affiliate).toBeUndefined();
        expect(u.optin_site).toBeUndefined();
        expect(u.profilePicture).toBeUndefined();
    });

    it("default getter", function() {
       u = new User();

        expect(u.getFullname()).toEqual("");
        expect(u.getDefaultAddress()).toBeNull();
    });

    it("build", function() {
        var data = {
            id : 123,
            firstname : "john",
            lastname : "doh",
            phone : "0685658130",
            addresses : [{id: 456}],
            email : "chuivert@gmail.com",
            gender : "M",
            notificationFrequency : 1,
            optin_affiliate : 2,
            optin_site : 3,
            profilePicture : "profile.png"
        };

        var u = User.build(data);

        expect(u._id).toEqual(data.id);
        expect(u.firstname).toEqual(data.firstname);
        expect(u.lastname).toEqual(data.lastname);
        expect(u.phone).toEqual(data.phone);
        expect(u.addresses.length).toEqual(1);
        expect(u.addresses).toContain(data.addresses[0]);
        expect(u.email).toEqual(data.email);
        expect(u.gender).toEqual(data.gender);
        expect(u.notificationFrequency).toEqual(data.notificationFrequency);
        expect(u.optin_affiliate).toEqual(data.optin_affiliate);
        expect(u.optin_site).toEqual(data.optin_site);
        expect(u.profilePicture).toEqual(data.profilePicture);
    });


    it("constructor", function() {
        var data = {
            id : 123,
            firstname : "john",
            lastname : "doh",
            phone : "0685658130",
            addresses : [{id: 456}],
            email : "chuivert@gmail.com",
            gender : "M",
            notificationFrequency : 1,
            optin_affiliate : 2,
            optin_site : 3,
            profilePicture : "profile.png"
        };

        u = new User();
        u.constructor(data.id, data.firstname, data.lastname, data.phone, data.addresses, data.email, data.gender, data.notificationFrequency, data.optin_affiliate, data.optin_site, data.profilePicture);

        expect(u._id).toEqual(data.id);
        expect(u.firstname).toEqual(data.firstname);
        expect(u.lastname).toEqual(data.lastname);
        expect(u.phone).toEqual(data.phone);
        expect(u.addresses.length).toEqual(1);
        expect(u.addresses).toContain(data.addresses[0]);
        expect(u.email).toEqual(data.email);
        expect(u.gender).toEqual(data.gender);
        expect(u.notificationFrequency).toEqual(data.notificationFrequency);
        expect(u.optin_affiliate).toEqual(data.optin_affiliate);
        expect(u.optin_site).toEqual(data.optin_site);
        expect(u.profilePicture).toEqual(data.profilePicture);
    })
});

describe("Factory : User : getFullname", function() {
    var User;

    beforeEach(module('users'));
    beforeEach(inject(function (_User_) {
        User = _User_;
    }));

    it("default", function() {
        u = new User();

        expect(u.getFullname()).toEqual("");
    });

    it("firstname", function() {
        u = new User();
        u.firstname = "john";

        expect(u.getFullname()).toEqual(u.firstname);
    });

    it("lastname", function() {
        u = new User();
        u.lastname = "doh";

        expect(u.getFullname()).toEqual(u.lastname);
    });

    it("firstname + lastname", function() {
        u = new User();
        u.firstname = "john";
        u.lastname = "doh";

        expect(u.getFullname()).toEqual(u.firstname + " " + u.lastname);
    });
});


describe("Factory : User : load", function() {
    var $httpBackend, $rootScope, authRequestHandler;
    var User, userService;

    var date = new Date();
    var data = {
        id : 123,
        firstname : "john",
        lastname : "doh",
        phone : "0685658130",
        addresses : [{id: 456}],
        email : "chuivert@gmail.com",
        gender : "M",
        notificationFrequency : 1,
        optin_affiliate : 2,
        optin_site : 3,
        profilePicture : "profile.png"
    };

    beforeEach(module('users'));
    beforeEach(module('indexedDB'));
    beforeEach(inject(function (_User_, _userService_) {
        User = _User_;
        userService = _userService_;
    }));

    beforeEach(inject(function($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/users/123')
            .respond(data);


        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');
    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("loading a user : OK", function() {
        $httpBackend.expectGET('/api/1/bo-management/users/123');

        var c = new User();
        c.load(123);
        $httpBackend.flush();

        expect(c._id).toEqual(123);
        expect(c.firstname).toEqual(data.firstname);
    });

    it("loading a user : NOK", function() {
        $httpBackend.expectGET('/api/1/bo-management/users/123');
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler.respond(500, returnValueFromPost);

        var c = new User();
        c.load(123);
        $httpBackend.flush();

        expect(c._id).toEqual(-1);
        expect(c.error_api).toEqual(returnValueFromPost);
    });
});

describe("Factory : User : delete", function() {
    var User, userService;
    var date = new Date();
    var data = {
        id : 123,
        firstname : "john",
        lastname : "doh",
        phone : "0685658130",
        addresses : [{id: 456}],
        email : "chuivert@gmail.com",
        gender : "M",
        notificationFrequency : 1,
        optin_affiliate : 2,
        optin_site : 3,
        profilePicture : "profile.png"
    };

    beforeEach(module('users'));
    beforeEach(module('indexedDB'));
    beforeEach(inject(function (_User_, _userService_) {
        User = _User_;
        userService = _userService_;
    }));

    var $httpBackend, authRequestHandler, $rootScope;
    beforeEach(inject(function($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('DELETE', '/api/1/bo-management/users/123')
            .respond(data);

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');
    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("deleting a user : OK 1", function() {
        $httpBackend.expectDELETE('/api/1/bo-management/users/123');

        var c = User.build(data);

        c.delete();
        $httpBackend.flush();

        expect(c._id).toEqual(123);
    });

    it("deleting a user : OK 2", function() {
        $httpBackend.expectDELETE('/api/1/bo-management/users/123');

        var c = User.build(data);

        c.delete(function(data) {});
        $httpBackend.flush();

        expect(c._id).toEqual(123);
    });

    it("deleting a product : NOK", function() {
        $httpBackend.expectDELETE('/api/1/bo-management/users/123');
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler.respond(500, returnValueFromPost);

        var c = User.build(data);

        c.delete();
        $httpBackend.flush();

        expect(c._id).toEqual(-1);
        expect(c.error_api).toEqual(returnValueFromPost);
    });
});

describe("Factory : User : getDefaultAddress ", function() {
    var User, userService;
    var date = new Date();
    var data = {
        id : 123,
        firstname : "john",
        lastname : "doh",
        phone : "0685658130",
        addresses : [{id: 456, isDefault: false}, {id: 789, isDefault: true}],
        email : "chuivert@gmail.com",
        gender : "M",
        notificationFrequency : 1,
        optin_affiliate : 2,
        optin_site : 3,
        profilePicture : "profile.png"
    };

    beforeEach(module('users'));
    beforeEach(module('indexedDB'));
    beforeEach(inject(function (_User_, _userService_) {
        User = _User_;
        userService = _userService_;
    }));

    it("default address OK", function() {
        var c = User.build(data);
        expect(c.getDefaultAddress().id).toEqual(789);
    });

    it("default address NOK", function() {
        data.addresses[1].isDefault = false;
        var c = User.build(data);
        expect(c.getDefaultAddress().id).toEqual(456);
    });
});


describe("Factory : User : save", function() {
    var User, userService;
    var date = new Date();
    var data = {
        id : 123,
        firstname : "john",
        lastname : "doh",
        phone : "0685658130",
        addresses : [{id: 456, isDefault: false}, {id: 789, isDefault: true}],
        email : "chuivert@gmail.com",
        gender : "M",
        notificationFrequency : 1,
        optin_affiliate : 2,
        optin_site : 3,
        profilePicture : "profile.png"
    };

    beforeEach(module('users'));
    beforeEach(module('indexedDB'));
    beforeEach(inject(function (_User_, _userService_) {
        User = _User_;
        userService = _userService_;
    }));

    beforeEach(inject(function($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('POST', '/api/1/bo-management/users/')
            .respond({_id: 123});

        $httpBackend.when('POST', '/api/1/bo-management/users/456')
            .respond({_id: 123});

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');
    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("saving a user : OK", function() {
        $httpBackend.expectPOST('/api/1/bo-management/users/');

        var c = new User();

        c.save(function(data){});
        $httpBackend.flush();

        expect(c._id).toEqual(123);
    });

    it("saving an existing user : OK", function() {
        $httpBackend.expectPOST('/api/1/bo-management/users/456');

        var c = new User();
        c._id = 456;

        c.save(function(data){});
        $httpBackend.flush();

        expect(c._id).toEqual(456);
    });

    it("saving a user : NOK", function() {
        $httpBackend.expectPOST('/api/1/bo-management/users/');
        var returnValueFromPost = {NOK: 1, message: "ceci est le message d'erreur", code: 12};
        authRequestHandler.respond(500, returnValueFromPost);

        var c = new User();

        c.save();
        $httpBackend.flush();

        expect(c._id).toEqual(-1);
        expect(c.error_api).toEqual(returnValueFromPost);
    });
});

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
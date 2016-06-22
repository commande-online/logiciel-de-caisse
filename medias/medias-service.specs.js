describe("Service : Media : getMedias", function() {
    var Media, mediaService;

    beforeEach(module('pages'));
    beforeEach(module('products'));
    beforeEach(module('medias'));
    beforeEach(inject(function (_Media_, _mediaService_) {
        Media = _Media_;
        mediaService = _mediaService_;
    }));

    it("default value", function() {
        expect(mediaService.getMedias().length).toEqual(0);
    });

});

describe("Service : Media : loadMedias & resetMedias", function() {
    var Media, mediaService;

    beforeEach(module('pages'));
    beforeEach(module('products'));
    beforeEach(module('medias'));
    beforeEach(inject(function (_Media_, _mediaService_) {
        Media = _Media_;
        mediaService = _mediaService_;
    }));

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

    var authRequestHandler, $httpBackend, $timeout;
    beforeEach(inject(function(_$httpBackend_, _$timeout_) {
        // Set up the mock http service responses
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/api/1/bo-management/medias/list/0/100')
            .respond([data]);
    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation(false);
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("load from API", function(done) {
        $httpBackend.expectGET('/api/1/bo-management/medias/list/0/100');
        mediaService.loadMedias().then(function (data) {
            expect(mediaService.getMedias().length).toEqual(1);
            done();
        });
        $httpBackend.flush();
    });

    it("reset", function(done) {
        $httpBackend.expectGET('/api/1/bo-management/medias/list/0/100');
        mediaService.resetMedias().then(function (data) {
            expect(mediaService.getMedias().length).toEqual(1);
            done();
        });
        $httpBackend.flush();
    });
});

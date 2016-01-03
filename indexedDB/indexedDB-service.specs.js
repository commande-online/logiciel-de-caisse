/**/
describe("Service : IndexedDB : init", function() {
    var indexedDBService, $rootScope, $window;

    beforeEach(module('indexedDB'));

    beforeEach(inject(function(_indexedDBService_, _$rootScope_, _$window_) {
        indexedDBService = _indexedDBService_;
        $rootScope = _$rootScope_;
        $window = _$window_;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    }));

    afterEach(function () {
        if (indexedDBService.getDB() != null)
            indexedDBService.getDB().close();
        else
            console.log("DID NOT CLOSE ! ");
        //$window.indexedDB.deleteDatabase("myCOL");
    });

    it("default init", function(done) {
        var date = new Date();
        jasmine.clock().mockDate(date);

        indexedDBService.init(true).then(function(data) {
            expect(data.init).toBeTruthy();
            expect(indexedDBService.getDbName()).toEqual("myCOL");
            expect(indexedDBService.getDbVersion()).toEqual(1);
            expect(indexedDBService.getLastConnection()).toEqual(date.getTime());
            expect(indexedDBService.getLastUpdate()).toBeNull();
            expect(indexedDBService.needToUpdate()).toBeTruthy();
            expect(indexedDBService.getDB()).not.toBeNull();

            indexedDBService.update();
            done();
        }, function(reason) {
            console.log("NOK", reason);
        });
        $rootScope.$apply();
    });

    it("specific dbName & version", function(done) {
        var date = new Date();
        jasmine.clock().mockDate(date);

        indexedDBService.init(true, "otot", 99).then(function(data) {
            expect(data.init).toBeTruthy();
            expect(indexedDBService.getDbName()).toEqual("otot");
            expect(indexedDBService.getDbVersion()).toEqual(99);
            expect(indexedDBService.getLastConnection()).toEqual(date.getTime());
            expect(indexedDBService.getLastUpdate()).toBeNull();
            expect(indexedDBService.needToUpdate()).toBeTruthy();
            done();
        }, function(reason) {
            console.log("NOK", reason);
        });
        $rootScope.$apply();
    });

    it("no update", function(done) {
        var date = new Date();
        jasmine.clock().mockDate(date);

        indexedDBService.init().then(function(data) {
            expect(data).toBeUndefined();
            expect(indexedDBService.getDbName()).toEqual("myCOL");
            expect(indexedDBService.getDbVersion()).toEqual(1);
            expect(indexedDBService.getLastConnection()).toEqual(date.getTime());
            expect(indexedDBService.getLastUpdate()).not.toBeNull();
            expect(indexedDBService.needToUpdate()).toBeFalsy();
            done();
        }, function(reason) {
            console.log("NOK", reason);
        });
        $rootScope.$apply();
    });

    it("update needed", function(done) {
        var date = new Date();
        date.setMinutes(date.getMinutes() + 10);
        jasmine.clock().mockDate(date);

        indexedDBService.init().then(function(data) {
            expect(data.update).toBeTruthy();
            expect(indexedDBService.getDbName()).toEqual("myCOL");
            expect(indexedDBService.getDbVersion()).toEqual(1);
            expect(indexedDBService.getLastConnection()).toEqual(date.getTime());
            expect(indexedDBService.getLastUpdate()).not.toBeNull();
            expect(indexedDBService.needToUpdate()).toBeTruthy();
            done();
        }, function(reason) {
            console.log("NOK", reason);
        });
        $rootScope.$apply();
    });
});
/***/
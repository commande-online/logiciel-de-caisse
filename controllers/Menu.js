(function(){
    angular
        .module('menu', ['main'])
        .controller('MenuController', [
            'menuService', '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$rootScope',
            MenuController
        ]);

    /**
     * Main Controller for the Angular Material Starter App
     * @param $scope
     * @param $mdSidenav
     * @param avatarsService
     * @constructor
     */
    function MenuController(menuService, $mdSidenav, $mdBottomSheet, $log, $q, $rootScope) {
        var self = this;
        self.mainMenu     = [ ];

        // Load all registered users
        menuService
            .loadAllMainMenu()
            .then( function( menus ) {
                self.mainMenu    = [].concat(menus);

                // We tell the MainController which one is the first page
                $rootScope.$broadcast("initPage", menus[0]);
            });
    }

})();

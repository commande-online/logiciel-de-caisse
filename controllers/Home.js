(function(){
    angular
        .module('main')
        .controller('HomeController', [
            '$mdSidenav', '$http', '$log', '$q', '$scope', '$location', '$state', '$mdToast', '$mdDialog',
            HomeController
        ]);

    function HomeController( $mdSidenav, $http, $log, $q, $scope, $location, $state, $mdToast, $mdDialog) {
        console.log("homecontroller");
        var self = this;

    }

})();

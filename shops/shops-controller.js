(function(){
    angular
        .module('shops')
        .controller('ShopDatabaseController', [
            'indexedDBService', '$mdDialog', '$scope', '$window',
            ShopDatabaseController
        ]);


    function ShopDatabaseController(indexedDBService, $mdDialog, $scope, $window) {
        var self = this;

        // For the height of the list
        var decreaseForMaxHeight = 250;
        $("#shopDatabase").height(window.innerHeight-decreaseForMaxHeight);

        $(window).on("resize.doResize", function (){
            $scope.$apply(function(){
                $("#shopDatabase").height(window.innerHeight-decreaseForMaxHeight);
            });
        });

        $scope.$on("$destroy",function (){
            $(window).off("resize.doResize"); //remove the handler added earlier
        });

        $scope.reinitDb = function() {
            indexedDBService.reinit();
            $window.location.href = "#/home";
            $window.location.reload();
        }
    }

})();


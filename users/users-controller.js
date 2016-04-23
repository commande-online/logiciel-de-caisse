(function(){
    angular
        .module('users')
        .controller('UsersListController', [
            'userService', '$mdDialog', '$log', '$q', '$scope', '$filter', '$rootScope', '$location', 'User',
            UsersListController
        ])
        .controller('UsersEditController', ['elt', '$mdDialog', '$scope', 'User',
            UsersEditController
        ]);


    function UsersListController(userService, $mdDialog, $log, $q, $scope, $filter, $rootScope, $location, User) {
        var self = this;

        // For the height of the list
        var decreaseForMaxHeight = 250;
        $("#listUsers").height(window.innerHeight - decreaseForMaxHeight);
        $(window).on("resize.doResize", function () {
            $scope.$apply(function () {
                $("#listUsers").height(window.innerHeight - decreaseForMaxHeight);
            });
        });
        $scope.$on("$destroy", function () {
            $(window).off("resize.doResize"); //remove the handler added earlier
        });
        // End of the height thingy

        $scope.listUsers = userService.getUsers();
        $scope.gridData = {
            enableSorting: true,
            rowHeight: 70,
            expandableRowHeight: 700,
            columnDefs: [
                { name:'ID', field: '_id', width: '10%' },
                { name:'Name', width: '70%', cellTemplate: '' +
                '<div class="ui-grid-cell-contents" ng-class="col.colIndex()">' +
                    '<img ng-src="{{row.entity.profilePicture}}" class="md-avatar" alt="{{row.entity.getFullname()}}" ng-hide="!row.entity.profilePicture" />'+
                    '<strong>{{row.entity.getFullname()}}</strong><br />' +
                    '{{row.entity.phone}} - {{row.entity.email}}' +
                '</div>'},
                { name:'Action', width: '20%', cellTemplate: '' +
                '<div class="ui-grid-cell-contents" title="TOOLTIP" layout="row" layout-align="center center">' +
                    '<div><md-button class="md-fab md-warm iconInCircle md-button-large" aria-label="Création" ng-click="grid.appScope.createCart($event, row.entity);"><ng-md-icon icon="shopping_cart" size="40"></ng-md-icon></md-button></div>' +
                    '<div><md-button class="md-fab md-warm iconInCircle md-button-large" aria-label="Edition" ng-click="grid.appScope.editUser($event, row.entity);"><ng-md-icon icon="edit" size="40"></ng-md-icon></md-button></div>'+
                '</div>'}
            ],
            data : $scope.listUsers
        };

        $scope.refreshData = function () {
            $scope.gridData.data = $filter('filter')($scope.listUsers, $scope.searchText, undefined);
        };

        $scope.createCart = function(ev, user) {
            $location.url("/cart").search({user: user._id});
        };

        $scope.newUser = function(ev) {
            var user = new User();

            $mdDialog.show({
                controller: UsersEditController,
                templateUrl: 'partials/users-form.html',
                targetEvent: ev,
                locals: {elt: user},
                bindToController: true

            })
                .then(function(answer) {
                    user.save(function (data) {
                        if(data.OK == 1) {
                            //categoryService.resetCategories();
                            $scope.listUsers = userService.getUsers();

                            $rootScope.$broadcast('addNotification', 'Le client a bien été sauvegardé');
                        } else {
                            $rootScope.$broadcast('errorApi', data);
                        }
                    });
                    console.log("OK");
                }, function() { /* CANCEL */ });
        };

        $scope.editUser= function(ev, u) {
            var user = angular.copy(u);
            $log.info("Edit user : " + user._id);
            $mdDialog.show({
                controller: UsersEditController,
                templateUrl: 'partials/users-form.html',
                targetEvent: ev,
                locals: {elt: user},
                bindToController: true

            })
                .then(function(answer) {
                    user.save(function (data) {
                        if(data.OK == 1) {
                            //categoryService.resetCategories();
                            $scope.listUsers = userService.getUsers();

                            $rootScope.$broadcast('addNotification', 'Le client a bien été mis à jour');
                        } else {
                            $rootScope.$broadcast('errorApi', data);
                        }
                    });
                    console.log("OK");
                }, function() { /* CANCEL */ });
        };
    }


    function UsersEditController(elt, $mdDialog, $scope, User) {
        if(elt.firstname || elt.lastname)
            $scope.title = "Edition du client : "+ elt.getFullname();
        else
            $scope.title = "Création d'un client";

        // Add an empty address
        elt.addresses.push({});

        // Copy the element in the user
        $scope.user = elt;

        $scope.checkToAddATabForAddress = function(i) {
            if(i == ($scope.user.addresses.length - 1)) {
                // New empty address, adding a new one just in case
                elt.addresses.push({});
                // Doesn't work properly => it update the tab but doesn't click
                elt.addresses[i].alias = "nouvelle adresse";
                elt.addresses[i].fullname = $scope.user.getFullname();

            }
        };

        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.confirm = function() {
            $mdDialog.hide();
        };
    }

})();


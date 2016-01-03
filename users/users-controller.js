(function(){
    angular
        .module('users')
        .controller('UsersListController', [
            'userService', '$mdDialog', '$log', '$q', '$scope', '$mdToast', '$rootScope', '$location', 'User',
            UsersListController
        ])
        .controller('UsersEditController', ['elt', '$mdDialog', '$scope', 'User',
            UsersEditController
        ]);


    function UsersListController(userService, $mdDialog, $log, $q, $scope, $mdToast, $rootScope, $location, User) {
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

        $scope.showConfirmDeleteCategory = function(ev, category) {
            var confirm = $mdDialog.confirm()
                .title('Êtes vous sur de vouloir supprimer la catégorie "' + category.name + '" ?')
                .content('Attention, si vous supprimer la catégorie, il n\'y a pas de retour arrière possible.')
                .ok('OUI')
                .cancel('Annuler')
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function() {
                category.delete(function (data) {
                    if(data.OK == 1) {
                        categoryService.resetCategories();
                        $scope.listCategories = categoryService.getCategories();

                        $rootScope.$broadcast('addNotification', 'La catégorie a bien été supprimée');
                    } else {
                        $rootScope.$broadcast('errorApi', data);
                    }
                });

            }, function() {});
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


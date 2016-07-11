(function(){
    angular
        .module('templates')
        .controller('TemplatesListController', [
            '$mdDialog', '$log', '$q', '$scope', '$timeout', 'Template', '$filter', '$rootScope', 'templateService',
            TemplatesListController
        ]).controller('TemplatesEditController', [
            'elt', '$mdDialog', '$scope', 'Template', '$filter',
            TemplatesEditController
        ]);

    function TemplatesListController($mdDialog, $log, $q, $scope, $timeout, Template, $filter, $rootScope, templateService) {
        var self = this;
        $scope.listTemplates = templateService.getTemplates();

        // For the height of the list
        var decreaseForMaxHeight = 250;
        $("#listTemplates").height(window.innerHeight - decreaseForMaxHeight);

        $(window).on("resize.doResize", function () {
            $scope.$apply(function () {
                $("#listTemplates").height(window.innerHeight - decreaseForMaxHeight);
            });
        });

        $scope.$on("$destroy", function () {
            $(window).off("resize.doResize"); //remove the handler added earlier
        });
        // End of the height thingy

        $scope.gridData = {
            onRegisterApi: function(gridApi){
                $scope.gridApi = gridApi;
                $timeout(function() {
                    $scope.gridApi.core.handleWindowResize();
                });
            },
            enableSorting: true,
            rowHeight: 100,
            expandableRowHeight: 700,
            columnDefs: [
                { name: 'ID', field: '_id', width: '10%' },
                { name: 'Titre', field: 'name', width: '40%' },
                { name: 'Dernière modif', width: '10%', cellTemplate: 'templates/grid-last-update.html' },
                { name: 'Informations', width: '20%', cellTemplate : 'templates/grid-info.html' },
                { name: 'Action', width: '20%', cellTemplate: 'templates/grid-actions.html' }
            ],
            data : $scope.listTemplates
        };

        $scope.refreshData = function () {
            $scope.gridData.data = $filter('filter')($scope.listTemplates, $scope.searchText, undefined);
        };

        $scope.newTemplate = function(ev) {
            var template = new Template();

            $mdDialog.show({
                controller: TemplatesEditController,
                templateUrl: 'partials/templates-form.html',
                targetEvent: ev,
                locals: {elt: template},
                bindToController: true

            })
                .then(function(answer) {
                    template.save(function (data) {
                        if(data.OK == 1) {
                            templateService.resetTemplates();
                            $scope.listTemplates = templateService.getTemplates();

                            $rootScope.$broadcast('addNotification', 'La fiche produit a bien été sauvegardée');
                        } else {
                            $rootScope.$broadcast('errorApi', data);
                        }
                    });
                    console.log("OK");
                }, function() { /* CANCEL */ });
        };

        $scope.editTemplate = function(ev, template) {
            var template = angular.copy(template);
            $log.info("Edit template : " + template._id);
            $mdDialog.show({
                controller: TemplatesEditController,
                templateUrl: 'partials/templates-form.html',
                targetEvent: ev,
                locals: {elt: template},
                bindToController: true

            })
                .then(function(answer) {
                    template.save(function (data) {
                        if(data.OK == 1) {
                            templateService.resetTemplates();
                            $scope.listTemplates = templateService.getTemplates();
                            $rootScope.$broadcast('addNotification', 'La fiche produit a bien été mise à jour');
                        } else {
                            $rootScope.$broadcast('errorApi', data);
                        }
                    });
                    console.log("OK");
                }, function() { /* CANCEL */ });
        };

        $scope.showConfirmDeleteTemplate = function(ev, template) {
            var confirm = $mdDialog.confirm()
                .title('Êtes vous sur de vouloir supprimer la fiche produit "' + template.name + '" ?')
                .content('Attention, si vous supprimer la fiche produit, il n\'y a pas de retour arrière possible.')
                .ok('OUI')
                .cancel('Annuler')
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function() {
                template.delete(function (data) {
                    if(data.OK == 1) {
                        templateService.resetTemplates();
                        $scope.listTemplates = templateService.getTemplates();
                        $rootScope.$broadcast('addNotification', 'La fiche produit a bien été supprimée');
                    } else {
                        $rootScope.$broadcast('errorApi', data);
                    }
                });

            }, function() {});
        };
    }

    function TemplatesEditController(elt, $mdDialog, $scope, Template, $filter) {
        var templateFieldSwap = function(key, newKey) {
            var tmp = $scope.template.fields[key];
            $scope.template.fields[key] = $scope.template.fields[newKey];
            $scope.template.fields[key].position = key;
            $scope.template.fields[newKey] = tmp;
            $scope.template.fields[newKey].position = newKey;
        };

        $scope.templateFieldAdd = function(template) {
            if(template.fields == undefined) {
                template.fields = [];
            }
            template.fields.push({position: template.fields.length});

            return template;
        };

        $scope.templateFieldDel = function(position) {
            template.fields[i] = undefined;
            for(var i = position + 1; i < template.fields.length; i++) {
                template.fields[i].position--;
                template.fields[(i - 1)] = template.fields[i];
            }
            template.fields.pop();
        };

        $scope.title = "Edition de la fiche produit : "+ elt.name;
        var template = $scope.templateFieldAdd(elt);

        $scope.template = template;

        $scope.templateFieldUp = function(e, key) {
            var newKey = key - 1;
            templateFieldSwap(key, newKey);
        };

        $scope.templateFieldDown = function(e, key) {
            var newKey = key + 1;
            templateFieldSwap(key, newKey);
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

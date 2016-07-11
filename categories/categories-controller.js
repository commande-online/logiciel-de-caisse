(function(){
    angular
        .module('categories')
        .controller('CategoriesListController', [
            '$mdDialog', '$log', '$q', '$scope', '$timeout', 'Category', '$filter', '$rootScope', 'categoryService',
            CategoriesListController
        ]).controller('CategoriesEditController', [
            'elt', '$mdDialog', '$scope', 'Category', '$filter', 'languageService',
            CategoriesEditController
        ]);

    function CategoriesListController($mdDialog, $log, $q, $scope, $timeout, Category, $filter, $rootScope, categoryService) {
        var self = this;
        $scope.listCategories = categoryService.getCategories();

        // For the height of the list
        var decreaseForMaxHeight = 250;
        $("#listCategories").height(window.innerHeight - decreaseForMaxHeight);

        $(window).on("resize.doResize", function () {
            $scope.$apply(function () {
                $("#listCategories").height(window.innerHeight - decreaseForMaxHeight);
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
                { name: 'Titre', width: '40%', cellTemplate: 'categories/grid-title.html' },
                { name: 'Dernière modif', width: '10%', cellTemplate: 'categories/grid-last-update.html' },
                { name: 'Informations', width: '20%', cellTemplate : 'categories/grid-info.html' },
                { name: 'Action', width: '20%', cellTemplate: 'categories/grid-actions.html' }
            ],
            data : $scope.listCategories
        };

        $scope.refreshData = function () {
            $scope.gridData.data = $filter('filter')($scope.listCategories, $scope.searchText, undefined);
        };

        $scope.newCategory = function(ev) {
            var category = new Category();

            $mdDialog.show({
                controller: CategoriesEditController,
                templateUrl: 'partials/categories-form.html',
                targetEvent: ev,
                locals: {elt: category},
                bindToController: true

            })
                .then(function(answer) {
                    category.save(function (data) {
                        if(data.OK == 1) {
                            categoryService.resetCategories();
                            $scope.listCategories = categoryService.getCategories();

                            $rootScope.$broadcast('addNotification', 'La catégorie a bien été sauvegardée');
                        } else {
                            $rootScope.$broadcast('errorApi', data);
                        }
                    });
                    console.log("OK");
                }, function() { /* CANCEL */ });
        };

        $scope.editCategory= function(ev, cat) {
            var category = angular.copy(cat);
            $log.info("Edit category : " + category._id);
            $mdDialog.show({
                controller: CategoriesEditController,
                templateUrl: 'partials/categories-form.html',
                targetEvent: ev,
                locals: {elt: category},
                bindToController: true

            })
                .then(function(answer) {
                    category.save(function (data) {
                        if(data.OK == 1) {
                            categoryService.resetCategories();
                            $scope.listCategories = categoryService.getCategories();

                            $rootScope.$broadcast('addNotification', 'La catégorie a bien été mise à jour');
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

    function CategoriesEditController(elt, $mdDialog, $scope, Category, $filter, languageService) {
        $scope.availableLanguages = languageService.getLanguages();
        $scope.lang = "fr";

        var categoryProductSwap = function(key, newKey) {
            var tmp = $scope.category.products[key];
            $scope.category.products[key] = $scope.category.products[newKey];
            $scope.category.products[key].position = key;
            $scope.category.products[newKey] = tmp;
            $scope.category.products[newKey].position = newKey;
        };

        $scope.categoryIngredientAdd = function(cat) {
            if(cat.ingredients == undefined) {
                cat.ingredients = new Array();
            }
            cat.ingredients.push({position: cat.ingredients.length});

            return cat;
        };

        $scope.title = "Edition de la catégorie : "+ elt.name;
        var cat = $scope.categoryIngredientAdd(elt);

        $scope.category = cat;

        $scope.categoryProductUp = function(e, key) {
            var newKey = key - 1;
            categoryProductSwap(key, newKey);
        };

        $scope.categoryProductDown = function(e, key) {
            var newKey = key + 1;
            categoryProductSwap(key, newKey);
        };

        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.confirm = function() {
            for (var key in $scope.category.infos) {
                if($scope.category.infos[key].lang == undefined) {
                    $scope.category.infos[key].lang = key;
                }
            }
            $mdDialog.hide();
        };
    }

})();

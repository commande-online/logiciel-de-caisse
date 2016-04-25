(function(){
    angular
        .module('products')
        .controller('ProductsListController', [
            '$mdDialog', '$log', '$q', '$scope', '$filter', 'Product', '$mdToast', '$rootScope', '$timeout', 'productService',
            ProductsListController
        ]).controller('ProductsEditController', [
            'elt', '$mdDialog', '$scope', 'Product', '$filter', 'Template', 'Category', 'Media', 'languageService', 'categoryService', 'templateService',
            ProductsEditController
        ]);

    function ProductsListController($mdDialog, $log, $q, $scope, $filter, Product, $mdToast, $rootScope, $timeout, productService) {
        var self = this;
        var decreaseForMaxHeight = 250;
        $scope.listProducts = productService.getProducts();


        // For the height of the list
        $("#listProducts").height(window.innerHeight-decreaseForMaxHeight);

        $(window).on("resize.doResize", function (){
            $scope.$apply(function(){
                $("#listProducts").height(window.innerHeight-decreaseForMaxHeight);
            });
        });

        $scope.$on("$destroy",function (){
            $(window).off("resize.doResize"); //remove the handler added earlier
        });
        // End height


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
                { name:'ID', field: '_id', width: '10%' },
                { name:'Titre', width: '40%', cellTemplate: '' +
                    '<div class="ui-grid-cell-contents" ng-class="col.colIndex()">' +
                    '<h4>{{row.entity.name}}</h4>'+
                    '<md-chips ng-model="row.entity.categories" readonly="true">'+
                        '<md-chip-template>'+
                            '{{$chip.infos.fr.name}}{{$chip.name}}'+
                        '</md-chip-template>'+
                    '</md-chips>'+
                    '</div>'
                },
                { name:'Dernière modif', width: '10%', cellTemplate: '' +
                    '<div class="ui-grid-cell-contents text-center" ng-class="col.colIndex()">'+
                    '{{row.entity.logStatus[row.entity.logStatus.length - 1].date.sec * 1000 | date:\'shortDate\'}}'+
                    '</div>'
                },
                { name:'Informations', width: '20%', cellTemplate :'' +
                    '<div class="ui-grid-cell-contents" ng-class="col.colIndex()" layout="row" layout-align="center center">'+
                        '<div flex="25">'+
                            '<md-button class="md-fab md-primary md-button-large iconInCircle" aria-label="Champs" title="Champs">'+
                                '<ng-md-icon icon="art_track" style="fill:white"></ng-md-icon> {{row.entity.fields.length + row.entity.prices.length}}'+
                            '</md-button>'+
                        '</div>'+
                        '<div flex="25">'+
                            '<md-button class="md-fab md-primary md-button-large iconInCircle" aria-label="Tags" title="Tags">'+
                                '<ng-md-icon icon="more" style="fill:white"></ng-md-icon> {{row.entity.tags.length}}'+
                            '</md-button>'+
                        '</div>'+
                        '<div flex="25">'+
                            '<md-button class="md-fab md-primary md-button-large iconInCircle" aria-label="Commentaires" title="Commentaires">'+
                                '<ng-md-icon icon="comments" style="fill:white"></ng-md-icon> {{row.entity.comments.length}}'+
                            '</md-button>'+
                        '</div>'+
                        '<div flex="25">'+
                            '<md-button class="md-fab md-primary md-button-large iconInCircle" aria-label="Catégories" title="Catégories">'+
                                '<ng-md-icon icon="my_library_books" style="fill:white"></ng-md-icon> {{row.entity.categories.length}}'+
                            '</md-button>'+
                        '</div>'+
                    '</div>'

                },
                { name:'Action', width: '20%', cellTemplate: '' +
                    '<div class="ui-grid-cell-contents" ng-class="col.colIndex()" layout="row" layout-align="center center">' +
                        '<div>' +
                            '<md-button class="md-fab md-warm md-button-large iconInCircle" aria-label="Edition" ng-click="grid.appScope.editProduct($event, row.entity);">'+
                                '<ng-md-icon icon="edit" size="40"></ng-md-icon>'+
                            '</md-button>'+
                        '</div>'+
                        '<div>' +
                            '<md-button class="md-fab md-warm md-button-large iconInCircle" aria-label="Suppression" ng-click="grid.appScope.showConfirmDeleteProduct($event, row.entity);">'+
                                '<ng-md-icon icon="delete" size="40"></ng-md-icon>'+
                            '</md-button>'+
                        '</div>' +
                    '</div>'
                }
            ],
            data : $scope.listProducts
        };

        $scope.refreshData = function () {
            $scope.gridData.data = $filter('filter')($scope.listProducts, $scope.searchText, undefined);
        };

        // Create a new product by opening a dialog with an empty product
        $scope.newProduct = function(ev) {
            var product = new Product();

            $mdDialog.show({
                controller: ProductsEditController,
                templateUrl: 'partials/products-form.html',
                targetEvent: ev,
                locals: {elt: product},
                bindToController: true

            })
                .then(function(answer) {
                    product.save(function (data) {
                        if(data.OK == 1) {
                            productService.resetProducts();
                            $scope.listProducts = productService.getProducts();
                            $rootScope.$broadcast('addNotification', 'Le produit a bien été sauvegardée');
                        } else {
                            $rootScope.$broadcast('errorApi', data);
                        }
                    });
                    console.log("OK");
                }, function() { /* CANCEL */ });
        };


        // Edit an existing product by opening a dialog with a copy of the product
        $scope.editProduct = function(ev, product) {
            var product = angular.copy(product);
            $log.info("Edit product : " + product._id);
            $mdDialog.show({
                controller: ProductsEditController,
                templateUrl: 'partials/products-form.html',
                targetEvent: ev,
                locals: {elt: product},
                bindToController: true

            })
                .then(function(answer) {
                    product.save(function (data) {
                        if(data.OK == 1) {
                            productService.resetProducts();
                            $scope.listProducts = productService.getProducts();
                            $rootScope.$broadcast('addNotification', 'Le produit a bien été mise à jour');
                        } else {
                            $rootScope.$broadcast('errorApi', data);
                        }
                    });
                    console.log("OK");
                }, function() { /* CANCEL */ });
        };


        // Delete a product by opening a dialog to confirm
        $scope.showConfirmDeleteProduct = function(ev, product) {
            var confirm = $mdDialog.confirm()
                .title('Êtes vous sur de vouloir supprimer le produit "' + product.name + '" ?')
                .content('Attention, si vous supprimer le produit, il n\'y a pas de retour arrière possible.')
                .ok('OUI')
                .cancel('Annuler')
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function() {
                product.delete(function (data) {
                    if(data.OK == 1) {
                        //$scope.loadAll();
                        productService.resetProducts();
                        $scope.listProducts = productService.getProducts();
                        $rootScope.$broadcast('addNotification', 'Le produit a bien été supprimée');
                    } else {
                        $rootScope.$broadcast('errorApi', data);
                    }
                });

            }, function() {});
        };
    }

    function ProductsEditController(elt, $mdDialog, $scope, Product, $filter, Template, Category, Media, languageService, categoryService, templateService) {
        $scope.availableLanguages = languageService.getLanguages();
        $scope.lang = "fr";

        var self = this;
        $scope.title = "Edition du produit : "+ elt.name;
        $scope.listMedias = [];
        $scope.searchText = null;
        $scope.selectedItem = null;

        // Load all the medias
        Media.loadAll(function(medias) {
            for (var i = 0; i < medias.length; i++)
                $scope.listMedias.push(medias[i]);

            var templates = templateService.getTemplates();
            for (var i = 0; i < templates.length; i++) {
                for (var j = 0; j < templates[i].fields.length; j++) {
                    if (elt.template != undefined && templates[i]._id == elt.template.$id) {
                        switch (templates[i].fields[j].type) {
                            case 1 : // Field
                                for(var n = 0; n < $scope.availableLanguages.length; n++) {
                                    var field = elt.getField(templates[i].fields[j]._id.$id, $scope.availableLanguages[n].key);
                                    if(field != null) {
                                        if(field.lang == null || field.lang == undefined)
                                            field.lang = "fr";
                                        templates[i].fields[j][field.lang] = {value: field.value};
                                    }

                                }
                                break;
                            case 2 : // Price
                                var price = elt.getPrice(templates[i].fields[j]._id.$id);
                                if(price != null) {
                                    templates[i].fields[j].value = price.value;
                                    templates[i].fields[j].vat = price.vat;
                                    templates[i].fields[j].value_onsite = price.value_onsite;
                                    templates[i].fields[j].isVatIncl = price.isVatIncl;
                                    templates[i].fields[j].stock = price.stock;
                                }
                                break;
                            case 3 : // Picture
                                for(var n = 0; n < $scope.availableLanguages.length; n++) {
                                    var field = elt.getField(templates[i].fields[j]._id.$id, $scope.availableLanguages[n].key);
                                    if (field != null) {
                                        if (field.lang == null || field.lang == undefined)
                                            field.lang = "fr";

                                        templates[i].fields[j][field.lang] = {
                                            value: field._id.$id,
                                            data: $scope.listMediaForField(field._id.$id)
                                        };
                                    } else {
                                        templates[i].fields[j][$scope.availableLanguages[n].key] = {data: []};
                                    }
                                }
                                break;
                            default:
                                break;
                        }
                    } else if(templates[i].fields[j].type == 3) { // Picture
                        templates[i].fields[j].data = [];
                    }

                    if(templates[i].fields[templates[i].fields.length] != undefined) {
                        delete templates[i].fields[templates[i].fields.length];
                    }
                }
            }

            $scope.templates = templates;
        });

        $scope.addPictureTofield = function(t, f, m) {
            if(t != undefined && f != undefined && m != undefined) {
                for(var i = 0; i < $scope.listMedias.length; i++) {
                    if($scope.listMedias[i].filename == m) {
                        return $scope.listMedias[i];
                    }
                }
            }
            return null;
        };

        /**
         * Handle the query
         * @param query
         * @returns
         */
        $scope.querySearch = function (query) {
            var results = $scope.listMedias.filter(createFilterFor(query));
            return results;
        };
        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(media) {
                //console.log(media);
                return (media.getNameToLower().indexOf(lowercaseQuery) != -1);
            };
        }

        // Get the medias for a given field/element
        $scope.listMediaForField = function(element) {
            var returnValue = [];

            // We go through all media
            for(var i = 0; i < $scope.listMedias.length; i++) {
                // We go through all links
                for(var j = 0; j < $scope.listMedias[i].links.length; j++) {
                    if($scope.listMedias[i].links[j].type == "Product" && $scope.listMedias[i].links[j].element.$id == element) {
                        returnValue.push($scope.listMedias[i]);
                        //console.log("founded");
                    } else if($scope.listMedias[i].links[j].type == "Product"){
                        //console.log($scope.listMedias[i].links[j].element.$id + " vs. " + element);
                    }
                }
            }

            return returnValue;
        };

        $scope.product = elt;
        $scope.currentTemplate = elt.template;
        $scope.categories = categoryService.getCategories();

        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.confirm = function() {
            // Templates => fields + prices
            if($scope.product.template != undefined) {
                for (var i = 0; i < $scope.templates.length; i++) {
                    if ($scope.templates[i]._id == $scope.product.template.$id) {
                        var template = $scope.templates[i];
                        $scope.product.fields = [];
                        $scope.product.prices = [];
                        for (var j = 0; j < template.fields.length; j++) {
                            switch (template.fields[j].type) {
                                case 1 :
                                    $scope.product.addField(template.fields[j], $scope.availableLanguages);
                                    break;
                                case 2 :
                                    $scope.product.addPrice(template.fields[j]);
                                    break;
                                case 3 :
                                    $scope.product.addField(template.fields[j], $scope.availableLanguages);
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                }
            }

            // Categories
            $scope.product.categories = [];
            for(var i = 0; i < $scope.categories.length; i++) {
                if($scope.categories[i].productIncluded) {
                    $scope.product.categories.push($scope.categories[i]._id);
                }
            }

            $mdDialog.hide();
        };
    }

})();

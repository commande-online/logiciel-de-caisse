(function(){
    angular
        .module('promotions')
        .controller('PromotionsListController', [
            '$mdDialog', '$log', '$q', '$scope', '$timeout', 'Promotion', '$filter', '$rootScope', 'promotionService',
            PromotionsListController
        ]).controller('PromotionsEditController', [
            'elt', '$mdDialog', '$scope', 'Promotion', '$filter', 'Product', 'languageService', 'productService',
            PromotionsEditController
        ]).controller('PromotionsSendController', [
            'elt', '$mdDialog', '$scope', 'Promotion', '$filter',
            PromotionsSendController
        ]);

    function PromotionsListController($mdDialog, $log, $q, $scope, $timeout, Promotion, $filter, $rootScope, promotionService) {
        var self = this;
        $scope.listPromotions = promotionService.getPromotions();

        // For the height of the list
        var decreaseForMaxHeight = 250;
        $("#listPromotions").height(window.innerHeight - decreaseForMaxHeight);

        $(window).on("resize.doResize", function () {
            $scope.$apply(function () {
                $("#listPromotions").height(window.innerHeight - decreaseForMaxHeight);
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
                { name: 'Titre', width: '40%', cellTemplate: 'promotions/grid-title.html' },
                { name: 'Dernière modif', width: '10%', cellTemplate: 'promotions/grid-last-update.html' },
                { name: 'Informations', width: '20%', cellTemplate : 'promotions/grid-info.html' },
                { name: 'Action', width: '20%', cellTemplate: 'promotions/grid-actions.html' }
            ],
            data : $scope.listPromotions
        };

        $scope.refreshData = function () {
            $scope.gridData.data = $filter('filter')($scope.listPromotions, $scope.searchText, undefined);
        };


        $scope.newPromotion = function(ev) {
            var promotion = new Promotion();

            $mdDialog.show({
                controller: PromotionsEditController,
                templateUrl: 'partials/promotions-form.html',
                targetEvent: ev,
                locals: {elt: promotion},
                bindToController: true

            })
                .then(function(answer) {
                    promotion.save(function (data) {
                        if(data.OK == 1) {
                            promotionService.resetPromotions();
                            $scope.listPromotions = promotionService.getPromotions();

                            $rootScope.$broadcast('addNotification', 'L\'information à bien été sauvegardée');
                        } else {
                            $rootScope.$broadcast('errorApi', data);
                        }
                    });
                    console.log("OK");
                }, function() { /* CANCEL */ });
        };

        $scope.editPromotion = function(ev, promotion) {
            var promotion = angular.copy(promotion);
            $log.info("Edit promotion : " + promotion._id);
            $mdDialog.show({
                controller: PromotionsEditController,
                templateUrl: 'partials/promotions-form.html',
                targetEvent: ev,
                locals: {elt: promotion},
                bindToController: true

            })
                .then(function(answer) {
                    promotion.save(function (data) {
                        if(data.OK == 1) {
                            promotionService.resetPromotions();
                            $scope.listPromotions = promotionService.getPromotions();

                            $rootScope.$broadcast('addNotification', 'L\'information à bien été mise à jour');
                        } else {
                            $rootScope.$broadcast('errorApi', data);
                        }
                    });
                    console.log("OK");
                }, function() { /* CANCEL */ });
        };

        $scope.sendPromotion = function(ev, promotion) {
            var promotion = angular.copy(promotion);
            $log.info("Send promotion : " + promotion._id);
            $mdDialog.show({
                controller: PromotionsSendController,
                templateUrl: 'partials/promotions-send.html',
                targetEvent: ev,
                locals: {elt: promotion},
                bindToController: true

            })
                .then(function(answer) {
                    promotion.send(function (data) {
                        if(data.OK == 1) {
                            promotionService.resetPromotions();
                            $scope.listPromotions = promotionService.getPromotions();

                            $rootScope.$broadcast('addNotification', 'L\'information à bien été envoyée');
                        } else {
                            $rootScope.$broadcast('errorApi', data);
                        }
                    });
                    console.log("OK");
                }, function() { /* CANCEL */ });
        };

        $scope.showConfirmDeletePromotion = function(ev, promotion) {
            var confirm = $mdDialog.confirm()
                .title('Êtes vous sur de vouloir supprimer la promotion "' + promotion.infos.fr.shortDescription + '" ?')
                .content('Attention, si vous supprimer la promotion, il n\'y a pas de retour arrière possible.')
                .ok('OUI')
                .cancel('Annuler')
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function() {
                promotion.delete(function (data) {
                    if(data.OK == 1) {
                        promotionService.resetPromotions();
                        $scope.listPromotions = promotionService.getPromotions();

                        $rootScope.$broadcast('addNotification', 'L\'information à bien été supprimée');
                    } else {
                        $rootScope.$broadcast('errorApi', data);
                    }
                });

            }, function() {});
        };
    }

    function PromotionsEditController(elt, $mdDialog, $scope, Promotion, $filter, Product, languageService, productService) {
        $scope.availableLanguages = languageService.getLanguages();
        $scope.lang = "fr";
        $scope.title = "Edition de la promotion : "+ elt.shortDescription;
        var promotion = elt;
        $scope.products = productService.getProducts();


        if(promotion.validUntilDate != undefined)
            promotion.validUntilDate = new Date(promotion.validUntilDate.sec * 1000);
        else {
            promotion.validUntilDate = new Date();
            promotion.validUntilDate.setMonth(promotion.validUntilDate.getMonth() + 1);
        }
        $scope.promotion = promotion;

        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.confirm = function() {
            promotion.validUntilDate.sec = Math.round(promotion.validUntilDate.getTime() / 1000);
            $mdDialog.hide();
        };
    }

    function PromotionsSendController(elt, $mdDialog, $scope, Promotion, $filter) {
        $scope.title = "Envoyer la promotion : "+ elt.shortDescription;
        var promotion = elt;

        $scope.promotion = promotion;

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

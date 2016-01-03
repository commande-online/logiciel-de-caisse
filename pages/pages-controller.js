(function(){
    angular
        .module('pages')
        .controller('PagesListController', [
            'pageService', '$mdDialog', '$log', '$q', '$scope', '$sce', 'Page', '$window', '$rootScope',
            PagesListController
        ]).controller('PagesEditController', [
            'elt', '$mdDialog', '$scope', 'Page', 'languageService',
            PagesEditController
        ]);

    function PagesListController(pageService, $mdDialog, $log, $q, $scope, $sce, Page, $window, $rootScope) {
        var self = this;

        // For the height of the list
        var decreaseForMaxHeight = 250;
        $("#listPages").height(window.innerHeight - decreaseForMaxHeight);

        $(window).on("resize.doResize", function () {
            $scope.$apply(function () {
                $("#listPages").height(window.innerHeight - decreaseForMaxHeight);
            });
        });

        $scope.$on("$destroy", function () {
            $(window).off("resize.doResize"); //remove the handler added earlier
        });
        // End of the height thingy

        $scope.listPages = pageService.getPages();


        $scope.trustTextPage = function(page, i) {
            return $sce.trustAsHtml(page.versions[i].text);

        };

        $scope.newPage = function(ev) {
            var page = new Page();
            page.versions = [];
            page.versions.push({text: ""});
            $mdDialog.show({
                controller: PagesEditController,
                templateUrl: 'partials/pages-form.html',
                targetEvent: ev,
                locals: {elt: page},
                bindToController: true

            })
                .then(function(answer) {
                    page.save(function (data) {
                        if(data.OK == 1) {
                            pageService.resetPages();
                            $scope.listPages = pageService.getPages();

                            $rootScope.$broadcast('addNotification', 'La page à bien été sauvegardée');
                        } else {
                            $rootScope.$broadcast('errorApi', data);
                        }
                    });
                    console.log("OK");
                }, function() { /* CANCEL */ });
        };

        $scope.editPage = function(ev, page) {
            var page = angular.copy(page);
            $log.info("Edit page : " + page._id);
            $mdDialog.show({
                controller: PagesEditController,
                templateUrl: 'partials/pages-form.html',
                targetEvent: ev,
                locals: {elt: page},
                bindToController: true

            })
                .then(function(answer) {
                    page.save(function (data) {
                        if(data.OK == 1) {
                            pageService.resetPages();
                            $scope.listPages = pageService.getPages();

                            $rootScope.$broadcast('addNotification', 'La page à bien été mise à jour');
                        } else {
                            $rootScope.$broadcast('errorApi', data);
                        }
                    });
                    console.log("OK");
                }, function() { /* CANCEL */ });
        };

        $scope.showPage = function(page){
            $window.open('/page/'+page.name, '_blank');
        };

        $scope.showConfirmDeletePage = function(ev, page) {
            var confirm = $mdDialog.confirm()
                .title('Êtes vous sur de vouloir supprimer la page "' + page.title + '" ?')
                .content('Attention, si vous supprimer la page, il n\'y a pas de retour arrière possible.')
                .ok('OUI')
                .cancel('Annuler')
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function() {
                page.delete(function (data) {
                    if(data.OK == 1) {
                        pageService.resetPages();
                        $scope.listPages = pageService.getPages();

                    } else {
                        $rootScope.$broadcast('errorApi', data);
                    }
                });

            }, function() {});
        };
    }

    function PagesEditController(elt, $mdDialog, $scope, Page, languageService) {
        $scope.availableLanguages = languageService.getLanguages();

        if(elt.title != undefined)
            $scope.title = "Edition de la page : "+ elt.title;
        else
            $scope.title = "Création d'une page";
        var page = elt;
        if(page.versions.length > 0) {
            page.versions.push(angular.copy(page.versions[page.versions.length - 1]));
        } else {

        }

        $scope.pageText = page.text();
        for(var i = 0; i < $scope.availableLanguages.length; i++) {
            if(page.links[$scope.availableLanguages[i].key] != undefined) {
                $scope.availableLanguages[i].link = page.links[$scope.availableLanguages[i].key].url;
            }
        }

        $scope.page = page;

        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.confirm = function() {
            console.log(page.versions[page.versions.length - 1].text);
            //$scope.page.versions[page.versions.length - 1].text = $scope.pageText;

            for(var i = 0; i < $scope.availableLanguages.length; i++) {
                if(page.lang != $scope.availableLanguages[i].key) {
                    if (page.links[$scope.availableLanguages[i].key] != undefined && $scope.availableLanguages[i].link != "") {
                        page.links[$scope.availableLanguages[i].key].url = $scope.availableLanguages[i].link;
                    } else if($scope.availableLanguages[i].link != "") {
                        page.links[$scope.availableLanguages[i].key] = {
                            lang: $scope.availableLanguages[i].key,
                            url: $scope.availableLanguages[i].link
                        }
                    } else {
                        page.links[$scope.availableLanguages[i].key] = null;
                    }
                } else {
                    page.links[$scope.availableLanguages[i].key] = null;
                }
            }
            $mdDialog.hide();
        };
    }

})();

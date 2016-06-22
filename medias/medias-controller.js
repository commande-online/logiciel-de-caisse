(function () {
    angular
        .module('medias')
        .controller('MediasListController', [
            '$mdDialog', '$log', '$q', '$scope', '$filter', 'Media', '$timeout', '$rootScope', '$timeout', 'mediaService',
            MediasListController
        ]).controller('MediasEditController', [
            'elt', '$mdDialog', '$scope', 'Media', '$filter', 'languageService',
            MediasEditController
        ]).controller('MediasUploadController', [
            'elt', '$mdDialog', '$scope', 'Media', 'Upload',
            MediasUploadController
        ]);

    function MediasListController($mdDialog, $log, $q, $scope, $filter, Media, $timeout, $rootScope, $timeout, mediaService) {
        var self = this;
        $scope.files = [];
        $scope.listMedias = mediaService.getMedias();
        $scope.DOMAIN_API = DOMAIN_API;

        // For the height of the list
        var decreaseForMaxHeight = 250;
        $("#listMedias").height(window.innerHeight - decreaseForMaxHeight);

        $(window).on("resize.doResize", function () {
            $scope.$apply(function () {
                $("#listMedias").height(window.innerHeight - decreaseForMaxHeight);
            });
        });

        $scope.$on("$destroy", function () {
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
                { name: 'ID', field: '_id', width: '10%' },
                { name: 'Titre', width: '40%', cellTemplate: 'medias/grid-title.html' },
                { name: 'Dernière modif', width: '10%', cellTemplate: 'medias/grid-last-update.html' },
                { name: 'Informations', width: '20%', cellTemplate : 'medias/grid-info.html' },
                { name: 'Action', width: '20%', cellTemplate: 'medias/grid-actions.html' }
            ],
            data : $scope.listMedias
        };

        $scope.refreshData = function () {
            $scope.gridData.data = $filter('filter')($scope.listMedias, $scope.searchText, undefined);
        };

        $scope.newMedia = function (ev) {

            $mdDialog.show({
                controller: MediasUploadController,
                templateUrl: 'partials/medias-upload.html',
                targetEvent: ev,
                locals: {},
                bindToController: true

            })
                .then(function (answer) {
                    mediaService.resetMedias();
                    $scope.listMedias = mediaService.getMedias();
                    /* OK */
                }, function () { /* CANCEL */
                });
        };

        $scope.editMedia = function (ev, media) {
            var media = angular.copy(media);
            $log.info("Edit media : " + media._id);
            $mdDialog.show({
                controller: MediasEditController,
                templateUrl: 'partials/medias-form.html',
                targetEvent: ev,
                locals: {elt: media},
                bindToController: true

            })
                .then(function (answer) {
                    media.save(function (data) {
                        if (data.OK == 1) {
                            mediaService.resetMedias();
                            $scope.listMedias = mediaService.getMedias();
                            $rootScope.$broadcast('addNotification', 'Le media a bien été mise à jour');
                        } else {
                            $rootScope.$broadcast('errorApi', data);
                        }
                    });
                    console.log("OK");
                }, function () { /* CANCEL */
                });
        };

        $scope.showConfirmDeleteMedia = function (ev, media) {
            var confirm = $mdDialog.confirm()
                .title('Êtes vous sur de vouloir supprimer le fichier "' + media.name + '" ?')
                .content('Attention, si vous supprimer le produit, il n\'y a pas de retour arrière possible.')
                .ok('OUI')
                .cancel('Annuler')
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function () {
                media.delete(function (data) {
                    if (data.OK == 1) {
                        mediaService.resetMedias();
                        $scope.listMedias = mediaService.getMedias();
                        $rootScope.$broadcast('addNotification', 'Le media a bien été supprimé');
                    } else {
                        $rootScope.$broadcast('errorApi', data);
                    }
                });

            }, function () {
            });
        };
    }

    function MediasUploadController($mdDialog, $scope, Media, Upload) {
        $scope.title = "Téléverser vos médias";

        $scope.$watch('files', function () {
            $scope.upload($scope.files);
        });

        $scope.upload = function (files) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    Upload.upload({
                        url: '/api/1/bo-management/medias',
                        fields: {name: file.name},
                        file: file,
                        method: 'POST'
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }).success(function (data, status, headers, config) {
                        console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                    });

                }
            }
        };

        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.confirm = function () {
            $mdDialog.hide();
        };
    }

    function MediasEditController(elt, $mdDialog, $scope, Media, $filter, languageService) {
        $scope.availableLanguages = languageService.getLanguages();
        $scope.lang = "fr";

        $scope.title = "Edition du media : " + elt.infos.fr.name;

        elt.preview();
        elt.loadLinks();
        $scope.media = elt;

        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.confirm = function () {
            for (var key in $scope.media.infos) {
                if($scope.media.infos[key].lang == undefined) {
                    $scope.media.infos[key].lang = key;
                }
            }

            $mdDialog.hide();
        };
    }

})();

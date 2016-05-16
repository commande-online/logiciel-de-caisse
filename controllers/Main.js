(function(){
    angular
        .module('main')
        .controller('MainController', [
            '$interval', '$mdSidenav', '$http', '$mdBottomSheet', '$q', '$scope', '$location', '$state', '$mdToast', '$mdDialog', '$cookieStore','$rootScope','languageService', 'productService', 'cartService', 'mediaService', 'templateService', 'promotionService', 'categoryService', 'pageService', 'userService', 'indexedDBService', 'jwtHelper', '$window', '$log',
            MainController
        ]).controller('ConnectionController', [
            'elt', '$mdDialog', '$scope',
            ConnectionController
        ]);

    function MainController( $interval, $mdSidenav, $http, $mdBottomSheet, $q, $scope, $location, $state, $mdToast, $mdDialog, $cookieStore, $rootScope, languageService, productService, cartService, mediaService, templateService, promotionService, categoryService, pageService, userService, indexedDBService, jwtHelper, $window, $log) {
        console.log("maincontroller");
        var self = this;
        self.version = "0.1";
        self.selectedPage = null;
        self.connection = false;
        self.selectPage   = selectPage;
        self.selectSubPage   = selectSubPage;
        self.toggleMainMenu   = toggleMainMenu;
        self.subMenu = [];
        self.notifications = [];

        $scope.$on("initPage", function (event, args) {
            selectPage(args);
        });

        $scope.$on('addNotification', function(event, message) {
            self.notifications.push(message);
            $mdToast.show(
                $mdToast.simple()
                    .content(message)
                    .position("top right")
                    .hideDelay(6000)
            );
        });

        $scope.toastLoading = null;
        $scope.myToast = null;

        $scope.$on('loadingNotification', function(event) {
            $scope.myToast = $mdToast.simple()
                .content("Chargement en cours ...")
                .position("top right")
                .highlightAction(false)
                .hideDelay(600000);
            $scope.toastLoading = $mdToast.show(
                $scope.myToast
            );
        });
        $scope.$on('stopLoadingNotification', function(event) {
           if($scope.myToast) {
               //toastLoading.hide();
               $mdToast.hide($scope.toastLoading).then(function(a) {/*console.log("toast has been hidden", a)*/}); // Will be executed after the closing
               $mdToast.hide($scope.myToast).then(function(a) {/*console.log("toastSimple has been hidden", a)*/}); // Will be executed straight away


               $mdToast.cancel($scope.toastLoading).then(function(a) {/*console.log("toast has been cancel", a)*/}); // Will be executed after the closing
               $mdToast.cancel($scope.myToast).then(function(a) {/*console.log("toastSimple has been cancel", a)*/}); // Will be executed straight away

               $scope.myToast = null;
           }
        });


        $scope.$on('errorApi', function(event, args) {
            $log.debug("error", args);
            if(!args.code || args.code == -1) {
                connection();
            } else {
                $mdToast.show(
                    $mdToast.simple()
                        .content("ERROR " + args.message)
                        .position("top right")
                        .hideDelay(6000)
                );
            }
        });

        $rootScope.loadingApp = true;
        function loadingApp() {

            $window.location.href = "#/home";
            var promise = indexedDBService.init(/*true*/);
            promise.then(function(data) {
                languageService.loadLanguages();
                if(data) {
                    if(data.init) {
                        // Init DB
                            productService.loadProducts().then(function () {
                                cartService.loadCarts().then(function () {
                                    userService.loadUsers().then(function () {
                                        mediaService.loadMedias().then(function () {
                                            templateService.loadTemplates().then(function () {
                                                promotionService.loadPromotions().then(function () {
                                                    categoryService.loadCategories().then(function () {
                                                        pageService.loadPages().then(function () {
                                                            // If they are back to back http request, we wait
                                                            var infoInterval = $interval(function () {
                                                                if ($http.pendingRequests.length == 0) {
                                                                    //console.log("OK");
                                                                    $scope.hideSplash = true;
                                                                    $scope.hideSplashLoading = true;
                                                                    $rootScope.loadingApp = false;
                                                                    $interval.cancel(infoInterval);
                                                                    indexedDBService.update();
                                                                    console.log(indexedDBService.getLastConnection());
                                                                } else {
                                                                    //console.log("not yet");
                                                                }
                                                            }, 1000);
                                                        });
                                                    });
                                                })
                                            });
                                        });
                                    });
                                });
                            });
                    } else {
                        // Update
                        var dateSince = new Date(indexedDBService.getLastUpdate());
                            cartService.updateCarts(dateSince).then(function () {
                                productService.updateProducts(dateSince).then(function () {
                                    userService.updateUsers(dateSince).then(function () {
                                        categoryService.updateCategories(dateSince).then(function () {
                                            templateService.updateTemplates(dateSince).then(function () {
                                                var infoInterval = $interval(function () {
                                                    if ($http.pendingRequests.length == 0) {
                                                        //console.log("OK");
                                                        $scope.hideSplash = true;
                                                        $scope.hideSplashLoading = true;
                                                        $rootScope.loadingApp = false;
                                                        $interval.cancel(infoInterval);
                                                        indexedDBService.update();
                                                        console.log(indexedDBService.getLastConnection());
                                                    } else {
                                                        //console.log("not yet");
                                                    }
                                                }, 1000);
                                            });
                                        });
                                    });
                                });
                            });
                    }
                } else {
                    // Nothing to do
                    // Pre-loading the DB for important stuff
                    categoryService.getCategories();

                    // Handling the splash
                    var infoInterval = $interval(function () {
                        if ($http.pendingRequests.length == 0) {
                            //console.log("OK");
                            $scope.hideSplash = true;
                            $scope.hideSplashLoading = true;
                            $rootScope.loadingApp = false;
                            $interval.cancel(infoInterval);
                            indexedDBService.update();
                            console.log(indexedDBService.getLastConnection());
                        } else {
                            //console.log("not yet");
                        }
                    }, 1000);
                }
                console.log("DB DONE", data)
            }, function(data) {
                console.log("DB ERROR", data)
            }, function(update) {
                console.log("DB UPDATE", data)
            });
/*
            languageService.loadLanguages().then(function() {
                productService.loadProducts().then(function() {
                    cartService.loadCarts().then(function() {
                        userService.loadUsers().then(function() {
                            mediaService.loadMedias().then(function () {
                                templateService.loadTemplates().then(function () {
                                    promotionService.loadPromotions().then(function () {
                                        categoryService.loadCategories().then(function () {
                                            pageService.loadPages().then(function () {
                                                // If they are back to back http request, we wait
                                                var infoInterval = $interval(function() {
                                                    if($http.pendingRequests.length == 0) {
                                                        //console.log("OK");
                                                        $scope.hideSplash = true;
                                                        $scope.hideSplashLoading = true;
                                                        $rootScope.loadingApp = false;
                                                        $interval.cancel(infoInterval);

                                                        console.log(indexedDBService.getLastConnection());
                                                    } else {
                                                        //console.log("not yet");
                                                    }
                                                }, 1000);
                                            });
                                        });
                                    })
                                });
                            });
                        });
                    });
                });
            });
            */
        }

        function connection() {
            if(!self.connection) {
                var user = {};
                $scope.hideSplash = false;
                self.connection = true;
                $mdDialog.show({
                    controller: ConnectionController,
                    templateUrl: 'partials/connexion.html',
                    locals: {elt: user},
                    bindToController: true

                })
                    .then(function (answer) {
                        $http.post(DOMAIN_API + '/api/1/authenticate', {withCredentials: true, email: user.login, password: user.password, connection: 1, cookie: 1}).
                            success(function (data, status, headers, config) {
                                localStorage.setItem('id_token', data.token);
                                $cookieStore.put("current_user_app-bo", {withCredentials: true, email: user.login, password: user.password, connection: 1, cookie: 1});
                                loadingApp();
                            }).
                            error(function (data, status, headers, config) {
                                alert(data.message);
                            });
                    }, function () { /* CANCEL */
                    });
            }
        }

        /**
         * First hide the bottomsheet IF visible, then
         * hide or Show the 'left' sideNav area
         */
        function toggleMainMenu() {
            var pending = $mdBottomSheet.hide() || $q.when(true);

            pending.then(function(){
                //console.log("hide");
                $mdSidenav('mainMenu').toggle();
            })
        }

        /**
         * Select the current avatars
         * @param page
         */
        function selectPage( page ) {
            self.selectedPage = page;

            if(page.subMenu != null) {
                self.subMenu = page.subMenu;
                $mdSidenav('subMenu').open();
            } else {
                $mdSidenav('mainMenu').close();
                $mdSidenav('subMenu').close();
                $state.go(page.url);
                //$location.path( page.url );
            }
        }
        function selectSubPage( page ) {
            self.selectedPage = page;
            $mdSidenav('subMenu').close();
            $mdSidenav('mainMenu').close();
            $location.path( page.url );
        }

        if($cookieStore.get("current_user_app-bo") == undefined) {
            connection();
        } else if(localStorage.getItem('id_token') && jwtHelper.isTokenExpired(localStorage.getItem('id_token'))) {
            var tokenPayload = jwtHelper.decodeToken(localStorage.getItem('id_token'));
            console.log("Token Expired !");
            console.log(tokenPayload);
            connection();
        } else if(!localStorage.getItem('id_token')) {
            connection();
        } else {
            $http.post(DOMAIN_API + '/api/1/authenticate', $cookieStore.get("current_user_app-bo")).
                success(function (data, status, headers, config) {
                    localStorage.setItem('id_token', data.token);
                    loadingApp();
                }).
                error(function (data, status, headers, config) {
                    console.log(data);
                    alert(data.message);
                });
        }
        //console.log($cookieStore);
        //console.log($cookieStore.get("current_user_app-bo"));

    }

    function ConnectionController(elt, $mdDialog, $scope) {
        $scope.user = elt;
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

var DOMAIN_API = ""; //http://apero-pizza-etc.commande-online.fr";

var app = angular
    .module('starterApp', ['ngMaterial', 'ngCookies', 'ngMessages', 'textAngular', 'minicolors', 'ui.router', 'ngFileUpload', 'ui.tree', 'angular-jwt', 'main', 'customers', 'menu', 'pages', 'templates', 'categories', 'products','promotions', 'carts', 'medias', 'users', 'indexedDB', 'shops'], function($httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function(obj) {
            var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

            for(name in obj) {
                value = obj[name];

                if(value instanceof Array) {
                    for(i=0; i<value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if(value instanceof Object) {
                    for(subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if(value !== undefined && value !== null)
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };

        // Override $http service's default transformRequest
        $httpProvider.defaults.transformRequest = [function(data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];
    })
    .config(function($mdThemingProvider, $mdIconProvider, $stateProvider, $urlRouterProvider){

        $mdIconProvider
            .defaultIconSet("./assets/svg/avatars.svg", 128)
            //.iconSet("glyphicons", "./assets/svg/glyphicons.svg", 48)

            .icon("menu"       , "./assets/svg/menu.svg"        , 24)
            .icon("share"      , "./assets/svg/share.svg"       , 24)
            .icon("google_plus", "./assets/svg/google_plus.svg" , 512)
            .icon("hangouts"   , "./assets/svg/hangouts.svg"    , 512)
            .icon("twitter"    , "./assets/svg/twitter.svg"     , 512)
            .icon("phone"      , "./assets/svg/phone.svg"       , 512);

        $mdThemingProvider.theme('default')
            .primaryPalette('red', {
                'default': '700',
                'hue-1': '900',
                'hue-2': '50',
                'hue-3': 'A100'
            })
            .accentPalette('grey')
            .warnPalette('blue-grey');

        $stateProvider.state('customers', {
            url: "/cutomers",
            templateUrl: 'partials/users-list.html',
            controller: "UsersListController"
        }).state('home', {
            url: "/home",
            controller: "HomeController",
            templateUrl: 'partials/home.html'
        }).state('cart', {
            url: "/cart",
            controller: "CartsNewController",
            templateUrl: 'partials/cart.html'
        }).state('cartEdit', {
            url: "/cart/:cartId",
            controller: "CartsNewController",
            templateUrl: 'partials/cart.html'
        }).state('pages', {
            url: "/pages",
            controller: "PagesListController",
            templateUrl: 'partials/pages-list.html'
        }).state('promotions', {
            url: "/promotions",
            controller: "PromotionsListController",
            templateUrl: 'partials/promotions-list.html'
        }).state('templates', {
            url: "/templates",
            controller: "TemplatesListController",
            templateUrl: 'partials/templates-list.html'
        }).state('categories', {
            url: "/categories",
            controller: "CategoriesListController",
            templateUrl: 'partials/categories-list.html'
        }).state('products', {
            url: "/products",
            controller: "ProductsListController",
            templateUrl: 'partials/products-list.html'
        }).state('medias', {
            url: "/medias",
            controller: "MediasListController",
            templateUrl: 'partials/medias-list.html'
        }).state('shop-database', {
            url: "/shop-database",
            controller: "ShopDatabaseController",
            templateUrl: 'partials/shop-database.html'
        });
        $urlRouterProvider.otherwise('/home');
    }).config(function (minicolorsProvider) {
        angular.extend(minicolorsProvider.defaults, {
            control: 'hue',
            position: 'bottom left',
            theme: 'bootstrap'
        });
    }).config(function Config($httpProvider, jwtInterceptorProvider) {
        // Please note we're annotating the function so that the $injector works when the file is minified
        jwtInterceptorProvider.tokenGetter = [function() {
            return localStorage.getItem('id_token');
        }];

        $httpProvider.interceptors.push('jwtInterceptor');
    })
    .controller('mainController', function() {});

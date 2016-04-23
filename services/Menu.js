(function(){
    'use strict';

    angular.module('menu')
        .service('menuService', ['$q', MenuService]);

    /**
     * Users DataService
     * Uses embedded, hard-coded data model; acts asynchronously to simulate
     * remote data service call(s).
     *
     * @returns {{loadAllMainMenu: Function}}
     * @constructor
     */
    function MenuService($q){
        var mainMenu = [
            {
                name: 'Accueil',
                url: 'home',
                logo: 'home',
                subMenu: null
            },
            {
                name: 'Commande',
                url: 'cart',
                logo: 'shopping_cart',
                subMenu: null
            },
            {
                name: 'Clients',
                url: 'customers',
                logo: 'people',
                subMenu: null
            },
            {
                name: 'Informations',
                url: 'promotions',
                logo: 'share',
                subMenu: null
            },
            {
                name: 'Produits',
                url: '#',
                logo: 'class',
                subMenu: [{
                        name: 'Mes Produits',
                        url: 'products',
                        logo: 'class'
                    },
                    {
                        name: 'Mes fiches produits',
                        url: 'templates',
                        logo: 'note'
                    },
                    {
                        name: 'Mes Catégories',
                        url: 'categories',
                        logo: 'my_library_books'
                    }
                ]
            },
            {
                name: 'Pages',
                url: 'pages',
                logo: 'message',
                subMenu: null
            },
            {
                name: 'Diaporamas',
                url: 'diaporamaController',
                logo: 'view_carousel',
                subMenu: null
            },
            {
                name: 'Medias',
                url: 'medias',
                logo: 'perm_media',
                subMenu: null
            },
            {
                name: 'Configuration',
                url: '#',
                logo: 'store_mall_directory',
                subMenu: [{
                        name: 'Générales',
                        url: 'shopController',
                        logo: 'store_mall_directory'
                    },
                    {
                        name: 'Produits',
                        url: 'shopController',
                        logo: 'class'
                    },
                    {
                        name: 'Paiements',
                        url: 'shopController',
                        logo: 'payment'
                    },
                    {
                        name: 'Réseaux sociaux',
                        url: 'shopController',
                        logo: 'facebook-box'
                    },
                    {
                        name: 'Base de données',
                        url: 'shop-database',
                        logo: 'loop'
                    }
                ]
            },
            {
                name: 'Statistiques',
                url: 'statsController',
                logo: 'timeline',
                subMenu: null
            }
        ];

        // Promise-based API
        return {
            loadAllMainMenu : function() {
                // Simulate async nature of real remote calls
                return $q.when(mainMenu);
            }
        };
    }

})();

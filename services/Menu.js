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
                logo: 'glyphicons glyphicons-home',
                subMenu: null
            },
            {
                name: 'Commande',
                url: 'cart',
                logo: 'glyphicons glyphicons-shopping-cart',
                subMenu: null
            },
            {
                name: 'Clients',
                url: 'customers',
                logo: 'glyphicons glyphicons-parents',
                subMenu: null
            },
            {
                name: 'Informations',
                url: 'promotions',
                logo: 'glyphicons glyphicons-wifi-alt',
                subMenu: null
            },
            {
                name: 'Produits',
                url: '#',
                logo: 'glyphicons glyphicons-vases',
                subMenu: [{
                        name: 'Mes Produits',
                        url: 'products',
                        logo: 'glyphicons glyphicons-vases'
                    },
                    {
                        name: 'Mes fiches produits',
                        url: 'templates',
                        logo: 'glyphicons glyphicons-notes'
                    },
                    {
                        name: 'Mes Catégories',
                        url: 'categories',
                        logo: 'glyphicons glyphicons-sort'
                    }
                ]
            },
            {
                name: 'Pages',
                url: 'pages',
                logo: 'glyphicons glyphicons-edit',
                subMenu: null
            },
            {
                name: 'Diaporamas',
                url: 'diaporamaController',
                logo: 'glyphicons glyphicons-picture',
                subMenu: null
            },
            {
                name: 'Medias',
                url: 'medias',
                logo: 'glyphicons glyphicons-folder-open',
                subMenu: null
            },
            {
                name: 'Configuration',
                url: '#',
                logo: 'glyphicons glyphicons-shop-window',
                subMenu: [{
                        name: 'Générales',
                        url: 'shopController',
                        logo: 'glyphicons glyphicons-shop-window'
                    },
                    {
                        name: 'Produits',
                        url: 'shopController',
                        logo: 'glyphicons glyphicons-vases'
                    },
                    {
                        name: 'Paiements',
                        url: 'shopController',
                        logo: 'glyphicons glyphicons-money'
                    },
                    {
                        name: 'Réseaux sociaux',
                        url: 'shopController',
                        logo: 'glyphicons glyphicons-group'
                    },
                    {
                        name: 'Base de données',
                        url: 'shop-database',
                        logo: 'glyphicons glyphicons-database'
                    }
                ]
            },
            {
                name: 'Statistiques',
                url: 'statsController',
                logo: 'glyphicons glyphicons-stats',
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

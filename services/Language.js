(function(){
    'use strict';

    angular.module('main')
        .service('languageService', ['$http', languageService]);

    function languageService($http){
        var URL_API = DOMAIN_API + "/api/1/bo-management/languages";
        var languages = [];

        return {
            getLanguages: function() {
                return languages;
            },
            loadLanguages: function() {
                return $http.get(URL_API).then(function(ls) {
                    languages = ls.data;
                });
            }
        };
    }

})();


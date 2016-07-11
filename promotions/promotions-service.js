(function(){
    'use strict';

    angular.module('promotions')
        .service('promotionService', ['$http', 'Promotion', promotionService]);

    function promotionService($http, Promotion){
        var URL_API = DOMAIN_API + "/api/1/bo-management/promotions/";
        var MAX_PER_PAGE = 100;
        var MAX_TOTAL = 10000;
        var promotions = [];
        var loading = false;

        return {
            getPromotions: function() {
                return promotions;
            },
            loadPromotions: function(start) {
                loading = true;
                if(start == undefined) start = 0;
                var _this = this;

                return $http.get(URL_API + "list/"+start+"/"+MAX_PER_PAGE).then(function(data) {
                    var data = data.data;
                    for(var i = 0; i < data.length; i++) {
                        promotions.push(Promotion.build(data[i]))
                    }
                    if(data.length == MAX_PER_PAGE && promotions.length < MAX_TOTAL) {
                        _this.loadPromotions(start + MAX_PER_PAGE);
                    } else
                        loading = false;
                });
            },
            resetPromotions: function() {
                promotions = [];
                _this.loadPromotions();
            }
        };
    }

})();


(function(){
    'use strict';

    angular.module('medias')
        .service('mediaService', ['$http', 'Media', mediaService]);

    function mediaService($http, Media){
        var URL_API = DOMAIN_API + "/api/1/bo-management/medias/";
        var MAX_PER_PAGE = 100;
        var MAX_TOTAL = 10000;
        var medias = [];
        var loading = false;

        return {
            getMedias: function() {
                return medias;
            },
            loadMedias: function(start) {
                loading = true;
                if(start == undefined) start = 0;
                var _this = this;

                return $http.get(URL_API + "list/"+start+"/"+MAX_PER_PAGE).then(function(data) {
                    var data = data.data;
                    for(var i = 0; i < data.length; i++) {
                        medias.push(Media.build(data[i]))
                    }
                    if(data.length == MAX_PER_PAGE && medias.length < MAX_TOTAL) {
                        _this.loadMedias(start + MAX_PER_PAGE);
                    } else
                        loading = false;
                });
            },
            resetMedias: function() {
                medias = [];
                return this.loadMedias();
            }
        };
    }

})();


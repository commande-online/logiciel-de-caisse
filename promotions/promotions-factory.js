(function(){
    'use strict';

    angular.module('promotions', [ 'ngMaterial' ])
        .factory("Promotion", ['$http', '$filter', '$rootScope', function($http, $filter, $rootScope) {
        var URL_API = DOMAIN_API + "/api/1/bo-management/promotions/";


        function Promotion(_id, site, infos, validUntilDate, sendDate, oldPriceAmount, priceAmount, pricePercentage, priceFreeText, product, picture, status, logStatus, listUsers) {
            // Public properties, assigned to the instance ('this')
            this._id = _id;
            this.site = site;

            if(infos == undefined ||  Object.keys(infos).length == 0) {
                this.infos = {fr: {lang: "fr"}};
            }
            else
                this.infos = infos;

            this.validUntilDate = validUntilDate;
            this.sendDate = sendDate;
            this.oldPriceAmount = oldPriceAmount;
            this.priceAmount = priceAmount;
            this.pricePercentage = pricePercentage;
            this.priceFreeText = priceFreeText;
            this.product = product;
            this.picture = picture;
            this.status = status;
            this.logStatus = logStatus;
            this.listUsers = listUsers;
        }


        Promotion.prototype.setData = function(data) {
            angular.extend(this, data);
        };
        Promotion.prototype.load = function(id) {
            var scope = this;
            $http.get(URL_API + id).success(function(data) {
                scope.setData(data);
            });
        };
        Promotion.prototype.save = function (next) {
            if(this._id == undefined)
                this._id = "";

            $http.post(URL_API + this._id, this).success(function(data, status) {
                next(data);
            }).error(function(data, status) {
                $rootScope.$broadcast('errorApi', data);
            });
        };
        Promotion.prototype.delete = function(next) {
            $http.delete(URL_API + this._id).success(function(data, status) {
                next(data);
            }).error(function(data, status) {
                $rootScope.$broadcast('errorApi', data);
            });
        };
        Promotion.prototype.send = function (next) {
            if(this._id != undefined) {
                $http.post(URL_API + this._id + '/send', this).success(function (data, status) {
                    next(data);
                }).error(function (data, status) {
                    $rootScope.$broadcast('errorApi', data);
                });
            } else {
                alert("Must select a promotion to send")
            }
        };
        Promotion.build = function(data) {
            return new Promotion(data._id.$id, data.site, data.infos, data.validUntilDate, data.sendDate, data.oldPriceAmount, data.priceAmount, data.pricePercentage, data.priceFreeText, data.product, data.picture, data.status, data.logStatus, data.listUsers);
        };
        Promotion.loadAll = function(next) {
            return $http.get(URL_API + "list/").success(function(data, status) {
                var returnValue = [];

                for(var i = 0; i < data.length; i++) {
                    returnValue.push(Promotion.build(data[i]))
                }

                next(returnValue);
            });
        };

        return Promotion;
    }]);
})();

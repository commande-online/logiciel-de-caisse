(function(){
    'use strict';

    angular.module('templates', [ 'ngMaterial' ])
        .factory("Template", ['$http', '$filter', '$rootScope', function($http, $filter, $rootScope) {
            var URL_API = DOMAIN_API + "/api/1/bo-management/templates/";


            function Template(_id, site, name, labelPriceSelect, fields, products, status, logStatus, last_refresh) {
                // Public properties, assigned to the instance ('this')
                this._id = _id;
                this.site = site;
                this.name = name;
                this.labelPriceSelect = labelPriceSelect;
                this.fields = fields;
                this.products = products;
                this.status = status;
                this.logStatus = logStatus;

                if(last_refresh) {
                    this.last_refresh = last_refresh
                } else {
                    var dateUpdate = new Date();
                    this.last_refresh = dateUpdate.getTime();
                }
            }


            Template.prototype.setData = function(data) {
                if(data._id && data._id.$id) {
                    // We need to remove the $id
                    data._id = data._id.$id;
                }

                angular.extend(this, data);
            };
            Template.prototype.load = function(id) {
                var scope = this;
                $http.get(URL_API + id).success(function(data) {
                    scope.setData(data);
                }).error(function(data, status) {
                    scope._id = -1;
                    scope.error_api = data;
                    $rootScope.$broadcast('errorApi', data);
                });
            };
            Template.prototype.save = function (next) {
                if(this._id == undefined)
                    this._id = "";
                var scope = this;

                $http.post(URL_API + this._id, this).success(function(data, status) {
                    if(scope._id == "") {
                        scope._id = data._id;
                    }

                    next(data);
                }).error(function(data, status) {
                    scope._id = -1;
                    scope.error_api = data;
                    $rootScope.$broadcast('errorApi', data);
                });
            };
            Template.prototype.delete = function(next) {
                var scope = this;
                $http.delete(URL_API + this._id).success(function(data, status) {
                    if(next) next(data);
                }).error(function(data, status) {
                    scope._id = -1;
                    scope.error_api = data;
                    $rootScope.$broadcast('errorApi', data);
                });
            };
            Template.build = function(data) {
                return new Template(data._id.$id, data.site, data.name, data.labelPriceSelect, data.fields, data.products, data.status, data.logStatus, data.last_refresh);
            };
            /*
             Template.loadAll = function(next) {
             return $http.get(URL_API + "list/").success(function(data, status) {
             var returnValue = [];

             for(var i = 0; i < data.length; i++) {
             returnValue.push(Template.build(data[i]))
             }

             next(returnValue);
             });
             };
             */

            return Template;
        }]);
})();

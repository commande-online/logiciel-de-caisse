(function(){
    'use strict';

    angular.module('categories', [ 'ngMaterial' ])
        .factory("Category", ['$http', '$filter', '$rootScope', function($http, $filter, $rootScope) {
            var URL_API = DOMAIN_API + "/api/1/bo-management/categories/";

            function Category(_id, site, infos, products, ingredients, order_button_color, position, status, logStatus, last_refresh) {
                // Public properties, assigned to the instance ('this')
                this._id = _id;
                this.site = site;

                if(infos == undefined ||  Object.keys(infos).length == 0) {
                    this.infos = {fr: {lang: "fr"}};
                }
                else
                    this.infos = infos;

                this.products = products;
                this.ingredients = ingredients;
                this.order_button_color = order_button_color; //
                this.position = position;
                this.status = status;
                this.logStatus = logStatus;

                if(last_refresh) {
                    this.last_refresh = last_refresh
                } else {
                    var dateUpdate = new Date();
                    this.last_refresh = dateUpdate.getTime();
                }
            }


            Category.prototype.setData = function(data) {
                if(data._id && data._id.$id) {
                    // We need to remove the $id
                    data._id = data._id.$id;
                }

                angular.extend(this, data);
            };
            Category.prototype.load = function(id) {
                var scope = this;
                $http.get(URL_API + id).success(function(data) {
                    scope.setData(data);
                }).error(function(data, status) {
                    scope._id = -1;
                    scope.error_api = data;
                    $rootScope.$broadcast('errorApi', data);
                });
            };
            Category.prototype.save = function (next) {
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
            Category.prototype.delete = function(next) {
                var scope = this;
                $http.delete(URL_API + this._id).success(function(data, status) {
                    if(next) next(data);
                }).error(function(data, status) {
                    scope._id = -1;
                    scope.error_api = data;
                    $rootScope.$broadcast('errorApi', data);
                });
            };
            Category.prototype.getBackgroundColorStyle = function() {
                if(this.order_button_color != undefined && this.order_button_color != "") {
                    return {"background-color":  this.order_button_color};
                } else {
                    return "";
                }
            };

            Category.build = function(data) {
                if(!data._id) {
                    console.log("error in the category : ", data);
                    return null;
                }

                return new Category(data._id.$id ? data._id.$id : data._id, data.site, data.infos, data.products, data.ingredients, data.order_button_color, data.position, data.status, data.logStatus, data.last_refresh);
            };

            return Category;
        }]);
})();

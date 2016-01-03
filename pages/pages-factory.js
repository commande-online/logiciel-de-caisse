(function(){
    'use strict';

    angular.module('pages', [ 'ngMaterial' ])
        .factory("Page", ['$http', '$filter', '$rootScope', function($http, $filter, $rootScope) {
        var URL_API = DOMAIN_API + "/api/1/bo-management/pages/";

        function Page(_id, site, name, title, lang, versions, comment, tags, comments, links, status, logStatus, last_refresh) {
            // Public properties, assigned to the instance ('this')
            this._id = _id;
            this.site = site;
            this.name = name;
            this.title = title;
            this.lang = lang;
            this.versions = versions;
            this.comment = comment;
            if(tags == undefined)
                this.tags = [];
            else
                this.tags = tags;
            this.comments = comments;
            if(links == undefined)
                this.links = [];
            else
                this.links = links;

            /*this.text = function() {
                if(this.versions && this.versions.length > 0) {
                    return this.versions[this.versions.length - 1].text;
                } else
                    return "";
            };*/
            this.status = status;
            this.logStatus = logStatus;

            if(last_refresh) {
                this.last_refresh = last_refresh
            } else {
                var dateUpdate = new Date();
                this.last_refresh = dateUpdate.getTime();
            }
        }

            Page.prototype.text = function() {
                if(this.versions && this.versions.length > 0) {
                    return this.versions[this.versions.length - 1].text;
                } else
                    return "";

            };
        Page.prototype.getVersion = function() {
            if(!this.versions || this.versions.length == 0)
                return null;
            else
                return this.versions[this.versions.length - 1];
        };
        Page.prototype.setData = function(data) {
            if(data._id && data._id.$id) {
                // We need to remove the $id
                data._id = data._id.$id;
            }

            angular.extend(this, data);
        };
        Page.prototype.load = function(id) {
            var scope = this;
            $http.get(URL_API + id).success(function(data) {
                scope.setData(data);
            }).error(function(data, status) {
                scope._id = -1;
                scope.error_api = data;
                $rootScope.$broadcast('errorApi', data);
            });
        };
        Page.prototype.save = function (next) {
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
        Page.prototype.delete = function(next) {
            var scope = this;

            $http.delete(URL_API + this._id).success(function(data, status) {
                if(next) next(data);
            }).error(function(data, status) {
                scope._id = -1;
                scope.error_api = data;
                $rootScope.$broadcast('errorApi', data);
            });
        };

        Page.build = function(data) {
            return new Page(data._id.$id ? data._id.$id : data._id, data.site, data.name, data.title, data.lang, data.versions, data.comment, data.tags, data.comments, data.links, data.status, data.logStatus, data.last_refresh);
        };
        return Page;
    }]);
})();

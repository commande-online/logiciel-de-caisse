(function(){
    'use strict';

    angular.module('users', [ 'ngMaterial' ])
        .factory("User", ['$http', '$filter', '$rootScope', '$timeout', function($http, $filter, $rootScope, $timeout) {
            var URL_API = DOMAIN_API + "/api/1/bo-management/users/";
            var MAX_PER_PAGE = 50;

            function User(_id, firstname, lastname, phone, addresses, email, gender, notificationFrequency, optin_affiliate, optin_site, profilePicture, last_refresh) {
                this._id = _id;
                this.firstname = firstname;
                this.lastname = lastname;
                this.phone = phone;
                if(addresses == undefined) {
                    this.addresses = [];
                } else {
                    this.addresses = addresses;
                }
                this.email = email;
                this.gender = gender;
                if(notificationFrequency)
                    this.notificationFrequency = parseInt(notificationFrequency);
                if(optin_affiliate)
                    this.optin_affiliate = parseInt(optin_affiliate);
                if(optin_site)
                    this.optin_site = parseInt(optin_site);
                this.profilePicture = profilePicture;

                if(last_refresh) {
                    this.last_refresh = last_refresh
                } else {
                    var dateUpdate = new Date();
                    this.last_refresh = dateUpdate.getTime();
                }
            }
            User.prototype.getFullname = function() {
                var returnValue = "";
                if(this.firstname && this.lastname) {
                    return this.firstname + " " + this.lastname;
                } else if(this.firstname) {
                    return this.firstname;
                } else if(this.lastname) {
                    return this.lastname;
                } else {
                    return "";
                }
            };
            User.prototype.save = function (next) {
                if(this._id == undefined)
                    this._id = "";

                $http.post(URL_API + this._id, this).success(function(data, status) {
                    next(data);
                }).error(function(data, status) {
                    $rootScope.$broadcast('errorApi', data);
                });
            };
            User.prototype.load = function (id, next) {
                var scope = this;
                return $http.get(URL_API + id).success(function(data) {
                    scope.constructor(data);
                    if(next)
                        next(data);
                }).error(function(data, status) {
                    scope._id = -1;
                    scope.error_api = data;
                    $rootScope.$broadcast('errorApi', data);
                });
            };
            User.prototype.delete = function(next) {
                $http.delete(URL_API + this._id).success(function(data, status) {
                    next(data);
                }).error(function(data, status) {
                    $rootScope.$broadcast('errorApi', data);
                });
            };
            User.prototype.getDefaultAddress = function() {
                if(this.addresses.length == 0)
                    return null;
                var founded = false;
                var returnValue = this.addresses[0];

                for(var i = 0; i < this.addresses.length && !founded; i++) {
                    if(this.addresses[i].isDefault) {
                        founded = false;
                        returnValue = this.addresses[i];
                    }
                }

                return returnValue;
            };

            User.build = function(data) {
                return new User(data.id ? data.id : data._id, data.firstname, data.lastname, data.phone, data.addresses, data.email, data.gender, data.notificationFrequency, data.optin_affiliate, data.optin_site, data.profilePicture, data.last_refresh);
            };

            return User;
        }]);
})();

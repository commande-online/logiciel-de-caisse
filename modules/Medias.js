(function(){
    'use strict';

    angular.module('medias', [ 'ngMaterial' ])
        .factory("Media", ['$http', '$filter', '$rootScope', '$timeout', 'Page', 'Product', function($http, $filter, $rootScope, $timeout, Page, Product) {
            var URL_API = DOMAIN_API + "/api/1/bo-management/medias/";
            var MAX_PER_PAGE = 50;

        function Media(_id, site, user, type, uploadDate, infos, /*name, text,*/ url, tags, publicFlag, links, resizeds, original, widthHeightRatio, height, width, filename, length, chunkSize, md5, status, logStatus) {
            // Public properties, assigned to the instance ('this')
            this._id = _id;
            this.site = site;
            //this.name = name;
            this.user = user;
            this.type = type;
            this.status = status;
            this.logStatus = logStatus;
            this.uploadDate = uploadDate;
            //this.text = text;
            this.url = url;
            this.publicFlag = publicFlag;

            if(infos == undefined)
                this.infos = {fr: {lang: "fr"}};
            else
                this.infos = infos;

            if(tags == undefined)
                this.tags = [];
            else
                this.tags = tags;
            if(links == undefined)
                this.links = [];
            else
                this.links = links;
            if(resizeds == undefined)
                this.resizeds = [];
            else
                this.resizeds = resizeds;

            this.original = original;
            this.widthHeightRatio = widthHeightRatio;
            this.height = height;
            this.width = width;
            this.filename = filename;
            this.length = length;
            this.chunkSize = chunkSize;
            this.md5 = md5;
        }

            Media.prototype.getNameToLower = function () {
                if(this.infos.fr != undefined && this.infos.fr.name != undefined && this.infos.fr.name != null) {
                    return this.infos.fr.name.toLowerCase();
                } else
                    return "";
            };

        Media.prototype.setData = function(data) {
            angular.extend(this, data);
        };
        Media.prototype.load = function(id) {
            var scope = this;
            $http.get(URL_API + id).success(function(data) {
                scope.setData(data);
            });
        };
        Media.prototype.isPicture = function() {
            var returnValue = false;
            var ext = this.filename.split('.').pop().toLowerCase();

            if(ext == 'png' || ext == 'gif'  || ext == 'jpg' || ext == 'jpeg')
                returnValue = true;

            return returnValue;
        };
        Media.prototype.getLinkInfo = function(link) {
            var returnValue = "";
            if(link.type == "Product") {
                returnValue = "Produit : " + link.data.name + " - position : " + link.position;
            } else if(link.type == "Page") {
                returnValue = "Page : " + link.data.name + " - position : " + link.position;
            } else {
                returnValue = link.type + " - " + link.element + " - " + link.position;
            }

            return returnValue;
        };
        Media.prototype.loadLinks = function() {
            for(var i = 0; i < this.links.length; i++) {
                if(this.links[i].type == "Product") {
                    this.links[i].data = new Product();
                    this.links[i].data.loadFromField(this.links[i].element.$id);
                } else if(this.links[i].type == "Page") {
                    this.links[i].data = new Page();
                    this.links[i].data.load(this.links[i].element.$id);
                } else {
                    this.links[i].data = null;
                }
            }
        };
        Media.prototype.preview = function() {
            this.previewContent = "";
            var media = this;
            $http.get(URL_API + this._id, this).success(function(data, status) {
                media.previewContent = data.content;
            });
        };
        Media.prototype.save = function (next) {
            if(this._id == undefined)
                this._id = "";

            $http.post(URL_API + this._id, this).success(function(data, status) {
                next(data);
            }).error(function(data, status) {
                $rootScope.$broadcast('errorApi', data);
            });
        };
            Media.prototype.delete = function(next) {
            $http.delete(URL_API + this._id).success(function(data, status) {
                next(data);
            }).error(function(data, status) {
                $rootScope.$broadcast('errorApi', data);
            });
        };
            Media.prototype.addFile = function(file) {
                this.file = file;
                if(this.name == undefined) {
                    this.name = file.name;
                }
            };

            Media.build = function(data) {
            return new Media(data._id.$id, data.site, data.user, data.type, data.uploadDate, data.infos, /*data.name, data.text,*/ data.url, data.tags, data.public, data.links, data.resizeds, data.original, data.widthHeightRatio, data.height, data.width, data.filename, data.length, data.chunkSize, data.md5, data.status, data.logStatus);
        };

            Media.loadAll = function(next, start) {
                if(start == undefined) start = 0;

                return $http.get(URL_API + "list/"+start+"/"+MAX_PER_PAGE).success(function(data, status) {
                    var returnValue = [];

                    for(var i = 0; i < data.length; i++) {
                        returnValue.push(Media.build(data[i]))
                    }

                    next(returnValue, (data.length == MAX_PER_PAGE));

                    // Next
                    if(data.length == MAX_PER_PAGE) {
                        $timeout(function() {
                            Media.loadAll(next, start + MAX_PER_PAGE);
                        }, 100);

                    }
                });
            };

        return Media;
    }]);
})();

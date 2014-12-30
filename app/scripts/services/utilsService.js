'use strict';

angular.module('adminApp.services')
    .service('UtilsServ', function($resource) {

        var Industry = $resource('/api/industries', {}, {
            query: {
                method: 'GET',
                transformResponse: function(res) {
                    // console.log(res);
                    res = angular.fromJson(res);
                    return res.data;
                },
                isArray: true
            }
        });

        var Region = $resource('/api/region', {}, {
            query: {
                method: 'GET',
                transformResponse: function(res) {
                    res = angular.fromJson(res);
                    return res.data;
                },
                isArray: true
            }
        });

        this.getIndustries = function(parentId) {
            return Industry.query({parentId: parentId || 0});
        };

        this.getRegions = function(parentId) {
            parentId = parentId || 0;
            return Region.query({
                parentId: parentId
            });
        };

    });
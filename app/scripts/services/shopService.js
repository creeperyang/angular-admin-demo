'use strict';

angular.module('adminApp.services')
    .service('ShopServ', function($resource) {
        var ShopList = $resource('/merchant/list', {}, {
            query: {
                method: 'GET',
                transformResponse: function(res) {
                    res = angular.fromJson(res);
                    return res.data;
                },
                isArray: false
            }
        });

        var Shop = $resource('/merchant/:action', {}, {
            add: {
                method: 'POST',
                params: {
                    action: 'add'
                }
            },
            update: {
                method: 'POST',
                params: {
                    action: 'edit'
                }
            },
            remove: {
                method: 'POST',
                transformResponse: function(res) {
                    res = angular.fromJson(res);
                    return res;
                },
                params: {
                    action: 'delete'
                }
            },
            get: {
                method: 'GET',
                transformResponse: function(res) {
                    res = angular.fromJson(res);
                    return res.data;
                },
                params: {
                    action: 'info'
                }
            },
            tree: {
                method: 'GET',
                transformResponse: function(res) {
                    res = angular.fromJson(res);
                    return res.data;
                },
                params: {
                    action: 'tree'
                },
                isArray: true
            },
            exists: {
                method: 'GET',
                transformResponse: function(res) {
                    res = angular.fromJson(res);
                    return res;
                },
                params: {
                    action: 'existUser'
                }
            }
        });
        
        this.getList = ShopList.query;
        this.Shop = Shop;
    });
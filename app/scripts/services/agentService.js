'use strict';

angular.module('adminApp.services')
    .service('AgentServ', function($resource) {
        var AgentList = $resource('/agent/list', {}, {
            query: {
                method: 'GET',
                transformResponse: function(res) {
                    res = angular.fromJson(res);
                    return res.data;
                },
                isArray: false
            }
        });

        var Agent = $resource('/agent/:action', {}, {
            add: {
                method: 'POST',
                transformResponse: function(res) {
                    res = angular.fromJson(res);
                    return res;
                },
                params: {
                    action: 'add'
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
            update: {
                method: 'POST',
                params: {
                    action: 'edit'
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
        
        this.getList = AgentList.query;
        this.Agent = Agent;
    });
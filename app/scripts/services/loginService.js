'use strict';

angular.module('adminApp.services')
    .service('LoginServ', function($resource) {

        var User = $resource('/account/:action/', {}, {
            login: {
                method: 'POST',
                transformResponse: function(res) {
                    res = angular.fromJson(res);
                    return res;
                },
                params: {
                    action: 'login'
                }
            },
            logout: {
                method: 'POST',
                transformResponse: function(res) {
                    res = angular.fromJson(res);
                    return res;
                },
                params: {
                    action: 'logout'
                }
            }
        });
        
        this.User = User;
    });
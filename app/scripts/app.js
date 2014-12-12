'use strict';

/**
 * @ngdoc overview
 * @name yoApp
 * @description
 * # adminApp
 *
 * Main module of the application.
 */
angular
    .module('adminApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ui.bootstrap'
    ])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/index.html',
                controller: 'IndexCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });

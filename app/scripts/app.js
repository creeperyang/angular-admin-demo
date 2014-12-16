'use strict';

/**
 * @ngdoc overview
 * @name yoApp
 * @description
 * # adminApp
 *
 * Main module of the application.
 */

// create a module for all services to register
angular.module('adminApp.services', []);

// create a module for all controllers to register
angular.module('adminApp.controllers', []);

// create a module for all directives to register
angular.module('adminApp.directives', ['adminApp.services']);

angular
    .module('adminApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ui.bootstrap',
        'adminApp.services',
        'adminApp.directives',
        'adminApp.controllers'
    ])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/index.html',
                controller: 'IndexCtrl'
            })
            .when('/Data/passenger', {
                templateUrl: 'views/data/passenger.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    });

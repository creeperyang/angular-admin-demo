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
        'ngTable',
        'ui.bootstrap',
        'pascalprecht.translate', // i18n dependency
        'adminApp.services',
        'adminApp.directives',
        'adminApp.controllers'
    ])
    .config(['$routeProvider', '$translateProvider', function($routeProvider, $translateProvider) {
        // route
        $routeProvider
            .when('/', {
                templateUrl: 'views/index.html',
                controller: 'IndexCtrl'
            })
            // .when('/login', {
            //     templateUrl: 'views/login.html',
            //     controller: 'LoginCtrl'
            // })
            .when('/data/passenger', {
                templateUrl: 'views/data/passenger.html'
            })
            .when('/data/ad', {
                templateUrl: 'views/data/ad.html',
                controller: 'AdPageCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });

        // i18n
        $translateProvider
            .useStaticFilesLoader({
                prefix: '/languages/',
                suffix: '.json'
            })
            .preferredLanguage('zhCN');
    }]);

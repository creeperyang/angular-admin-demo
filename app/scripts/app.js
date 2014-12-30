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

// create a module for all filters to register
angular.module('adminApp.filters', []);

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
        'ngMessages',
        'cyTable',
        'cyTree',
        'ui.bootstrap',
        'pascalprecht.translate', // i18n dependency
        'adminApp.services',
        'adminApp.directives',
        'adminApp.controllers',
        'adminApp.filters'
    ])
    .config(['$routeProvider', '$translateProvider', function($routeProvider, $translateProvider) {
        // route
        $routeProvider
            .when('/login', {
                template: ' ', // fake template
                controller: 'LoginCtrl',
                data: {
                    loginPage: true
                }
            })
            .when('/:aid', {
                templateUrl: 'views/index.html',
                controller: 'IndexCtrl'
            })
            .when('/:aid/agent/list', {
                templateUrl: 'views/agent/list.html',
                controller: 'AgentListCtrl',
                data: {
                    status: 'listAgent'
                }
            })
            .when('/:aid/agent/add', {
                templateUrl: 'views/agent/add.html',
                controller: 'AgentCtrl',
                data: {
                    status: 'addAgent'
                }
            })
            .when('/:aid/agent/edit/:said', {
                templateUrl: 'views/agent/add.html',
                controller: 'AgentCtrl',
                data: {
                    status: 'editAgent'
                }
            })
            // shop management
            .when('/:aid/shop/list', {
                templateUrl: 'views/shop/list.html',
                controller: 'ShopListCtrl',
                data: {
                    status: 'listShop'
                }
            })
            .when('/:aid/shop/add', {
                templateUrl: 'views/shop/add.html',
                controller: 'ShopCtrl',
                data: {
                    status: 'addShop'
                }
            })
            .when('/:aid/shop/edit/:mid', {
                templateUrl: 'views/shop/add.html',
                controller: 'ShopCtrl',
                data: {
                    status: 'editShop'
                }
            })
            .otherwise({
                redirectTo: '/login'
            });

        // i18n
        $translateProvider
            .useStaticFilesLoader({
                prefix: '/languages/',
                suffix: '.json'
            })
            .preferredLanguage('zhCN');
    }])
    // handle 401
    .factory('authHttpResponseInterceptor',['$q','$location',function($q,$location){
        return {
            response: function(response){
                if (response.status === 401) {
                    console.log("Response 401");
                }
                return response || $q.when(response);
            },
            responseError: function(rejection) {
                if (rejection.status === 401) {
                    console.log("Response Error 401",rejection);
                    $location.path('/login').search('next', $location.path());
                }
                if(rejection.status === 500) {
                    console.log(500, rejection)
                }
                return $q.reject(rejection);
            }
        }
    }])
    .config(['$httpProvider',function($httpProvider) {
        //Http Intercpetor to check auth failures for xhr requests
        $httpProvider.interceptors.push('authHttpResponseInterceptor');
    }])
    .run(function($rootScope, $routeParams, $route, $cookies) {

        $rootScope.$watch('aid', function(aid) {
            $rootScope.menuData = [{
                icon: 'fa fa-heart',
                text: 'HomePage',
                path: '/' + aid
            }, {
                icon: 'fa fa-users',
                text: 'SubAgentManagement',
                active: false,
                list: [{
                    text: 'SubAgentList',
                    path: '/' + aid + '/agent/list'
                }, {
                    text: 'CreateSubAgent',
                    path: '/' + aid + '/agent/add',
                }]
            }, {
                icon: 'fa fa-university',
                text: 'ShopManagement',
                path: '/shop',
                active: false,
                list: [{
                    text: 'ShopList',
                    path: '/' + aid + '/shop/list'
                }, {
                    text: 'CreateShop',
                    path: '/' + aid + '/shop/add',
                }]
            }];
        });

        $rootScope.authInfo = {
            csrf: $cookies.csrftoken
        };

        $rootScope.$on("$routeChangeStart", function(event, next, current) {
            console.log(next)
            $rootScope.aid = next.params.aid || $rootScope.aid;
            $rootScope.said = next.params.said || $rootScope.said;
            $rootScope.mid = next.params.mid || $rootScope.mid;
            $rootScope.curRouteData = next.data;
            if(next.data && next.data.loginPage) {
                $rootScope.showLoginPage = true;
            } else {
                $rootScope.showLoginPage = false;
            }
            /*if(next.requireLogin) {
                // Auth/session check here
                event.preventDefault();
            }*/
        });

    });

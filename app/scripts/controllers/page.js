'use strict';

angular.module('adminApp.controllers') // created in app.js
    .controller('PageCtrl', ['$routeParams', '$scope', '$rootScope', '$window', '$location',// page change
        function($routeParams, $scope, $rootScope, $window, $location) {
            $scope.slide = '';

            $rootScope.back = function() {
                $scope.slide = 'slide-out';
                $window.history.back();
            };
            $rootScope.go = function(path) {
                $scope.slide = 'slide-in';
                $location.url(path);
            };
        }
    ]);
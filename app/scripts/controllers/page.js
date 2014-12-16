'use strict';

angular.module('adminApp.controllers') // created in app.js
    .controller('pageCtrl', ['$scope', '$rootScope', '$window', '$location',// page change
        function($scope, $rootScope, $window, $location) {
            $scope.slide = '';
            $rootScope.back = function() {
                console.log("back")
                $scope.slide = 'slide-right';
                $window.history.back();
            }
            $rootScope.go = function(path) {
                console.log('go')
                console.log(path)
                $scope.slide = 'slide-left';
                $location.url(path);
            }
        }
    ]);
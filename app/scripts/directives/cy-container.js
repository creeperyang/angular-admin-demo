'use strict';

// cy-menu
angular.module('adminApp.directives')
    .directive('cyContainer', ['$rootScope', '$location', 'RecursionHelper', function($rootScope, $location, RecursionHelper) {

        return {
            restrict: 'E',
            templateUrl: 'views/component/cy-container.html',
            replace: true,
            transclude: true,
            scope: {
                title: '@',
                subtitle: '@'
            },
            link: function() {

            }
        }
        
    }]);

'use strict';

// cy-menu
angular.module('adminApp.directives')
    .directive('cyControl', ['$compile', function($compile) {
        
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            templateUrl: '/views/component/cy-form-control.html',
            scope: {
                labelText: '@cyControlLabelText',
                required: '@cyControlRequired'
            },
            link: function(scope, element, attrs) {
            }
        }
    }]);
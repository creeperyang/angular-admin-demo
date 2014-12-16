'use strict';

// cy-menu
angular.module('adminApp.directives')
    .directive('cyMenu', ['RecursionHelper', function(RecursionHelper) {

        function postLink(scope, iElement, iAttrs, ctrl) {
            var list = scope.list;
            scope.toggleMenu = function(index, item) {
                var active = item.active,
                    itemList = item.list;
                if(active) {
                    if(list) { // has child, act as container
                        item.active = false;
                    }
                    return;
                } else { // remove all other active
                    angular.forEach(list, function(value, key) {
                        console.log(value, key)
                        value.active = false;
                    });
                }
                item.active = true;
            };
            scope.collapse = function() {

            }
        };

        return {
            restrict: 'EA',
            templateUrl: 'views/component/cy-menu.html',
            replace: true,
            transclude: false,
            require: '?^cyMenu',
            controller: ['$scope', function MenuCtrl(scope) {
                this.getList = function() {
                    return scope.list;
                }
            }],
            scope: {
                list: '=',
                isSubmenu: '@'
            },
            compile: function(tElement) {
                return RecursionHelper.compile(tElement, postLink);
            }
        }
    }]);

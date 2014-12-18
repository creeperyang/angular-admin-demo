'use strict';

// cy-menu
angular.module('adminApp.directives')
    .directive('cyMenu', ['$rootScope', '$location', 'RecursionHelper', function($rootScope, $location, RecursionHelper) {

        function postLink(scope, iElement, iAttrs, ctrl) {
            if(ctrl) {
                scope.parentMenuScope = ctrl.getScope();
            }

            var root = scopeUp(scope),
                scopeList = scope.list,
                currentPath = $location.url(),
                length;
            if(!scopeList || !scopeList.length) return; // do nothing

            length = scopeList.length;
            scope.$on('$routeChangeSuccess', function(ev) {
                currentPath = $location.url();
            });
            scope.handleMenuClick = function(index, item) {
                var list = item.list,
                    hasChild = list && list.length;
                if(hasChild) { // collapse or expand
                    item.isExpanded = !item.isExpanded;
                } else { 
                    collapse(index, scope);
                    $rootScope.go(item.path);
                }
            };
            scope.isActive = function(index, item, isSubmenu) {
                var active = currentPath === item.path;
                item.active = active;
                return active;
            };
        };

        function collapse(index, scope) {
            var list = scope.list,
                len, item,
                i = 0;
            if(!list) return;
            len = list.length;
            for(; i < len; i++) {
                item = list[i];
                if(i === index) {
                    item.list && (item.isExpanded = !item.isExpanded);
                } else {
                    item.isExpanded = false;
                }
            }
        }

        function scopeUp(scope) {
            var ps = scope.parentMenuScope;
            if(ps) {
                return scopeUp(ps);
            }
            return scope;
        };

        return {
            restrict: 'EA',
            templateUrl: 'views/component/cy-menu.html',
            replace: true,
            transclude: false,
            require: '?^^cyMenu', // optional parent ctrl
            controller: ['$scope', function MenuCtrl($scope) {
                this.getList = function() {
                    return $scope.list;
                };
                this.getScope = function() {
                    return $scope;
                };
            }],
            scope: {
                list: '=',
                isSubmenu: '@',
                isExpanded: '@'
            },
            compile: function(tElement) {
                return RecursionHelper.compile(tElement, postLink);
            }
        }
    }]);

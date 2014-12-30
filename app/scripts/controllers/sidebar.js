'use strict';

angular.module('adminApp.controllers')
    .controller('SidebarCtrl', function($rootScope, $scope, $modal, LoginServ, AgentServ, LocalStorageServ) {

        var Agent = AgentServ.Agent,
            User = LoginServ.User;
        var sessionApi = LocalStorageServ.sessionStorage;
        $scope.$watch('aid', function(aid) {
            if(!aid) return;
            $scope.agent = AgentServ.Agent.get({
                id: aid
            });
        });
        $scope.$watch('authInfo.userName', function(name) {
            if(!name) {
                $scope.authInfo.userName = sessionApi.get('authInfo').userName;
            }
        });

        $scope.logout = function() {
            User.logout({
                    csrfmiddlewaretoken: $scope.authInfo.csrf
                }).$promise.then(function(res) {
                    if(res.status === 1000) {
                        sessionApi.clear();
                        alert('Logut, ' + $scope.authInfo.userName);
                        $scope.go('/login');
                    }
                });
        };

        $scope.open = function(size) {

            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    items: function() {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });

        };

    })
    .controller('ModalInstanceCtrl', function($scope, $modalInstance, items) {

        $scope.items = items;
        $scope.selected = {
            item: $scope.items[0]
        };

        $scope.ok = function() {
            $modalInstance.close($scope.selected.item);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

    });

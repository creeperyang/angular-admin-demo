'use strict';

angular.module('adminApp.controllers')
    .controller('SidebarCtrl', function($scope, $modal, $log) {

        $scope.menuData = [{
            icon: 'fa fa-heart',
            text: 'home',
            path: '/'
        }, {
            icon: 'fa fa-heart',
            text: 'settings',
            path: '/settings'
        }, {
            icon: 'fa fa-heart',
            text: 'data',
            path: '/data',
            active: false,
            list: [{
                text: '客流报表',
                path: '/data/passenger'
            }, {
                text: '广告报表',
                path: '/data/ad',
            }, {
                text: '下载报表',
                path: '/data/download'
            }]
        }];
        $scope.items = ['item1', 'item2', 'item3'];

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

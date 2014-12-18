'use strict';

angular.module('adminApp.controllers')
    .controller('LoginCtrl', ['$scope', '$modal', '$log',
        function($scope, $modal, $log) {
            $scope.open = function(size) {

                var modalInstance = $modal.open({
                    templateUrl: 'views/login.html',
                    controller: 'ModalInstanceCtrl2',
                    size: size,
                    resolve: {
                        items: function() {
                            return $scope.items;
                        }
                    }
                });

                modalInstance.result.then(function(msg) {
                    $log.info(msg);
                }, function() {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
        }
    ])
    .controller('ModalInstanceCtrl2', function($scope, $modalInstance, items) {

        $scope.ok = function() {
            $modalInstance.close("I'm close");
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    });

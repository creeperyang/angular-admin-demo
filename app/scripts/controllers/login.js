'use strict';

angular.module('adminApp.controllers')
    .controller('LoginCtrl', ['$scope', '$rootScope', 'LoginServ', 'LocalStorageServ',
        function($scope, $rootScope, LoginServ, LocalStorageServ) {
            
            var sessionApi = LocalStorageServ.sessionStorage;
            $scope.loginForm = {};
            $scope.user = {
                csrfmiddlewaretoken: $scope.authInfo.csrf
            };
            $scope.login = function() {
                LoginServ.User.login($scope.user)
                    .$promise.then(function(res) {
                        console.log(res);
                        if(res.status === 1000) {
                            $scope.authInfo.userName = $scope.user.username;
                            $scope.authInfo.userType = res.data.type;
                            alert('Welcome ' + $scope.authInfo.userName);
                            if($scope.authInfo.userType === 'agent') {
                                $scope.authInfo.agentId = res.data.id;
                                sessionApi.set('authInfo', $scope.authInfo);
                                $scope.go('/' +  res.data.id + '/agent/list');
                            } else {
                                alert('You are not agent manager!');
                            }
                        }
                    });
            };
            
        }
    ]);

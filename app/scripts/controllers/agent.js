'use strict';

angular.module('adminApp.controllers') // created in app.js
    .controller('AgentListCtrl', ['$rootScope', '$scope', 'cyTableParams', 'AgentServ', 
        function($rootScope, $scope, cyTableParams, AgentServ) {

            var id = $rootScope.aid || 0;
            $scope.tableParams = new cyTableParams({
                page: 1, // show page 1
                count: 10 // 2 items per page
            }, {
                debugMode: false,
                getData: function($defer, params) {
                    var page = params.page(),
                        count = params.count(),
                        pageIndex = page - 1,
                        searching = params.searching(),
                        query = {
                            start: pageIndex * count,
                            length: count,
                            id: id
                        };
                    if(searching) {
                        query.key = params.searchKey();
                        query.value = params.searchValue();
                    }
                    AgentServ.getList(query)
                        .$promise.then(function(res) {
                            $defer.resolve(res);
                        });
                }
            });

        }
    ])
    .controller('AgentCtrl', ['$timeout', '$rootScope', '$q', '$scope', 'UtilsServ', 'AgentServ',
        function($timeout, $rootScope, $q, $scope, UtilsServ, AgentServ) {

            var Agent = AgentServ.Agent,
                promise,
                id, agentDetail,
                method;

            $scope.status = $rootScope.curRouteData.status;
            $scope.countries = [{
                id: 0,
                name: '中国',
                level: 0
            }];

            if($scope.status === 'editAgent') {
                promise = Agent.get({id: +$rootScope.said}).$promise;
                $scope.showUserInfo = false; // forbidden edit
                method = 'update';
            } else {
                $scope.showUserInfo = true;
                method = 'add';
                promise = $q(function(resolve, reject) {
                    resolve({
                        createSubAgent: 1,
                        commonRom: 1,
                        configShopRom: 0,
                        guidePage: 0,
                        navPage: 0,
                        contentPage: 0,
                        merchantDetail: 0,
                        connInternet: 0,
                        country: $scope.countries[0].id
                    });
                });

                // debounce test name duplicated: 300ms
                $scope.$watch('userInfo.name', function(name) {
                    var duplicated = false;
                    if(angular.isUndefined(name)) {
                        return setDuplicated(false);
                    }
                    Agent.exists({name: name}).$promise.then(function(res) {
                        if(res.status === 1001) {
                            setDuplicated(true);
                        } else {
                            setDuplicated(false);
                        }
                    });
                });
            }
            // user name duplicated
            function setDuplicated(flag) {
                if($scope.forms.userInfoForm) {
                    $scope.forms.userInfoForm.name.$setValidity('duplicate', !flag);
                }
            }

            promise.then(function(data) {
                $scope.userInfo = {};
                $scope.agentInfo = {
                    name: data.agentName,
                    industry: +data.industry, // number
                    country: +data.country,
                    address: data.address,
                    manager: data.manager,
                    telphone: data.telphone
                };
                if(data.province !== undefined) {
                    $scope.agentInfo.province = +data.province;
                }
                if(data.city !== undefined) {
                    $scope.agentInfo.city = +data.city;
                }
                if(data.district !== undefined) {
                    $scope.agentInfo.district = +data.district;
                }
                $scope.permission = {
                    createSubAgent: data.createSubAgent,
                    commonRom: data.commonRom,
                    configShopRom: data.configShopRom,
                    guidePage: data.guidePage,
                    navPage: data.navPage,
                    contentPage: data.contentPage,
                    merchantDetail: data.merchantDetail,
                    connInternet: data.connInternet
                };

                $scope.industries = UtilsServ.getIndustries();

                $scope.provinces = UtilsServ.getRegions($scope.agentInfo.country.id);
            });

            $scope.$watch('agentInfo.province', function(province) {
                if(angular.isUndefined(province)) {
                    $scope.cities = [];
                    return;
                }
                $scope.districts = [];
                $scope.cities = UtilsServ.getRegions(province);
            });

            $scope.$watch('agentInfo.city', function(city) {
                if(angular.isUndefined(city)) {
                    $scope.districts = [];
                    return;
                }
                $scope.districts = UtilsServ.getRegions(city);
            });

            $scope.save = function() {
                var data = angular.extend({
                    userName: $scope.userInfo.name,
                    agentName: $scope.agentInfo.name
                }, $scope.userInfo, $scope.agentInfo, $scope.permission);
                delete data.name;

                if(method === 'add') { // add agent
                    data.parentId = +$rootScope.aid;
                } else if(method === 'update') {
                    data.agentId = +$rootScope.said;
                }
                Agent[method]({}, data).$promise.then(function(res) {
                    console.log(res);
                    if(res.status === 1000) {
                        alert('Success!');
                        $timeout(function() {
                            $rootScope.go('/' + $rootScope.aid + '/agent/list');
                        }, 1000);
                    }
                });
                console.log(data);
            };

            $scope.remove = function() {
                var agentId = +$rootScope.said;
                console.log(agentId, $scope.agentInfo)
                Agent.remove({
                    agentId: agentId
                }).$promise.then(function(res) {
                    console.log(res);
                    if(res.status === 1000) {
                        alert('Delete Success!');
                        $timeout(function() {
                            $rootScope.go('/' + $rootScope.aid + '/agent/list');
                        }, 1000);
                    }
                });
            };

        }
    ]);

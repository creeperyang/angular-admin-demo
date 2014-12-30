'use strict';

angular.module('adminApp.controllers') // created in app.js
    .controller('ShopListCtrl', ['$rootScope', '$scope', 'cyTableParams', 'ShopServ', 
        function($rootScope, $scope, cyTableParams, ShopServ) {

            $scope.tableParams = new cyTableParams({
                page: 1, // show page 1
                count: 10 // 10 items per page
            }, {
                debugMode: false,
                getDataSource: function($defer, params) {
                    var query = {
                            agentId: $rootScope.aid
                        };
                    ShopServ.Shop.tree(query)
                        .$promise.then(function(res) {
                            res = res.slice(0);
                            setAllShopsSelected(res, 'list', true);
                            console.log('getDataSource', res);
                            $defer.resolve(res);
                        });
                },
                getData: function($defer, params) {
                    var page = params.page(),
                        count = params.count(),
                        pageIndex = page - 1,
                        searching = params.searching(),
                        sourceList = params.sourceList,
                        selectedSourceList = [],
                        query = {
                            start: pageIndex * count,
                            length: count,
                            list: null
                        };
                    // 设置数据源，为空时取全部
                    getShopList(sourceList, 'list', 'shop', selectedSourceList);
                    
                    if(selectedSourceList && selectedSourceList.length) {
                        query.list = [];
                        angular.forEach(selectedSourceList, function(value, key) {
                            query.list.push(value.id);
                        });
                    } else {
                        return $defer.resolve({
                            list: [],
                            total: 0
                        });
                    }
                    if(searching) {
                        query.key = params.searchKey();
                        query.value = params.searchValue();
                    } 
                    ShopServ.getList(query)
                        .$promise.then(function(res) {
                            $defer.resolve(res);
                        });
                }
            });

            function getShopList(array, childId, shopFlag, list) {
                var i,
                    len,
                    childs,
                    obj;
                if(!array) return;
                for(i = 0, len = array.length; i < len; i++) {
                    obj = array[i];
                    if(obj.flag === shopFlag && obj.selected) {
                        list.push(obj);
                    }
                    childs = obj[childId];
                    if(childs && childs.length) {
                        getShopList(childs, childId, shopFlag, list);
                    }
                }
            }

            function setAllShopsSelected(array, childId, isSelected) {
                var i,
                    len,
                    childs,
                    obj;
                for(i = 0, len = array.length; i < len; i++) {
                    obj = array[i];
                    obj.selected = isSelected;
                    childs = obj[childId];
                    if(childs && childs.length) {
                        setAllShopsSelected(childs, childId, isSelected);
                    }
                }
            }

        }
    ])
    .controller('ShopCtrl', ['$timeout', '$rootScope', '$q', '$scope', 'UtilsServ', 'ShopServ',
        function($timeout, $rootScope, $q, $scope, UtilsServ, ShopServ) {

            var Shop = ShopServ.Shop,
                promise,
                id,
                method;

            $scope.status = $rootScope.curRouteData.status;
            $scope.countries = [{
                id: 0,
                name: '中国',
                level: 0
            }];

            if($scope.status === 'editShop') {
                promise = Shop.get({id: +$rootScope.mid}).$promise;
                $scope.showUserInfo = false; // forbidden edit
                method = 'update';
            } else {
                $scope.showUserInfo = true;
                method = 'add';
                promise = $q(function(resolve, reject) {
                    resolve({
                        country: $scope.countries[0].id
                    });
                });

                // debounce test name duplicated: 300ms
                $scope.$watch('userInfo.name', function(name) {
                    var duplicated = false;
                    if(angular.isUndefined(name)) {
                        return setDuplicated(false);
                    }
                    Shop.exists({name: name}).$promise.then(function(res) {
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
                $scope.shopInfo = {
                    name: data.merchantName,
                    industry: +data.industry, // number
                    country: +data.country,
                    address: data.address,
                    manager: data.manager,
                    telphone: data.telphone
                };
                if(data.province !== undefined) {
                    $scope.shopInfo.province = +data.province;
                }
                if(data.city !== undefined) {
                    $scope.shopInfo.city = +data.city;
                }
                if(data.district !== undefined) {
                    $scope.shopInfo.district = +data.district;
                }
                $scope.industries = UtilsServ.getIndustries();

                $scope.provinces = UtilsServ.getRegions($scope.shopInfo.country.id);
            });

            $scope.$watch('shopInfo.province', function(province) {
                if(angular.isUndefined(province)) {
                    $scope.cities = [];
                    return;
                }
                $scope.districts = [];
                $scope.cities = UtilsServ.getRegions(province);
            });

            $scope.$watch('shopInfo.city', function(city) {
                if(angular.isUndefined(city)) {
                    $scope.districts = [];
                    return;
                }
                $scope.districts = UtilsServ.getRegions(city);
            });

            $scope.save = function() {
                console.log('save', $scope);

                var data = angular.extend({
                    userName: $scope.userInfo.name,
                    merchantName: $scope.shopInfo.name
                }, $scope.userInfo, $scope.shopInfo);
                delete data.name;

                if(method === 'add') { // add shop
                    data.parentId = +$rootScope.aid;
                    delete data.repeatPassword;
                } else if(method === 'update') {
                    data.merchantId = +$rootScope.mid;
                }
                Shop[method]({}, data).$promise.then(function(res) {
                    console.log(res);
                    if(res.status === 1000) {
                        alert('Success!');
                        $timeout(function() {
                            $rootScope.go('/' + $rootScope.aid + '/shop/list');
                        }, 1000);
                    }
                });
                console.log(data);
                
            };

            $scope.remove = function() {
                var merchantId = +$rootScope.mid;
                console.log(merchantId, $scope.shopInfo)
                Shop.remove({
                    merchantId: merchantId
                }).$promise.then(function(res) {
                    console.log(res);
                    if(res.status === 1000) {
                        alert('Delete Success!');
                        $timeout(function() {
                            $rootScope.go('/' + $rootScope.aid + '/shop/list');
                        }, 1000);
                    }
                });
            };

        }
    ]);

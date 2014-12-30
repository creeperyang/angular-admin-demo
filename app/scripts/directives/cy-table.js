(function(angular, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['angular'], function(angular) {
            return factory(angular);
        });
    } else {
        return factory(angular);
    }
}(angular || null, function(angular) {
    'use strict'

var app = angular.module('cyTable', []);

/**
 * @ngdoc service
 * @name cyTable.factory:cyTableParams
 * @description Parameters manager for cyTable
 */
app.factory('cyTableParams', ['$q', '$log', function ($q, $log) {
    var isNumber = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };
    var cyTableParams = function (baseParameters, baseSettings) {
        var self = this,
            log = function () {
                if (settings.debugMode && $log.debug) {
                    $log.debug.apply(this, arguments);
                }
            };

        this.data = [];
        this.sourceList = [];

        /**
         * @ngdoc method
         * @name cyTable.factory:cyTableParams#parameters
         * @methodOf cyTable.factory:cyTableParams
         * @description Set new parameters or get current parameters
         *
         * @param {string} newParameters      New parameters
         * @param {string} parseParamsFromUrl Flag if parse parameters like in url
         * @returns {Object} Current parameters or `this`
         */
        this.parameters = function (newParameters, parseParamsFromUrl) {
            parseParamsFromUrl = parseParamsFromUrl || false;
            if (angular.isDefined(newParameters)) {
                for (var key in newParameters) {
                    var value = newParameters[key];
                    if (parseParamsFromUrl && key.indexOf('[') >= 0) {
                        var keys = key.split(/\[(.*)\]/).reverse()
                        var lastKey = '';
                        for (var i = 0, len = keys.length; i < len; i++) {
                            var name = keys[i];
                            if (name !== '') {
                                var v = value;
                                value = {};
                                value[lastKey = name] = (isNumber(v) ? parseFloat(v) : v);
                            }
                        }
                        if (lastKey === 'sorting') {
                            params[lastKey] = {};
                        }
                        params[lastKey] = angular.extend(params[lastKey] || {}, value[lastKey]);
                    } else {
                        params[key] = (isNumber(newParameters[key]) ? parseFloat(newParameters[key]) : newParameters[key]);
                    }
                }
                log('cyTable: set parameters', params);
                return this;
            }
            return params;
        };

        /**
         * @ngdoc method
         * @name cyTable.factory:cyTableParams#settings
         * @methodOf cyTable.factory:cyTableParams
         * @description Set new settings for table
         *
         * @param {string} newSettings New settings or undefined
         * @returns {Object} Current settings or `this`
         */
        this.settings = function (newSettings) {
            if (angular.isDefined(newSettings)) {
                if (angular.isArray(newSettings.data)) {
                    //auto-set the total from passed in data
                    newSettings.total = newSettings.data.length;
                }
                settings = angular.extend(settings, newSettings);
                log('cyTable: set settings', settings);
                return this;
            }
            return settings;
        };

        /**
         * @ngdoc method
         * @name cyTable.factory:cyTableParams#page
         * @methodOf cyTable.factory:cyTableParams
         * @description If parameter page not set return current page else set current page
         *
         * @param {string} page Page number
         * @returns {Object|Number} Current page or `this`
         */
        this.page = function (page) {
            return angular.isDefined(page) ? this.parameters({'page': page}) : params.page;
        };

        /**
         * @ngdoc method
         * @name cyTable.factory:cyTableParams#total
         * @methodOf cyTable.factory:cyTableParams
         * @description If parameter total not set return current quantity else set quantity
         *
         * @param {string} total Total quantity of items
         * @returns {Object|Number} Current page or `this`
         */
        this.total = function (total) {
            return angular.isDefined(total) ? this.settings({'total': total}) : settings.total;
        };

        /**
         * @ngdoc method
         * @name cyTable.factory:cyTableParams#count
         * @methodOf cyTable.factory:cyTableParams
         * @description If parameter count not set return current count per page else set count per page
         *
         * @param {string} count Count per number
         * @returns {Object|Number} Count per page or `this`
         */
        this.count = function (count) {
            // reset to first page because can be blank page
            return angular.isDefined(count) ? this.parameters({'count': count, 'page': 1}) : params.count;
        };

        /**
         * @ngdoc method
         * @name cyTable.factory:cyTableParams#filter
         * @methodOf cyTable.factory:cyTableParams
         * @description If parameter page not set return current filter else set current filter
         *
         * @param {string} filter New filter
         * @returns {Object} Current filter or `this`
         */
        this.filter = function (filter) {
            return angular.isDefined(filter) ? this.parameters({'filter': filter}) : params.filter;
        };

        /**
         * @ngdoc method
         * @name cyTable.factory:cyTableParams#search
         * @methodOf cyTable.factory:cyTableParams
         * @description If parameter page not set return current search else set current search
         *
         * @param {string} search New search
         * @returns {Object} Current search or `this`
         */
        this.searchKey = function (searchKey) {
            return angular.isDefined(searchKey) ? this.parameters({'searchKey': searchKey}) : params.searchKey;
        };

        this.searchValue = function (searchValue) {
            return angular.isDefined(searchValue) ? this.parameters({'searchValue': searchValue}) : params.searchValue;
        };
        // if set to true, getData is searching other than listing
        this.searching = function (searching) {
            return angular.isDefined(searching) ? this.parameters({'searching': searching}) : params.searching;
        };

        /**
         * @ngdoc method
         * @name cyTable.factory:cyTableParams#sorting
         * @methodOf cyTable.factory:cyTableParams
         * @description If 'sorting' parameter is not set, return current sorting. Otherwise set current sorting.
         *
         * @param {string} sorting New sorting
         * @returns {Object} Current sorting or `this`
         */
        this.sorting = function (sorting) {
            if (arguments.length == 2) {
                var sortArray = {};
                sortArray[sorting] = arguments[1];
                this.parameters({'sorting': sortArray});
                return this;
            }
            return angular.isDefined(sorting) ? this.parameters({'sorting': sorting}) : params.sorting;
        };

        /**
         * @ngdoc method
         * @name cyTable.factory:cyTableParams#isSortBy
         * @methodOf cyTable.factory:cyTableParams
         * @description Checks sort field
         *
         * @param {string} field     Field name
         * @param {string} direction Direction of sorting 'asc' or 'desc'
         * @returns {Array} Return true if field sorted by direction
         */
        this.isSortBy = function (field, direction) {
            return angular.isDefined(params.sorting[field]) && params.sorting[field] == direction;
        };

        /**
         * @ngdoc method
         * @name cyTable.factory:cyTableParams#orderBy
         * @methodOf cyTable.factory:cyTableParams
         * @description Return object of sorting parameters for angular filter
         *
         * @returns {Array} Array like: [ '-name', '+age' ]
         */
        this.orderBy = function () {
            var sorting = [];
            for (var column in params.sorting) {
                sorting.push((params.sorting[column] === "asc" ? "+" : "-") + column);
            }
            return sorting;
        };

        /**
         * @ngdoc method
         * @name cyTable.factory:cyTableParams#getData
         * @methodOf cyTable.factory:cyTableParams
         * @description Called when updated some of parameters for get new data
         *
         * @param {Object} $defer promise object
         * @param {Object} params New parameters
         */
        this.getData = function ($defer, params) {
            if (angular.isArray(this.data) && angular.isObject(params)) {
                $defer.resolve({
                    list: this.data.slice((params.page() - 1) * params.count(), params.page() * params.count())
                });
            } else {
                $defer.resolve({
                    list: [],
                    total: 0
                });
            }
        };

        /**
         * @ngdoc method
         * @name cyTable.factory:cyTableParams#getGroups
         * @methodOf cyTable.factory:cyTableParams
         * @description Return groups for table grouping
         */
        this.getGroups = function ($defer, column) {
            var defer = $q.defer();

            defer.promise.then(function (data) {
                var groups = {};
                angular.forEach(data, function (item) {
                    var groupName = angular.isFunction(column) ? column(item) : item[column];

                    groups[groupName] = groups[groupName] || {
                        data: []
                    };
                    groups[groupName]['value'] = groupName;
                    groups[groupName].data.push(item);
                });
                var result = [];
                for (var i in groups) {
                    result.push(groups[i]);
                }
                log('cyTable: refresh groups', result);
                $defer.resolve(result);
            });
            this.getData(defer, self);
        };

        /**
         * @ngdoc method
         * @name cyTable.factory:cyTableParams#generatePagesArray
         * @methodOf cyTable.factory:cyTableParams
         * @description Generate array of pages
         *
         * @param {boolean} currentPage which page must be active
         * @param {boolean} totalItems  Total quantity of items
         * @param {boolean} pageSize    Quantity of items on page
         * @returns {Array} Array of pages
         */
        this.generatePagesArray = function (currentPage, totalItems, pageSize) {
            var maxBlocks, maxPage, maxPivotPages, minPage, numPages, pages;
            var tmpItem;
            maxBlocks = 11;
            pages = [];
            numPages = Math.ceil(totalItems / pageSize);
            if (numPages > 1) {
                pages.push({
                    type: 'prev',
                    number: Math.max(1, currentPage - 1),
                    active: currentPage > 1
                });
                pages.push({
                    type: 'first',
                    number: 1,
                    active: currentPage > 1
                });
                maxPivotPages = Math.round((maxBlocks - 5) / 2);
                minPage = Math.max(2, currentPage - maxPivotPages);
                maxPage = Math.min(numPages - 1, currentPage + maxPivotPages * 2 - (currentPage - minPage));
                minPage = Math.max(2, minPage - (maxPivotPages * 2 - (maxPage - minPage)));
                var i = minPage;
                while (i <= maxPage) {
                    if ((i === minPage && i !== 2) || (i === maxPage && i !== numPages - 1)) {
                        tmpItem = {
                            type: 'more',
                            active: false
                        };
                    } else {
                        tmpItem = {
                            type: 'page',
                            number: i,
                            active: currentPage !== i
                        }
                    }
                    pages.push(tmpItem);
                    i++;
                }
                pages.push({
                    type: 'last',
                    number: numPages,
                    active: currentPage !== numPages
                });
                pages.push({
                    type: 'next',
                    number: Math.min(numPages, currentPage + 1),
                    active: currentPage < numPages
                });
            }
            return pages;
        };

        /**
         * @ngdoc method
         * @name cyTable.factory:cyTableParams#url
         * @methodOf cyTable.factory:cyTableParams
         * @description Return groups for table grouping
         *
         * @param {boolean} asString flag indicates return array of string or object
         * @returns {Array} If asString = true will be return array of url string parameters else key-value object
         */
        this.url = function (asString) {
            asString = asString || false;
            var pairs = (asString ? [] : {});
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    var item = params[key],
                        name = encodeURIComponent(key);
                    if (typeof item === "object") {
                        for (var subkey in item) {
                            if (!angular.isUndefined(item[subkey]) && item[subkey] !== "") {
                                var pname = name + "[" + encodeURIComponent(subkey) + "]";
                                if (asString) {
                                    pairs.push(pname + "=" + item[subkey]);
                                } else {
                                    pairs[pname] = item[subkey];
                                }
                            }
                        }
                    } else if (!angular.isFunction(item) && !angular.isUndefined(item) && item !== "") {
                        if (asString) {
                            pairs.push(name + "=" + encodeURIComponent(item));
                        } else {
                            pairs[name] = encodeURIComponent(item);
                        }
                    }
                }
            }
            return pairs;
        };

        /**
         * @ngdoc method
         * @name cyTable.factory:cyTableParams#reload
         * @methodOf cyTable.factory:cyTableParams
         * @description Reload table data
         */
        this.reload = function () {
            var $defer = $q.defer(),
                $sourceDefer = $q.defer(),
                self = this,
                i, len;

            settings.$loading = true;
            // get sourcelist
            if(params.needLoadDataSource && settings.getDataSource) {
                params.needLoadDataSource = false;
                settings.getDataSource($sourceDefer, self);
            } else {
                $sourceDefer.resolve(self.sourceList || null);
            }
            // get data after get sourcelist
            $sourceDefer.promise.then(function(list) {
                // init list, all selected
                self.sourceList = list;

                if (settings.groupBy) {
                    settings.getGroups($defer, settings.groupBy, self);
                } else {
                    settings.getData($defer, self);
                }
            });

            log('cyTable: reload data');

            $defer.promise.then(function (data) {
                settings.$loading = false;
                log('cyTable: current scope', settings.$scope);
                if (settings.groupBy) {
                    self.data = settings.$scope.$groups = data.list;
                } else {
                    self.data = settings.$scope.$data = data.list;
                }
                // reset total after reload data // {list:[], total:xx}
                if(isNumber(data.total)) {
                    self.total(data.total); 
                }
                settings.$scope.pages = self.generatePagesArray(self.page(), self.total(), self.count());
                settings.$scope.$emit('cyTableAfterReloadData');
            });
        };

        this.reloadPages = function () {
            var self = this;
            settings.$scope.pages = self.generatePagesArray(self.page(), self.total(), self.count());
        };

        this.search = function (value) {
            var self = this,
                key;
            if(!value) {
                self.searching(false);
                self.reload();
                return;
            };
            key = self.searchKey();
            if(!key) {
                log('cyTable: there is no searchKey');
                return;
            };
            self.searching(true);
            self.searchValue(value);
            log('cyTable: searching, key is ', key, 'value is', value);
            self.reload();
        };

        // get source list
        /*this.getDataSource = function($defer, params) {
            if (angular.isArray(this.sourceList) && angular.isObject(params)) {
                $defer.resolve({
                    list: this.sourceList
                });
            } else {
                $defer.resolve({
                    list: [],
                    total: 0
                });
            }
        };*/

        // The parameters object should be used to define initial (set and forget) configuration. 
        // More complex configuration should be done in the settings object.
        var params = this.$params = {
            page: 1,
            count: 1,
            filter: {},
            sorting: {},
            group: {},
            groupBy: null,
            searchKey: null, // 'key' or ['key1', 'key2']
            searchValue: null,
            searching: false,
            needLoadDataSource: true
        };
        var settings = {
            $scope: null, // set by cyTable controller
            $loading: false,
            data: null, //allows data to be set when table is initialized
            total: 0,
            defaultSort: 'desc',
            filterDelay: 750,
            counts: [5, 10, 25, 50],
            getGroups: this.getGroups,
            getData: this.getData,
            getDataSource: null // default disable this feature, enable by user
        };

        this.settings(baseSettings);
        this.parameters(baseParameters, true);
        return this;
    };
    return cyTableParams;
}]);

/**
 * @ngdoc object
 * @name cyTable.directive:cyTable.cyTableController
 *
 * @description
 * Each {@link cyTable.directive:cyTable cyTable} directive creates an instance of `cyTableController`
 */
var cyTableController = ['$scope', 'cyTableParams', '$timeout', function ($scope, cyTableParams, $timeout) {
    
    $scope.$loading = false;

    if (!$scope.params) {
        $scope.params = new cyTableParams();
    }
    $scope.params.settings().$scope = $scope;

    var delayFilter = (function () {
        var timer = 0;
        return function (callback, ms) {
            $timeout.cancel(timer);
            timer = $timeout(callback, ms);
        };
    })();
    $scope.$watch('params.$params', function (newParams, oldParams) {
        $scope.params.settings().$scope = $scope;

        if (!angular.equals(newParams.filter, oldParams.filter)) {
            delayFilter(function () {
                $scope.params.$params.page = 1;
                $scope.params.reload();
            }, $scope.params.settings().filterDelay);
        } else {
            $scope.params.reload();
        }
    }, true);

    $scope.sortBy = function (column, event) {
        var parsedSortable = $scope.parse(column.sortable);
        if (!parsedSortable) {
            return;
        }
        var defaultSort = $scope.params.settings().defaultSort;
        var inverseSort = (defaultSort === 'asc' ? 'desc' : 'asc');
        var sorting = $scope.params.sorting() && $scope.params.sorting()[parsedSortable] && ($scope.params.sorting()[parsedSortable] === defaultSort);
        var sortingParams = (event.ctrlKey || event.metaKey) ? $scope.params.sorting() : {};
        sortingParams[parsedSortable] = (sorting ? inverseSort : defaultSort);
        $scope.params.parameters({
            sorting: sortingParams
        });
    };
}];

/**
 * @ngdoc directive
 * @name cyTable.directive:cyTable
 * @restrict EA
 *
 * @description
 * Directive that instantiates {@link cyTable.directive:cyTable.cyTableController cyTableController}.
 */
app.directive('cyTable', ['$compile', '$q', '$parse',
    function ($compile, $q, $parse) {
        'use strict';

        return {
            restrict: 'A',
            priority: 1001,
            scope: true,
            controller: cyTableController,
            compile: function (element) {
                var columns = [], i = 0, row = null;

                // custom header
                var table = element.find('table');
                var thead = table.find('thead');

                // IE 8 fix :not(.ng-table-group) selector
                angular.forEach(angular.element(element.find('tr')), function (tr) {
                    tr = angular.element(tr);
                    if (!tr.hasClass('ng-table-group') && !row) {
                        row = tr;
                    }
                });

                if (!row) {
                    return;
                }
                angular.forEach(row.find('td'), function (item) {
                    var el = angular.element(item);
                    if (el.attr('ignore-cell') && 'true' === el.attr('ignore-cell')) {
                        return;
                    }
                    var parsedAttribute = function (attr, defaultValue) {
                        return function (scope) {
                            return $parse(el.attr('x-data-' + attr) || el.attr('data-' + attr) || el.attr(attr))(scope, {
                                $columns: columns
                            }) || defaultValue;
                        };
                    };

                    var parsedTitle = parsedAttribute('title', ' '),
                        headerTemplateURL = parsedAttribute('header', false),
                        filter = parsedAttribute('filter', false)(),
                        filterTemplateURL = false,
                        filterName = false;

                    if (filter && filter.$$name) {
                        filterName = filter.$$name;
                        delete filter.$$name;
                    }
                    if (filter && filter.templateURL) {
                        filterTemplateURL = filter.templateURL;
                        delete filter.templateURL;
                    }

                    el.attr('data-title-text', parsedTitle()); // this used in responsive table
                    columns.push({
                        id: i++,
                        title: parsedTitle,
                        sortable: parsedAttribute('sortable', false),
                        'class': el.attr('x-data-header-class') || el.attr('data-header-class') || el.attr('header-class'),
                        filter: filter,
                        filterTemplateURL: filterTemplateURL,
                        filterName: filterName,
                        headerTemplateURL: headerTemplateURL,
                        filterData: (el.attr("filter-data") ? el.attr("filter-data") : null),
                        show: (el.attr("ng-show") ? function (scope) {
                            return $parse(el.attr("ng-show"))(scope);
                        } : function () {
                            return true;
                        })
                    });
                });

                return function (scope, element, attrs) {
                    var table = element.find('table');
                    scope.$loading = false;
                    scope.$columns = columns;

                    scope.$watch(attrs.tableParams, (function (params) {
                        if (angular.isUndefined(params)) {
                            return;
                        }
                        scope.paramsModel = $parse(attrs.tableParams);
                        scope.params = params;
                    }), true);
                    scope.parse = function (text) {
                        return angular.isDefined(text) ? text(scope) : '';
                    };
                    if (attrs.showFilter) {
                        scope.$parent.$watch(attrs.showFilter, function (value) {
                            scope.show_filter = value;
                        });
                    }
                    angular.forEach(columns, function (column) {
                        var def;
                        if (!column.filterData) {
                            return;
                        }
                        def = $parse(column.filterData)(scope, {
                            $column: column
                        });
                        if (!(angular.isObject(def) && angular.isObject(def.promise))) {
                            throw new Error('Function ' + column.filterData + ' must be instance of $q.defer()');
                        }
                        delete column.filterData;
                        return def.promise.then(function (data) {
                            if (!angular.isArray(data)) {
                                data = [];
                            }
                            data.unshift({
                                title: '-',
                                id: ''
                            });
                            column.data = data;
                        });
                    });
                    if (!element.hasClass('cy-table')) {
                        scope.templates = {
                            header: (attrs.templateHeader ? attrs.templateHeader : 'ng-table/header.html'),
                            pagination: (attrs.templatePagination ? attrs.templatePagination : 'ng-table/pager.html'),
                            operation: (attrs.templateOperation ? attrs.templateOperation : 'ng-table/pager.html')
                        };
                        var headerTemplate = thead.length > 0 ? thead : angular.element(document.createElement('thead')).attr('ng-include', 'templates.header');
                        var paginationTemplate = angular.element(element[0].querySelector('.cy-table-pagination'));
                        var operationTemplate = angular.element(element[0].querySelector('.cy-table-operation'));
                        paginationTemplate.attr({
                            'cy-table-pagination': 'params',
                            'template-url': 'templates.pagination'
                        });
                        operationTemplate.attr({
                            'cy-table-operation': 'params',
                            'template-url': 'templates.operation'
                        });

                        element.find('thead').remove();

                        element.addClass('cy-table');
                        table.prepend(headerTemplate)
                            .after(paginationTemplate);
                        element.prepend(operationTemplate);
                        $compile(headerTemplate)(scope);
                        $compile(paginationTemplate)(scope);
                        $compile(operationTemplate)(scope);
                    }
                };
            }
        }
    }
]);


/**
 * @ngdoc directive
 * @name cyTable.directive:cyTablePagination
 * @restrict A
 */
app.directive('cyTablePagination', ['$compile',
    function ($compile) {
        'use strict';

        return {
            restrict: 'A',
            scope: {
                'params': '=cyTablePagination',
                'templateUrl': '=',
                'displayedPageCount': '@' //要显示的分页数（除上一页、下一页、开始、结束）
            },
            replace: false,
            link: function (scope, element, attrs) {
                
                scope.params.settings().$scope.$on('cyTableAfterReloadData', function () {
                    var currentPage = scope.params.page(),
                        pages = scope.params.generatePagesArray(currentPage, scope.params.total(), scope.params.count()),
                        len = pages.length,
                        maxLen = scope.displayedPageCount,
                        radius = Math.ceil(maxLen / 2),
                        i, pageItem, 
                        disabledPages;
                    scope.pages = pages;
                }, true);

                scope.$watch('displayedPageCount', function(displayedPageCount) {
                    if (angular.isUndefined(displayedPageCount)) {
                        return;
                    }
                    scope.displayedPageCount = parseInt(displayedPageCount, 10);
                });

                scope.$watch('templateUrl', function(templateUrl) {
                    if (angular.isUndefined(templateUrl)) {
                        return;
                    }
                    var template = angular.element(document.createElement('div'))
                    template.attr({
                        'ng-include': 'templateUrl'
                    });
                    element.append(template);
                    $compile(template)(scope);
                });
            }
        };
    }
]);

app.directive('cyTableOperation', ['$compile',
    function ($compile) {
        'use strict';

        return {
            restrict: 'A',
            scope: {
                'params': '=cyTableOperation',
                'templateUrl': '=',
                'searchKey': '@'
            },
            replace: false,
            link: function (scope, element, attrs) {
                scope.searchValue = null;
                scope.$watch('templateUrl', function(templateUrl) {
                    if (angular.isUndefined(templateUrl)) {
                        return;
                    }
                    var template = angular.element(document.createElement('div'))
                    template.attr({
                        'ng-include': 'templateUrl'
                    });
                    element.append(template);
                    $compile(template)(scope);
                });
                console.log("wow, operation's scope", scope);
                scope.$watch('searchKey', function(key) {
                    scope.params.searchKey(key);
                });
            }
        };
    }
]);

angular.module('cyTable').run(['$templateCache', function ($templateCache) {
    $templateCache.put('ng-table/filters/select-multiple.html', '<select ng-options="data.id as data.title for data in column.data" multiple ng-multiple="true" ng-model="params.filter()[name]" ng-show="filter==\'select-multiple\'" class="filter filter-select-multiple form-control" name="{{column.filterName}}"> </select>');
    $templateCache.put('ng-table/filters/select.html', '<select ng-options="data.id as data.title for data in column.data" ng-model="params.filter()[name]" ng-show="filter==\'select\'" class="filter filter-select form-control" name="{{column.filterName}}"> </select>');
    $templateCache.put('ng-table/filters/text.html', '<input type="text" name="{{column.filterName}}" ng-model="params.filter()[name]" ng-if="filter==\'text\'" class="input-filter form-control"/>');
    $templateCache.put('ng-table/header.html', '<tr> <th ng-repeat="column in $columns" ng-class="{ \'sortable\': parse(column.sortable), \'sort-asc\': params.sorting()[parse(column.sortable)]==\'asc\', \'sort-desc\': params.sorting()[parse(column.sortable)]==\'desc\' }" ng-click="sortBy(column, $event)" ng-show="column.show(this)" ng-init="template=column.headerTemplateURL(this)" class="header {{column.class}}"> <div ng-if="!template" ng-show="!template" ng-bind="parse(column.title)"></div> <div ng-if="template" ng-show="template"><div ng-include="template"></div></div> </th> </tr> <tr ng-show="show_filter" class="ng-table-filters"> <th ng-repeat="column in $columns" ng-show="column.show(this)" class="filter"> <div ng-repeat="(name, filter) in column.filter"> <div ng-if="column.filterTemplateURL" ng-show="column.filterTemplateURL"> <div ng-include="column.filterTemplateURL"></div> </div> <div ng-if="!column.filterTemplateURL" ng-show="!column.filterTemplateURL"> <div ng-include="\'ng-table/filters/\' + filter + \'.html\'"></div> </div> </div> </th> </tr>');
    $templateCache.put('ng-table/pager.html', '<div class="ng-cloak ng-table-pager"> <div ng-if="params.settings().counts.length" class="ng-table-counts btn-group pull-right"> <button ng-repeat="count in params.settings().counts" type="button" ng-class="{\'active\':params.count()==count}" ng-click="params.count(count)" class="btn btn-default"> <span ng-bind="count"></span> </button> </div> <ul class="pagination ng-table-pagination"> <li ng-class="{\'disabled\': !page.active}" ng-repeat="page in pages" ng-switch="page.type"> <a ng-switch-when="prev" ng-click="params.page(page.number)" href="">&laquo;</a> <a ng-switch-when="first" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="page" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="more" ng-click="params.page(page.number)" href="">&#8230;</a> <a ng-switch-when="last" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="next" ng-click="params.page(page.number)" href="">&raquo;</a> </li> </ul> </div> ');
}]);
    return app;
}));
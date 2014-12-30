/* 
    angular-treeview: the treeview directive
    tree-id : each tree's unique id.
    tree-model : the tree model on $scope.
    node-id : each node's id
    node-label : each node's label
    node-children: each node's children
    <div
        data-angular-treeview="true"
        data-tree-id="tree"
        data-tree-model="roleList"
        data-node-id="roleId"
        data-node-label="roleName"
        data-node-children="children" >
    </div>
*/

;
(function(angular) {
'use strict';

var app = angular.module('cyTree', []);


app.directive('treeModel', ['$q', '$log', '$compile',

    function($q, $log, $compile) {
        function toggleChildren(node, flag) {
            var children = node.list,
                i, len;
            if(children && children.length) {
                for(i = 0, len = children.length; i < len; i++) {
                    children[i].selected = flag;
                    //toggleItem(list, map, children[i], flag);
                    toggleChildren(children[i], flag);
                }
            }
        }

        return {
            restrict: 'A',
            scope: true,
            link: function(scope, element, attrs, ctrl) {

                var log = function () {
                    if (attrs.debugMode && $log.debug) {
                        $log.debug.apply(this, arguments);
                    }
                };

                var treeId = attrs.treeId; // tree id
                var treeModel = attrs.treeModel; // tree model
                var nodeId = attrs.nodeId || 'id'; // node id
                var nodeLabel = attrs.nodeLabel || 'label'; // node label
                var nodeChildren = attrs.nodeChildren || 'children'; // children

                var selectedList, selectedListMap;
                //tree template
                var template =
                    '<ul>' +
                    '<li ng-repeat="node in ' + treeModel + '">' +
                    '<i class="collapsed fa fa-plus-square" ng-show="node.' + nodeChildren + '.length && node.collapsed" ng-click="' + treeId + '.collapseNode(node)"></i>' +
                    '<i class="expanded fa fa-minus-square" ng-show="node.' + nodeChildren + '.length && !node.collapsed" ng-click="' + treeId + '.collapseNode(node)"></i>' +
                    '<i class="normal" ng-hide="node.' + nodeChildren + '.length"></i> ' +
                    '<i class="fa" ng-class="{\'fa-check-square\': node.selected, \'fa-square\': !node.selected}" ng-click="' + treeId + '.selectNode(node, parentNode)"></i> ' +
                    '<span ng-class="node.selected">{{node.' + nodeLabel + '}}</span>' +
                    '<div ng-init="parentNode = node" ng-hide="node.collapsed" tree-id="' + treeId + '" tree-model="node.' + nodeChildren + '" node-id=' + nodeId + ' node-label=' + nodeLabel + ' node-children=' + nodeChildren + '></div>' +
                    '</li>' +
                    '</ul>';

                log('cyTree', attrs, treeId, treeModel, nodeId, nodeLabel, nodeChildren);

                //check tree id, tree model
                if (treeId && treeModel) {

                    //root node, only execute once
                    if (attrs.cyTree) {

                        log('cyTree', 'about to add behavior');

                        //create tree object if not exists
                        scope[treeId] = scope[treeId] || {};
                        
                        //Collapse or Expand node when collapse icon clicked
                        scope[treeId].collapseNode = scope[treeId].collapseNode || function(selectedNode) {
                            selectedNode.collapsed = !selectedNode.collapsed;
                            log('cyTree collapseNode', scope);
                        };

                        //select/deselect node when check icon clicked
                        scope[treeId].selectNode = scope[treeId].selectNode || function(selectedNode, parentNode) {
                            console.log(selectedNode, 'parentNode:', parentNode);
                            var i,
                                len,
                                siblings,
                                toSelect = true,
                                original = selectedNode.selected,
                                current = !original;
                            selectedNode.selected = current;
                            //toggleItem(selectedList, selectedListMap, selectedNode, current);
                            if(parentNode) { // check if need to select parentNode
                                siblings = parentNode.list;
                                for(i = 0, len = siblings.length; i < len; i++) {
                                    if(siblings[i].selected !== true) {
                                        toSelect = false;
                                        break;
                                    }
                                }
                                if(toSelect) { // parent couldn't be shop, no need to add to selectedList
                                    parentNode.selected = true;
                                } else {
                                    parentNode.selected = false;
                                }
                            }
                            toggleChildren(selectedNode, current);
                            //set currentNode
                            scope[treeId].currentNode = selectedNode;
                            log('cyTree selectNode', scope);
                        };

                    }

                    log('cyTree', 'about to render tree ', scope);

                    //Rendering template.
                    element.html('').append($compile(template)(scope));
                }
            }
        };
    }
]);

})(angular);

'use strict';

angular.module('adminApp.filters')
    .filter('checkStatus', function() {
        return function(input, positive, negative) {
            var result = true,
                positive = positive || 'true',
                negative = negative || 'false';
            if(input === '0') {
                result = false;
            } else {
                result = !!input;
            }
            return result ? positive : negative;
        }
    });
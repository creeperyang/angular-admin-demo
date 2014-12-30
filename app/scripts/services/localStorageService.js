'use strict';

angular.module('adminApp.services')
    .factory('LocalStorageServ', function() {

        var api = {
                sessionStorage: {},
                localStorage: {}
            },
            session = api.sessionStorage,
            local = api.localStorage;
        local.get = function(key) {
            var val = localStorage.getItem(key) || null;
            return JSON.parse(val);
        };
        local.set = function(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        };
        local.remove = function(key) {
            localStorage.removeItem(key);
        };
        local.clear = function() {
            localStorage.clear();
        };
        local.exist = function(key) {
            var len = localStorage.length,
                exist = false;
            for(var i=0; i < len; i++) {
                if(localStorage.key(i) === key) {
                    exist = true;
                    break;
                }
            }
            return exist;
        };
        local.support = function() {
            try {
                return 'localStorage' in window && window['localStorage'] !== null;
            } catch (e) {
                return false;
            }
        };

        session.get = function(key) {
            var val = sessionStorage.getItem(key) || null;
            return JSON.parse(val);
        };
        session.set = function(key, value) {
            sessionStorage.setItem(key, JSON.stringify(value));
        };
        session.remove = function(key) {
            sessionStorage.removeItem(key);
        };
        session.clear = function() {
            sessionStorage.clear();
        };
        session.exist = function(key) {
            var len = sessionStorage.length,
                exist = false;
            for(var i=0; i < len; i++) {
                if(sessionStorage.key(i) === key) {
                    exist = true;
                    break;
                }
            }
            return exist;
        };
        session.support = function() {
            try {
                return 'sessionStorage' in window && window['sessionStorage'] !== null;
            } catch (e) {
                return false;
            }
        };

        return api;

    });
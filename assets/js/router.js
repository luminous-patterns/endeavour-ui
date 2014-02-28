$(function() {

    window.Endeavour.Router = Backbone.Router.extend({

        routes: {

            'dashboard':                   'showDashboard',
            'list/:ID':                    'showList',
            'list/:ListID/item/:ID':       'showListItem',
            'user/:ID':                    'showUserProfile',

            '':                            'showIndex',
            'login':                       'showLogin',
            'register':                    'showRegister',
            'login/lost-password':         'showLostPassword',
            'logout':                      'handleLogout',
            '*route':                      'handleUnknown',

        },

        execute: function(callback, args) {

            var that = this;

            console.log('pre-route');

            var onSessionSet = function() {
                Endeavour.unsubscribe('session:set', onSessionSet, this);
                if (callback) callback.apply(this, args);
            };

            var onSessionUnset = function() {
                Endeavour.unsubscribe('session:unset', onSessionUnset, this);
                this.showLogin();
            };

            if (!Endeavour.state.isLoggedIn()) {
                console.log('router got inactive session...');
                Endeavour.subscribe('session:set', onSessionSet, this);
                Endeavour.subscribe('session:unset', onSessionUnset, this);
                Endeavour.state.checkSession();
                return;
            }

            console.log('router got active session...');

            if (callback) callback.apply(this, args);

        },

        showDashboard: function() {
            
        },

        showList: function(ID) {
            
        },

        showListItem: function(ListID, ID) {
            
        },

        showUserProfile: function(ID) {
            
        },

        

        showIndex: function() {
            
        },

        showLogin: function() {
            console.log('***LOGIN REQUIRED***');
        },

        showRegister: function() {
            
        },

        showLostPassword: function() {
            
        },

        handleLogout: function() {
            Endeavour.events.trigger('logout');
        },

        handleUnknown: function(route) {
            console.log("the unknown!!!",route);
        },

    });

});
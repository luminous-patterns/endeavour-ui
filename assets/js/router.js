$(function() {

    window.Endeavour.Router = Backbone.Router.extend({

        routes: {

            'dashboard':                   'showDashboard',
            'lists':                       'showAllLists',
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
                Endeavour.unsubscribe('session:set', onSessionSet, that);
                if (callback) callback.apply(that, args);
            };

            var onSessionUnset = function() {
                Endeavour.unsubscribe('session:unset', onSessionUnset, that);
                that.showLogin();
                // that.navigate('login', {trigger: true, replace: true});
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
            Endeavour.stage.showSection('dashboard');
        },

        showAllLists: function() {
            Endeavour.stage.showSection('all-lists');
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

            if (Endeavour.state.isLoggedIn()) {
                return this.navigate('dashboard', {trigger: true, replace: true});
            }

            console.log('***LOGIN REQUIRED***');

            Endeavour.stage.showDialog('login');

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
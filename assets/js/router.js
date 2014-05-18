$(function() {

    window.Endeavour.Router = Backbone.Router.extend({

        routes: {

            'dashboard':                   'showDashboard',
            'lists':                       'showAllLists',
            'calendar':                    'showCalendar',
            'today':                       'showToday',
            'my-account':                  'showMyAccount',
            'list/:ID':                    'showList',
            'list/:ListID/item/:ID':       'showListItem',
            'user/:ID':                    'showUserProfile',

            '':                            'showIndex',
            'login':                       'showLogin',
            'create-account':              'showRegister',
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
                if (window.location.hash == '#/create-account') that.showRegister();
                else that.showLogin();
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
            Endeavour.publish('active-model:set', 'list', 0);
            Endeavour.stage.showSection('all-lists');
        },

        showCalendar: function() {
            Endeavour.stage.showSection('calendar');
        },

        showToday: function() {
            Endeavour.stage.showSection('today');
        },

        showMyAccount: function() {
            Endeavour.stage.showSection('my-account');
        },

        showList: function(ID) {
            Endeavour.publish('active-model:set', 'list', ID);
            Endeavour.stage.showSection('all-lists');
        },

        showListItem: function(ListID, ID) {
            Endeavour.publish('active-model:set', 'list', ID);
            Endeavour.publish('active-model:set', 'listItem', ID);
            Endeavour.stage.showSection('list-item');
        },

        showUserProfile: function(ID) {
            
        },

        

        showIndex: function() {

            if (Endeavour.state.isLoggedIn()) {
                return this.navigate('#/lists', {trigger: true, replace: true});
            }
            
        },

        showLogin: function() {

            if (Endeavour.state.isLoggedIn()) {
                return this.navigate('#/lists', {trigger: true, replace: true});
            }

            console.log('***LOGIN REQUIRED***');

            Endeavour.stage.showDialog('login');

        },

        showRegister: function() {

            if (Endeavour.state.isLoggedIn()) {
                return this.navigate('#/lists', {trigger: true, replace: true});
            }

            Endeavour.stage.showDialog('register');
            
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
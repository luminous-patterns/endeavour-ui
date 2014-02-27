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
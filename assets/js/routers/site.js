Endeavour.Router.Site = Backbone.Router.extend({

    routes: {
        '':                            'showIndex',
        'login':                       'showLogin',
        'register':                    'showRegister',
        'login/lost-password':         'showLostPassword',
        'logout':                      'handleLogout',
        '*route':                      'handleUnknown',
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
        
    },

});
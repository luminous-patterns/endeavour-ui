Endeavour.Model.State = Backbone.Model.extend({

    session: null,

    initialize: function() {

        this.checkSession();

        Endeavour.events.on('logout', this.logout, this);

        Endeavour.events.on('login-success', this.onLoginSuccess, this);

    },

    login: function(data) {

        var that = this;

        if (this.isLoggedIn()) {
            
            return this;
        }

        var xhr = Endeavour.post({
            url:         '/login',
            data:        data,
            success:     $.proxy(that.onLoginSuccess, that),
        });

    },

    logout: function() {

        var that = this;

        if (!this.isLoggedIn()) {

            return this;
        }

        var xhr = Endeavour.post({
            url:         '/logout',
            data:        data,
            success:     $.proxy(that.onLogoutSuccess, that)
        });

    },

    onLogoutSuccess: function(jsonResponse) {

        var session = this.session = new Endeavour.Models.Session(jsonResponse);

        // unsetCookie

        Enveavour.events.trigger('session-ended');

    },

    onLoginSuccess: function(jsonResponse) {

        var session = this.session = new Endeavour.Models.Session(jsonResponse);

        // setCookie

        Enveavour.events.trigger('session-set', session);

    },

    isLoggedIn: function() {

    },

});
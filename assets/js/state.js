Endeavour.Model.State = Backbone.Model.extend({

    session: null,

    initialize: function() {

        this.checkSession();

        Endeavour.events.on('login-success', this.onLoginSuccess, this);

    },

    login: function(data) {

        var xhr = Endeavour.post({
            url:         '/login',
            data:        data,
            success:     'login-success',
            failure:     'login-failure',
        });

    },

    onLoginSuccess: function(jsonResponse) {

        var session = this.session = new Endeavour.Models.Session(jsonResponse);

        // setCookie

        Enveavour.events.trigger('session-set', session);

    },

    isLoggedIn: function() {

    },

});
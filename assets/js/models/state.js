$(function() {

    Endeavour.Model.State = Backbone.Model.extend({

        session: null,

        initialize: function() {

            this.session = new Endeavour.Model.Session();

            this.checkSession();

            Endeavour.subscribe('logout', this.logout, this);

            this.session.on('login:success', this.onLoginSuccess, this);

        },

        login: function(data) {
            this.session.login(data);
            return this;
        },

        logout: function() {
            this.session.logout();
            return this;
        },

        checkSession: function() {

            if (sessionKey = this.getSavedSessionKey()) {
                this.loadSession(sessionKey);
            }

            return this;

        },

        loadSession: function(sessionKey) {
            this.session.loginWithKey(sessionKey);
            return this;
        },

        onLogoutSuccess: function(jsonResponse) {

            // Clear saved session key
            this.clearSavedSessionKey();

            Enveavour.publish('session-ended');

        },

        onLoginSuccess: function(jsonResponse) {
            this.saveSessionKey(this.session);
            Endeavour.publish('session-set', this.session);
            console.log(this.getSavedSessionKey());
            return this;
        },

        isLoggedIn: function() {

        },

        getSavedSessionKey: function() {
            return window.localStorage.getItem('sessionKey');
        },

        saveSessionKey: function(session) {
            var sessionKey = session.get('Key') + '-' + session.get('UserID');
            window.localStorage.setItem('sessionKey', sessionKey);
            return this;
        },

        clearSavedSessionKey: function() {
            window.localStorage.setItem('sessionKey', null);
            return this;
        },

    });

});
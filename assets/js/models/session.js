$(function() {

    Endeavour.Model.Session = Backbone.Model.extend({
        
        defaults: {
            'ID':                 null, // int
            'UserID':             null, // int
            'Key':                null, // str
            'Expiry':             null, // int - Session expiry in seconds
            'Created':            null, // str - ISO-8601 date
            'Revoked':            false, // bool
        },

        initialize: function() {

        },

        isLoggedIn: function() {

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

        loginWithKey: function(sessionKey) {

            var that = this;

            var keyParts = sessionKey.split(/-/);

            var data = {
                UserID: keyParts[1],
                SessionKey: keyParts[0],
            };

            var xhr = Endeavour.get({
                url:         '/sessions/0',
                data:        data,
                success:     $.proxy(that.onLoginSuccess, that),
            });

            return this;

        },

        onLogoutSuccess: function(jsonResponse) {
            this.set(jsonResponse);
            this.trigger('logout:success');
            return this;
        },

        onLoginSuccess: function(jsonResponse) {
            this.set(jsonResponse);
            this.trigger('login:success');
            return this;
        },

    });

});
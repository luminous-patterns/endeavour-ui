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

        created: null,

        initialize: function() {

            this.on('change:Created', this.onChangeCreated, this);

        },

        onChangeCreated: function() {
            this.created = new Date(this.get('Created'));
            return this;
        },

        isLoggedIn: function() {
            return this.get('ID') ? true : false;
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
                error:       $.proxy(that.onLoginFailure, that),
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
                success:     $.proxy(that.onLogoutSuccess, that),
                error:       $.proxy(that.onLogoutFailure, that),
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
                error:       $.proxy(that.onLoginFailure, that),
            });

            return this;

        },

        onLoginSuccess: function(jsonResponse) {
            this.set(jsonResponse);
            this.trigger('login:success');
            return this;
        },

        onLoginFailure: function(jsonResponse) {
            this.trigger('login:failure');
            return this;
        },

        onLogoutSuccess: function(jsonResponse) {
            this.set(jsonResponse);
            this.trigger('logout:success');
            return this;
        },

        onLogoutFailure: function(jsonResponse) {
            this.trigger('logout:failure');
            return this;
        },

    });

});
$(function() {

    Endeavour.Model.Session = Endeavour.Model.Abstract.extend({
        
        defaults: {
            'ID':                 null, // int
            'UserID':             null, // int
            'Key':                null, // str
            'Expiry':             null, // int - Session expiry in seconds
            'Created':            null, // str - ISO-8601 date
            'Revoked':            false, // bool
        },

        created: null,
        user: null,

        initialize: function() {

            this.on('change:Created', this.onChangeCreated, this);
            this.on('login:success', this.loadUserModel, this);

        },

        onChangeCreated: function() {
            this.created = new Date(this.get('Created'));
            return this;
        },

        loadUserModel: function() {
            this.user = new Endeavour.Model.User;
            this.user.url = 'http://api.endeavour.local/users/' + this.get('UserID');
            this.user.fetch();
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
                beforeSend:  function (xhr) {
                    xhr.setRequestHeader('Endeavour-Session-Key', that.get('Key'));
                    xhr.setRequestHeader('Endeavour-Auth-User-ID', that.get('UserID'));
                },
            });

        },

        loginWithKey: function(sessionKey) {

            var that = this;

            var keyParts = sessionKey.split(/-/);

            var xhr = Endeavour.get({
                url:         '/sessions/0',
                success:     $.proxy(that.onLoginSuccess, that),
                error:       $.proxy(that.onLoginFailure, that),
                beforeSend:  function (xhr) {
                    xhr.setRequestHeader('Endeavour-Session-Key', keyParts[0]);
                    xhr.setRequestHeader('Endeavour-Auth-User-ID', keyParts[1]);
                },
            });

            return this;

        },

        onLoginSuccess: function(jsonResponse) {
            this.set(jsonResponse);
            this.trigger('login:success');
            return this;
        },

        onLoginFailure: function(jsonResponse) {
            this.trigger('login:failure', jsonResponse);
            return this;
        },

        onLogoutSuccess: function(jsonResponse) {
            this.set(jsonResponse);
            this.trigger('logout:success');
            return this;
        },

        onLogoutFailure: function(jsonResponse) {
            this.trigger('logout:failure', jsonResponse);
            return this;
        },

    });

});
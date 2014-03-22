$(function() {

    Endeavour.Model.State = Endeavour.Model.Abstract.extend({

        activeModel: null,
        session: null,
        checkingSession: false,

        initialize: function() {

            this.activeModel = {};

            this.session = new Endeavour.Model.Session;

            this.checkSession();

            Endeavour.subscribe('logout', this.logout, this);

            Endeavour.subscribe('session:set', function(){console.log('session:set')}, this);
            Endeavour.subscribe('session:unset', function(){console.log('session:unset')}, this);
            Endeavour.subscribe('active-model:set', this.onSetActiveModel, this);

            this.session.on('login:success', this.onLoginSuccess, this);
            this.session.on('login:failure', this.onLoginFailure, this);

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

            // This function will end up publishing a
            // session:set or session:unset event when
            // session exists or does not exist respectively.

            if (this.checkingSession) {
                console.log('***BE PATIENT*** already checking session...');
                return this;
            }

            if (this.isLoggedIn()) {
                Endeavour.publish('session:set', this.session);
                return this;
            }

            this.checkingSession = true;

            if (sessionKey = this.getSavedSessionKey()) {
                return this.loadSession(sessionKey);
            }

            this.checkingSession = false;
            
            Endeavour.publish('session:unset', this.session);

            return this;

        },

        loadSession: function(sessionKey) {
            this.session.once('login:failure', this.onLoadSessionFailure, this);
            this.session.loginWithKey(sessionKey);
            return this;
        },

        onLogoutSuccess: function(jsonResponse) {

            // Clear saved session key
            this.clearSavedSessionKey();

            Enveavour.publish('session:unset');

        },

        onLoginSuccess: function(jsonResponse) {
            this.checkingSession = false;
            this.session.off('login:failure', this.onLoadSessionFailure, this);
            this.saveSessionKey(this.session);
            console.log('***SESSION START***', this.getSavedSessionKey());
            Endeavour.publish('session:set', this.session);
            Endeavour.publish('session:login:success', jsonResponse);
            return this;
        },

        onLoginFailure: function(jsonResponse) {
            this.checkingSession = false;
            Endeavour.publish('session:unset');
            Endeavour.publish('session:login:failure', jsonResponse);
            return this.clearSavedSessionKey();
        },

        onLoadSessionFailure: function(jsonResponse) {
            this.checkingSession = false;
            Endeavour.publish('session:unset');
            return this.clearSavedSessionKey();
        },

        isLoggedIn: function() {
            return this.session.isLoggedIn();
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
            window.localStorage.setItem('sessionKey', '');
            return this;
        },

        onSetActiveModel: function(type, model) {

            if (!model && model !== 0) {
                console.error('No model or ID given');
                return;
            }

            if (typeof model != 'object') {
                switch (type) {
                    case 'list':
                        if (model === 0) {
                            model = Endeavour.state.session.user;
                        }
                        else {
                            loadedList = Endeavour.collection.lists.get(model);
                            model = loadedList ? loadedList : new Endeavour.Model.List({ID: model});
                        }
                        break;
                    case 'listItem':
                        loadedListItem = Endeavour.collection.listItems.get(model);
                        model = loadedListItem ? loadedListItem : new Endeavour.Model.ListItem({ID: model});
                        break;
                }
            }

            model.fetch();

            this.activeModel[type] = model;

            return this;

        },

        getActiveModel: function(type) {
            return this.activeModel[type];
        },

    });

});
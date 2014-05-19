$(function() {

    Endeavour.Model.User = Endeavour.Model.Abstract.extend({

        urlRoot: function() {
            return Endeavour.serverURL + '/users';
        },

        defaults: {
            'ID':                 null, // int
            'EmailAddress':       null, // str
            'AvatarURL':          null, // str
            'FirstName':          null, // str
            'LastName':           null, // str
            'TimeZone':           null, // str
            'Created':            null, // str - ISO-8601 date
            'Modified':           null, // str - ISO-8601 date
        },

        initialize: function() {

            this.lists = new Endeavour.Collection.Lists;
            this.listsLoaded = false;

            this.on('sync', this.onSync, this);

        },

        onSync: function() {
            this.loadLists();
            Endeavour.publish('change:user');
            return this;
        },

        loadLists: function() {
            this.lists.url = Endeavour.serverURL + '/lists';
            this.lists.fetch({success: $.proxy(this.onListsLoaded, this)});
            return this;
        },

        onListsLoaded: function() {
            this.listsLoaded = true;
            return this;
        },

        getLists: function() {
            if (this.lists.length < 1) return null;
            return this.lists;
        },

        getFullName: function() {
            return this.get('FirstName') + ' ' + this.get('LastName');
        },

        getLists: function() {
            if (this.lists.length < 1) return null;
            return this.lists;
        },

        getList: function(ID) {
            if (this.lists.length < 1) return null;
            return this.lists.get(ID);
        },

        createList: function(attributes) {
            var that = this;
            return this.lists.create(_.extend(attributes, {UserID: Endeavour.state.session.get('UserID')}));
        },

        changePassword: function(options) {

            var onSuccess = 'success' in options ? options.success : function() {};
            var onError = 'error' in options ? options.error : function() {};
            var data = {
                currentPassword: options.currentPassword,
                newPassword: options.newPassword,
                confirmPassword: options.confirmPassword,
            };

            Endeavour.authedPost({
                url: '/users/' + this.get('ID') + '/change-password',
                data: data,
                success: onSuccess,
                error: onError,
            });

        },

    });

});
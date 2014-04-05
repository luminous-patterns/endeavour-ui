$(function() {

    Endeavour.Model.User = Endeavour.Model.Abstract.extend({

        urlRoot: function() {
            return Endeavour.serverURL + '/users';
        },

        defaults: {
            'ID':                 null, // int
            'EmailAddress':       null, // str
            'FirstName':          null, // str
            'LastName':           null, // str
            'Created':            null, // str - ISO-8601 date
            'Modified':           null, // str - ISO-8601 date
        },

        initialize: function() {

            this.lists = new Endeavour.Collection.Lists;
            this.lists.url = Endeavour.serverURL + '/lists';

            this.on('sync', this.onSync, this);

        },

        onSync: function() {
            this.lists.fetch();
            Endeavour.publish('change:user');
            return this;
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

    });

});
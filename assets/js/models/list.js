$(function() {

    Endeavour.Model.List = Endeavour.Model.Abstract.extend({

        urlRoot: 'http://api.endeavour.local/lists',

        defaults: {
            'ID':                 null, // int
            'ParentID':           null, // int
            'UserID':             null, // int
            'Title':              null, // string
            'Description':        null, // string
            'Created':            null, // str - ISO-8601 date
            'Start':              null, // str - ISO-8601 date
            'Due':                null, // str - ISO-8601 date
            'Deleted':            null, // boolean
        },

        created: null,
        start: null,
        due: null,

        initialize: function() {

            this.items = new Endeavour.Collection.ListItems;
            this.lists = new Endeavour.Collection.Lists;

            this.on('change:Created', this.onChangeCreated, this);
            this.on('change:Start', this.onChangeStart, this);
            this.on('change:Due', this.onChangeDue, this);

            this.on('sync', this.onSync, this);

        },

        loadItems: function() {
            this.items.url = 'http://api.endeavour.local/lists/' + this.id + '/items';
            this.items.fetch();
            return this;
        },

        getItems: function() {
            if (this.items.length < 1) return null;
            return this.items;
        },

        getItem: function(ID) {
            if (this.items.length < 1) return null;
            return this.items.get(ID);
        },

        createItem: function(attributes) {
            var that = this;
            return this.items.create(_.extend(attributes, {UserID: Endeavour.state.session.get('UserID'), ListID: that.id}));
        },

        loadLists: function() {
            this.lists.url = 'http://api.endeavour.local/lists/' + this.id + '/items';
            this.lists.fetch();
            return this;
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
            return this.lists.create(_.extend(attributes, {UserID: Endeavour.state.session.get('UserID'), ParentID: that.id}));
        },

        onChangeCreated: function() {
            this.created = new Date(this.get('Created'));
            return this;
        },

        onChangeStart: function() {
            this.start = new Date(this.get('Start'));
            return this;
        },

        onChangeDue: function() {
            this.due = new Date(this.get('Due'));
            return this;
        },

        onSync: function() {
            return this;
        },

    });

    Endeavour.Collection.Lists = Endeavour.Collection.Abstract.extend({
        model: Endeavour.Model.List
    });

});
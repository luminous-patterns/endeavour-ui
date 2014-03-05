$(function() {

    Endeavour.Model.List = Endeavour.Model.Abstract.extend({

        urlRoot: 'http://api.endeavour.local/lists',

        defaults: {
            'ID':                 null, // int
            'ParentID':           null, // int
            'UserID':             null, // int
            'Title':              null, // string
            'Description':        null, // string
            'Lists':              null, // int
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
            this.itemsLoaded = false;
            this.lists = new Endeavour.Collection.Lists;
            this.listsLoaded = false;

            this.on('change:Created', this.onChangeCreated, this);
            this.on('change:Start', this.onChangeStart, this);
            this.on('change:Due', this.onChangeDue, this);

            this.on('sync', this.onSync, this);

            // Add this to global collection
            Endeavour.publish('new:model:list', this);

        },

        loadItems: function() {
            this.items.url = 'http://api.endeavour.local/lists/' + this.id + '/items';
            this.items.fetch({success: $.proxy(this.onItemsLoaded, this)});
            return this;
        },

        onItemsLoaded: function() {
            this.itemsLoaded = true;
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
            this.lists.url = 'http://api.endeavour.local/lists/' + this.id + '/lists';
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

        getList: function(ID) {
            if (this.lists.length < 1) return null;
            return this.lists.get(ID);
        },

        createList: function(attributes) {
            var that = this;
            return this.lists.create(_.extend(attributes, {UserID: Endeavour.state.session.get('UserID'), ParentID: that.id}));
        },

        hasLists: function() {
            return this.get('Lists') || this.lists.length > 0 ? true : false;
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

        setParentID: function(ParentID) {

            var lastParentID = this.get('ParentID');
            var lastParent = Endeavour.collection.lists.get(lastParentID);

            var parent = Endeavour.collection.lists.get(ParentID);
            
            if (lastParent) {
                lastParent.lists.remove(this);
                lastParent.set('Lists', Math.max(0, parseInt(parent.get('Lists')) - 1));
            }
            else {
                Endeavour.state.session.user.lists.remove(this);
            }

            if (parent) {
                parent.lists.add(this);
                parent.set('Lists', parseInt(parent.get('Lists')) + 1);
            }

            console.log('moving item from' +lastParentID+' to ' +ParentID,lastParent, parent);

            this.save({ParentID: ParentID}, {patch: true});

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
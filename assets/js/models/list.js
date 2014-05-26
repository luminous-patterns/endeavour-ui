$(function() {

    Endeavour.Model.List = Endeavour.Model.Abstract.extend({

        urlRoot: function() {
            return Endeavour.serverURL + '/lists';
        },

        defaults: {
            'ID':                 null, // int
            'ParentID':           null, // int
            'UserID':             null, // int
            'OwnerID':            null, // int
            'Shared':             null, // boolean
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
            this.itemsLoading = false;
            this.lists = new Endeavour.Collection.Lists;
            this.listsLoaded = false;
            this.listsLoading = false;

            this.on('change:Created', this.onChangeCreated, this);
            this.on('change:Start', this.onChangeStart, this);
            this.on('change:Due', this.onChangeDue, this);
            this.on('change:OwnerID', this.onChangeOwnerID, this);

            this.on('sync', this.onSync, this);

            // Add this to global collection
            Endeavour.publish('new:model:list', this);
            
            if (this.get('OwnerID') != this.get('UserID')) {
                this.owner = new Endeavour.Model.User(this.get('Owner'));
            }

        },

        loadItems: function() {

            if (this.itemsLoading) return this;

            this.items.url = Endeavour.serverURL + '/lists/' + this.id + '/items';
            this.itemsLoading = true;

            this.items.fetch({
                success: $.proxy(this.onItemsLoaded, this),
                error: $.proxy(this.onItemsLoadError, this),
            });
            
            return this;
        },

        onItemsLoaded: function() {
            this.itemsLoading = false;
            this.itemsLoaded = true;
            return this;
        },

        onItemsError: function() {
            this.itemsLoading = false;
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

            if (this.listsLoading) return this;

            this.lists.url = Endeavour.serverURL + '/lists/' + this.id + '/lists';
            this.listsLoading = true;

            this.lists.fetch({
                success: $.proxy(this.onListsLoaded, this),
                error: $.proxy(this.onListsLoadError),
            });

            return this;

        },

        onListsLoaded: function() {
            this.listsLoading = false;
            this.listsLoaded = true;
            return this;
        },

        onListsLoadError: function() {
            this.listsLoading = false;
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

            if (parent.get('ParentID') == this.get('ID')) {
                Endeavour.alert({
                    message: 'You can\'t place a list inside it\'s self',
                });
                return this;
            }
            
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

        onChangeOwnerID: function() {
            if (this.get('OwnerID') != this.get('UserID')) {
                this.owner = new Endeavour.Model.User(this.get('Owner'));
            }
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
$(function() {

    window.Endeavour.View.ListItemsContainer = Backbone.Marionette.View.extend({

        tagName: 'div',
        className: 'list-items-container',

        initialize: function() {

            this.itemCollection = null;
            this.listCollection = null;
            this.addListItemInputVisible = false;

            this.emptyIndicatorExists = false;
            this.loadingIndicatorExists = false;

            this.singleListItemViews = [];
            this.singleListViews = [];
            this.els = {};

            this.activeSingleList = null;

            this.els.header = $('<div class="list-items-section-header">'
                + '<h3>My Lists</h3>'
                + '</div>');
            this.els.listContainer = $('<div class="list-items-container"></div>');

            this.els.headerTitle = this.els.header.find('h3');

            this.els.listList = $('<ul class="list-contents lists"></ul>');
            this.els.listItemList = $('<ul class="list-contents list-items"></ul>');

            this.els.listContainer
                .append(this.els.listList)
                .append(this.els.listItemList);

            this.$el
                .append(this.els.header)
                .append(this.els.addListItemInputContainer)
                .append(this.els.listContainer);

            if ('title' in this.options) {
                this.setTitle(this.options.title);
            }

            if ('collection' in this.options) {
                this.loadCollection();
            }

        },

        loadCollection: function() {
            
            var opts = this.options.collection;

            this.collection = new opts.type;
            this.collection.url = opts.url;

            this.collection.fetch({
                data: opts.data,
                success: $.proxy(this.onCollectionLoaded, this),
                error: $.proxy(this.onCollectionLoadError, this),
            });

            return this;

        },

        onCollectionLoaded: function() {

            for (var i = 0; i < this.collection.length; i++) {
                this.addSingleListItem(this.collection.at(i));
            }

        },

        onCollectionLoadError: function(jqxhr) {

            var self = this;
            var response = jqxhr.responseJSON;

            var message = response.error_description;

            Endeavour.alert({
                message: message,
            });

            return this;

        },

        render: function() {

            return this;

        },

        reloadData: function() {

            if (this.model) {

                this.model.loadLists();

                if (this.model instanceof Endeavour.Model.List) {
                    this.model.loadItems();
                }

            }

            return this;

        },

        reset: function() {
            if (this.model) this.unsetModel();
            this.clearList();
            return this;
        },

        setTitle: function(title) {
            this.els.headerTitle.text(title ? title : 'My Lists');
            return this;
        },

        /*




            ===================================
            MODEL FUNCTIONS
            ===================================

        */

        unbindModelEvents: function() {
            this.model.off('change', this.render, this);
            this.listCollection.off('add', this.onListCollectionAdd, this);
            this.listCollection.off('remove', this.onListCollectionRemove, this);
            this.listCollection.off('sync', this.onModelCollectionsSync, this);
            if (typeof this.itemCollection == 'object' && this.itemCollection.off) {
                this.itemCollection.off('add', this.onItemCollectionAdd, this);
                this.itemCollection.off('remove', this.onItemCollectionRemove, this);
                this.itemCollection.off('sync', this.onModelCollectionsSync, this);
            }
            return this;
        },

        bindModelEvents: function() {
            this.model.on('change', this.render, this);
            this.listCollection.on('add', this.onListCollectionAdd, this);
            this.listCollection.on('remove', this.onListCollectionRemove, this);
            this.listCollection.on('sync', this.onModelCollectionsSync, this);
            if (typeof this.itemCollection == 'object' && this.itemCollection.on) {
                this.itemCollection.on('add', this.onItemCollectionAdd, this);
                this.itemCollection.on('remove', this.onItemCollectionRemove, this);
                this.itemCollection.on('sync', this.onModelCollectionsSync, this);
            }
            return this;
        },

        unsetModel: function() {
            this.hideHeaderButtons();
            this.unbindModelEvents();
            this.els.headerTitle.html('');
            this.hideAddListItemInput();
            this.itemCollection = null;
            this.listCollection = null;
            this.model = null;
            return this;
        },

        setModel: function(model) {

            if (this.model) this.unsetModel();

            this.itemCollection = 'items' in model ? model.items : [];
            this.listCollection = model.lists;
            this.model = model;
            this.bindModelEvents();
            this.showHeaderButtons();

            this.render()
                .reloadData();

            this.clearList();

            if (this.listCollection.length + this.itemCollection.length < 1) {
                this.addLoadingIndicator();
                // if (!this.model.listLoaded) this.model.loadLists();
                // if ('itemsLoaded' in this.model && !this.model.itemsLoaded) this.model.loadItems();
            }
            else this.onModelCollectionsSync();

            for (var i = 0; i < this.listCollection.length; i++) {
                this.addSingleList(this.listCollection.at(i));
            }

            for (var i = 0; i < this.itemCollection.length; i++) {
                this.addSingleListItem(this.itemCollection.at(i));
            }

            return this;
        },

        onModelCollectionsSync: function(collection) {
            if (this.loadingIndicatorExists) this.removeLoadingIndicator();
            if (collection && collection.length + this.listCollection.length + this.itemCollection.length < 1) this.addEmptyIndicator();
            return this;
        },

        clearList: function() {

            for (var i = 0; i < this.singleListViews.length; i++) {
                this.singleListViews[i].close();
            }

            this.singleListViews = [];

            for (var i = 0; i < this.singleListItemViews.length; i++) {
                this.singleListItemViews[i].close();
            }

            this.singleListItemViews = [];

            this.els.list.html('');

            return this;

        },

        /*




            ===================================
            MODEL COLLECTION EVENT HANDLER FUNCTIONS
            ===================================

        */

        onListCollectionAdd: function(model) {
            return this.addSingleList(model);
        },

        onListCollectionRemove: function(model) {
            return this.removeSingleList(model);
        },

        onItemCollectionAdd: function(model) {
            return this.addSingleListItem(model);
        },

        onItemCollectionRemove: function(model) {
            return this.removeSingleListItem(model);
        },

        /*




            ===================================
            ON CLICK CALLBACKS
            ===================================

        */

        onSingleListItemClick: function(view) {
            // Endeavour.stage.currentView.listItemDetails.setModel(view.model);
            return this;
        },

        onSingleListClick: function(view) {
            // Endeavour.stage.currentView.onSingleListClick(view);
            return this;
        },

        /*




            ===================================
            ADD / REMOVE LIST & ITEM FUNCTIONS
            ===================================

        */

        addSingleList: function(model) {

            if (this.emptyIndicatorExists) this.removeEmptyIndicator();

            var view = new Endeavour.View.SingleList({
                model: model,
                showSubLists: false,
            });

            view.on('click', this.onSingleListClick, this);

            this.singleListViews[this.singleListViews.length] = view;

            this.els.listList.append(view.render().$el);

            return this;

        },

        removeSingleList: function(model) {

            var modelView = this.getSingleListViewByModelID(model.id);

            if (modelView) {
                this.singleListViews.splice(this.singleListViews.indexOf(modelView), 1);
                modelView.close();
            }

            return this;

        },

        addSingleListItem: function(model) {

            if (this.emptyIndicatorExists) this.removeEmptyIndicator();

            var view = new Endeavour.View.SingleListItem({
                model: model,
                linkToList: true,
            });

            view.on('click', this.onSingleListItemClick, this);

            this.singleListItemViews[this.singleListItemViews.length] = view;

            this.els.listItemList.append(view.render().$el);

            return this;

        },

        removeSingleListItem: function(model) {

            var modelView = this.getSingleListItemViewByModelID(model.id);

            if (modelView) {
                this.singleListItemViews.splice(this.singleListItemViews.indexOf(modelView), 1);
                modelView.close();
            }

            return this;

        },

        /*




            ===================================
            VIEW FINDING FUNCTIONS
            ===================================

        */

        getSingleListViewByModelID: function(modelID) {

            var predicate = function(view) { 
                return view.model.id == modelID; 
            };

            return _.find(this.singleListViews, predicate);

        },

        getSingleListItemViewByModelID: function(modelID) {

            var predicate = function(view) { 
                return view.model.id == modelID; 
            };

            return _.find(this.singleListItemViews, predicate);

        },

        /*




            ===================================
            INDICATOR FUNCTIONS
            ===================================

        */

        addEmptyIndicator: function() {

            if (this.emptyIndicatorExists) return this;
            if (this.loadingIndicatorExists) this.removeLoadingIndicator();

            this.els.emptyIndicator = $('<div class="indicator empty-indicator">List empty</div>');
            this.els.listContainer.append(this.els.emptyIndicator);
            this.emptyIndicatorExists = true;

            return this;

        },

        removeEmptyIndicator: function() {

            this.els.emptyIndicator.remove();
            this.els.emptyIndicator = null;
            this.emptyIndicatorExists = false;

            return this;
            
        },

        addLoadingIndicator: function() {

            if (this.loadingIndicatorExists) return this;
            if (this.emptyIndicatorExists) this.removeEmptyIndicator();

            this.els.loadingIndicator = $('<div class="indicator loading-indicator"><span class="icon"></span>Loading...</div>');
            this.els.listContainer.append(this.els.loadingIndicator);
            this.loadingIndicatorExists = true;

            return this;

        },

        removeLoadingIndicator: function() {

            this.els.loadingIndicator.remove();
            this.els.loadingIndicator = null;
            this.loadingIndicatorExists = false;

            return this;
            
        },

    });

});
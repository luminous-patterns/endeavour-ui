$(function() {

    window.Endeavour.View.AllLists = Backbone.Marionette.View.extend({

        id: 'all-lists',
        tagName: 'div',

        initialize: function() {

            this.collection = Endeavour.state.session.user.lists;

            this.flexi = null;

            this.listItems = new Endeavour.View.ListItemsSection;
            this.listItemDetails = new Endeavour.View.ListItemDetails;

            this.activeList = null;

            this.views = [];
            this.viewsByModelID = {};
            this.els = {};

            this.els.main = $('<div class="all-lists-flexi"></div>');

            this.height = 'height' in this.options ? this.options.height : 0;
            this.width = 'width' in this.options ? this.options.width : 0;

            this.activeSingleList = null;

            this.els.topButtons = $('<div class="top-buttons">'
                + '<div class="top-button">'
                + '<a class="add-new-list-button icon-add" href="#">List</a>'
                + '</div>'
                + '<div class="top-button">'
                + '<a class="add-new-list-item-button icon-add" href="#">List Item</a>'
                + '</div>'
                + '</div>');
            this.els.addNewListButton = this.els.topButtons.find('.add-new-list-button');
            this.els.addNewListItemButton = this.els.topButtons.find('.add-new-list-item-button');

            this.els.list = $('<ul class="lists"></ul>');

            this.$el
                .append(this.els.main);

            for (var i = 0; i < this.collection.length; i++) {
                this.addSingleList(this.collection.at(i));
            }

            this.collection.on('add', this.onCollectionAdd, this);
            this.collection.on('remove', this.onCollectionRemove, this);

            this.els.addNewListButton.on('click', $.proxy(this.onClickAddNewList, this));
            this.els.addNewListItemButton.on('click', $.proxy(this.onClickAddNewListItem, this));

            Endeavour.subscribe('list:active-model:changed', this.onListModelChange, this);

            if (Endeavour.state.getActiveModel('list')) {
                this.setListModel(Endeavour.state.getActiveModel('list'));
            }

            Endeavour.state.session.user.loadLists();

        },

        onListModelChange: function(model) {
            // return this.setListModel(model);
            this.setListItemsModel(model);
        },

        setListModel: function(model) {
            this.listItemDetails.reset();
            if (this.activeList) this.clearActiveListModel();
            this.activeList = model;
            this.bindListModelEvents();
            this.setListItemsModel(model);
            return this;
        },

        clearActiveListModel: function() {
            this.unbindListModelEvents();
            this.activeList = null;
        },

        onActiveListModelDestroy: function() {
            this.listItemDetails.reset();
            this.listItems.reset();
            this.clearActiveListModel();
        },

        unbindListModelEvents: function() {
            this.activeList.off('destroy', this.onActiveListModelDestroy, this);
        },

        bindListModelEvents: function() {
            this.activeList.on('destroy', this.onActiveListModelDestroy, this);
        },

        render: function() {

            if (!this.flexi) {
                this.initFlexi(this.height - 5, this.width);
            }
            else {
                this.flexi
                    .setDimensions(this.height - 5, this.width)
                    .render();
            }

            return this;

        },

        resize: function(height, width) {
            this.height = height;
            this.width = width;
            if (this.flexi) this.flexi.setDimensions(height - 5, width);
            return this;
        },

        initFlexi: function(height, width) {

            var flexi = this.flexi = new Endeavour.View.FlexiContainer({
                containerID: 'main',
                height: height - 5,
                width: width,
                margin: 10,
                spacing: 10,
            });

            this.els.main.append(flexi.$el);

            flexi.render();

            var leftCell = flexi.addCell({
                weight: 1,
                extraClassName: 'list-tree-cell',
            });
            var middleCell = flexi.addCell({
                weight: 1.5,
            });
            var rightCell = flexi.addCell({
                weight: 2.5,
            });

            leftCell.addContent({
                html: this.els.list,
            });

            middleCell.addContent({
                html: this.listItems.render().$el,
            });

            rightCell.addContent({
                html: this.listItemDetails.render().$el,
            });

            this.render();

        },

        onClickAddNewList: function(ev) {
            ev.preventDefault();
            Endeavour.publish('show:dialog', 'add-new-list');
            console.log('click add new list item');
            return this;
        },

        onClickAddNewListItem: function(ev) {
            ev.preventDefault();
            Endeavour.publish('show:dialog', 'add-new-list-item');
            console.log('click add new list item');
            return this;
        },

        /*




            ===================================
            COLLECTION FUNCTIONS
            ===================================

        */

        onCollectionAdd: function(model) {
            return this.addSingleList(model);
        },

        onCollectionRemove: function(model) {
            console.log('remove list',model);
            return this.removeSingleList(model);
        },

        onSingleListClick: function(view) {
            Endeavour.router.navigate('#/list/' + view.model.id, {trigger: true});
            return this;
        },

        setListItemsModel: function(model) {

            this.listItems.setModel(model);

            if ('itemsLoaded' in model && !model.itemsLoaded) model.loadItems();
            if (!model.listsLoaded) model.loadLists();

            // Endeavour.publish('active-model:set', 'list', model);

            // model.trigger('active-model:set');

            if (this.activeSingleList) {
                if (model.id == this.activeSingleList.model.id) return this;
                this.activeSingleList.clearActiveClass();
            }

            if (this.viewsByModelID[model.id]) {

                var view = this.viewsByModelID[model.id];

                this.activeSingleList = view;
                view.setActiveClass();

            }

        },

        addSingleList: function(model) {

            var view = new Endeavour.View.SingleList({
                model: model,
            });

            view.on('click', this.onSingleListClick, this);

            this.views[this.views.length] = view;
            this.viewsByModelID[view.model.id] = view;

            this.els.list.append(view.render().$el);

            return this;

        },

        removeSingleList: function(model) {

            var modelView = this.getViewByModelID(model.id);

            if (modelView) {
                this.views.splice(this.views.indexOf(modelView), 1);
                modelView.close();
            }

            return this;

        },

        getViewByModelID: function(modelID) {

            var predicate = function(view) { 
                return view.model.id == modelID; 
            };

            return _.find(this.views, predicate);

        },

    });

});
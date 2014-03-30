$(function() {

    window.Endeavour.View.AllLists = Backbone.Marionette.View.extend({

        id: 'all-lists',
        tagName: 'div',

        events: {
            'mousedown .list-resizer':     'onResizeMouseDown',
        },

        initialize: function() {

            this.collection = Endeavour.state.session.user.lists;

            this.listItems = new Endeavour.View.ListItemsSection;

            this.resizing = false;
            this.hasMoved = false;
            this.resizeCoords = {
                initial: {x: 0},
                last: {x: 0},
            };

            this.views = [];
            this.els = {};

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
            this.els.listResizer = $('<div class="list-resizer"></div>');

            this.els.mainArea = $('<div class="main-area"></div>');

            this.els.mainArea
                .append(this.els.list)
                .append(this.els.listResizer)
                .append(this.listItems.render().$el);

            this.$el
                .append(this.els.topButtons)
                .append("<h1>My Lists</h1>")
                .append(this.els.mainArea);

            for (var i = 0; i < this.collection.length; i++) {
                this.addSingleList(this.collection.at(i));
            }

            this.collection.on('add', this.onCollectionAdd, this);
            this.collection.on('remove', this.onCollectionRemove, this);

            this.els.addNewListButton.on('click', $.proxy(this.onClickAddNewList, this));
            this.els.addNewListItemButton.on('click', $.proxy(this.onClickAddNewListItem, this));

        },

        render: function() {

            this.setListsListWidth(200);

            return this;

        },

        setListsListWidth: function(width) {
            this.listWidth = width;
            this.els.list.css({width: width + 'px'});
            this.listItems.$el.css({left: width + 'px'})
            this.els.listResizer.css({left: width + 'px'});
            return this;
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

            if (this.activeSingleList) {
                if (view.model.id == this.activeSingleList.model.id) return this;
                this.activeSingleList.clearActiveClass();
            }

            this.activeSingleList = view;

            this.listItems.setCollection(view.model.items);

            if (!view.model.itemsLoaded) view.model.loadItems();

            Endeavour.publish('active-model:set', 'list', view.model);

            view.setActiveClass();

            return this;

        },

        addSingleList: function(model) {

            var view = new Endeavour.View.SingleList({
                model: model,
            });

            view.on('click', this.onSingleListClick, this);

            this.views[this.views.length] = view;

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

        /*




            ===================================
            RESIZE FUNCTIONS
            ===================================

        */

        resizeStart: function() {

            this.resizing = true;
            this.hasMoved = false;
            this.bindDragEvents();
            this.els.listResizer.addClass('resizing');

        },

        resizeMove: function(x) {

            if (!this.hasMoved) {
                this.resizeCoords.initial.x = x;
                this.resizeCoords.last.x = x;
                this.hasMoved = true;
                return;
            }

            var movedX = this.resizeCoords.last.x - x;

            this.resizeCoords.last.x = x;

            this.setListsListWidth(this.listWidth - movedX);

        },

        resizeEnd: function() {

            this.els.listResizer.removeClass('resizing');
            this.unbindDragEvents();
            this.resizing = false;

        },

        bindDragEvents: function() {

            $('body').on('mousemove', $.proxy(this.onBodyMouseMove, this));
            $('body').on('mouseup', $.proxy(this.onBodyMouseUp, this));

        },

        unbindDragEvents: function() {

            $('body').off('mousemove', $.proxy(this.onBodyMouseMove, this));
            $('body').off('mouseup', $.proxy(this.onBodyMouseUp, this));

        },

        onResizeMouseDown: function() {
            this.resizeStart();
        },

        onBodyMouseMove: function(ev) {
            ev.preventDefault();
            this.resizeMove(ev.pageX);
        },

        onBodyMouseUp: function() {
            this.resizeEnd();
        },

    });

});
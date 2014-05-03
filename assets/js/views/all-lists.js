$(function() {

    window.Endeavour.View.AllLists = Backbone.Marionette.View.extend({

        id: 'all-lists',
        tagName: 'div',

        events: {
            'mousedown .list-resizer':     'onResizeMouseDown',
        },

        initialize: function() {

            this.collection = Endeavour.state.session.user.lists;

            this.flexi = null;

            this.listItems = new Endeavour.View.ListItemsSection;
            this.listItemDetails = new Endeavour.View.ListItemDetails;

            this.resizing = false;
            this.hasMoved = false;
            this.resizeCoords = {
                initial: {x: 0},
                last: {x: 0},
            };

            this.views = [];
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
            this.els.listResizer = $('<div class="list-resizer"></div>');

            this.els.mainArea = $('<div class="main-area"></div>');

            // this.els.mainArea
            //     .append(this.els.list)
            //     .append(this.els.listResizer)
            //     .append(this.listItems.render().$el);

            this.$el
                .append(this.els.topButtons)
                .append("<h1>My Lists</h1>")
                .append(this.els.main);
                // .append(this.els.mainArea);

            for (var i = 0; i < this.collection.length; i++) {
                this.addSingleList(this.collection.at(i));
            }

            this.collection.on('add', this.onCollectionAdd, this);
            this.collection.on('remove', this.onCollectionRemove, this);

            this.els.addNewListButton.on('click', $.proxy(this.onClickAddNewList, this));
            this.els.addNewListItemButton.on('click', $.proxy(this.onClickAddNewListItem, this));

            Endeavour.subscribe('list:active-model:changed', this.onListModelChange, this);

        },

        onListModelChange: function() {
            this.listItemDetails.reset();
        },

        render: function() {

            // this.setListsListWidth(250);

            if (!this.flexi) {
                this.initFlexi(this.height - 100, this.width);
            }
            else {
                this.flexi
                    .setDimensions(this.height - 100, this.width)
                    .render();
            }

            return this;

        },

        resize: function(height, width) {
            this.height = height;
            this.width = width;
            if (this.flexi) this.flexi.setDimensions(height - 100, width);
            return this;
        },

        initFlexi: function(height, width) {

            var flexi = this.flexi = new Endeavour.View.FlexiContainer({
                containerID: 'main',
                height: height - 100,
                width: width,
                margin: 10,
                spacing: 10,
            });

            this.els.main.append(flexi.$el);

            flexi.render();

            // Add left cell
            var leftCell = flexi.addCell({
                weight: 1,
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

            // rightCell.addContent({
            //     html: 'Right cell',
            // });

            this.render();

        },

        setListsListWidth: function(width) {
            width = parseInt(width);
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
$(function() {

    window.Endeavour.View.ListItemsSection = Backbone.Marionette.View.extend({

        tagName: 'div',
        className: 'list-items-section',

        events: {
            'mousedown .details-resizer':     'onResizeMouseDown',
        },

        initialize: function() {

            this.collection = null;

            this.resizing = false;
            this.hasMoved = false;
            this.resizeCoords = {
                initial: {x: 0},
                last: {x: 0},
            };

            this.emptyIndicatorExists = false;
            this.loadingIndicatorExists = false;

            this.views = [];
            this.els = {};

            this.els.listContainer = $('<div class="list-items-container"><ul class="list-items"></ul></div>');
            this.els.list = this.els.listContainer.find('ul.list-items');

            this.$el.append(this.els.listContainer);

            if (this.options.collection) this.setCollection(this.options.collection);

        },

        render: function() {

            return this;

        },

        /*




            ===================================
            COLLECTION FUNCTIONS
            ===================================

        */

        setCollection: function(collection) {

            if (this.collection) {
                this.collection.off('add', this.onCollectionAdd, this);
                this.collection.off('remove', this.onCollectionRemove, this);
                this.collection.off('sync', this.onCollectionSync, this);
            }
            
            collection.on('add', this.onCollectionAdd, this);
            collection.on('remove', this.onCollectionRemove, this);
            collection.on('sync', this.onCollectionSync, this);
            this.collection = collection;

            this.clearList();

            if (collection.length < 1) {
                this.addLoadingIndicator();
                if (collection.url) collection.fetch();
            }
            else this.onCollectionSync();

            for (var i = 0; i < this.collection.length; i++) {
                this.addSingleListItem(this.collection.at(i));
            }

            return this;
        },

        clearList: function() {

            for (var i = 0; i < this.views.length; i++) {
                this.views[i].close();
            }

            this.views = [];

            this.els.list.html('');

            return this;

        },

        onCollectionAdd: function(model) {
            return this.addSingleListItem(model);
        },

        onCollectionRemove: function(model) {
            return this.removeSingleListItem(model);
        },

        onCollectionSync: function() {
            if (this.loadingIndicatorExists) this.removeLoadingIndicator();
            if (this.collection.length < 1) this.addEmptyIndicator();
            return this;
        },

        onSingleItemClick: function(view) {
            Endeavour.stage.currentView.listItemDetails.setModel(view.model);
            return this;
        },

        addSingleListItem: function(model) {

            if (this.emptyIndicatorExists) this.removeEmptyIndicator();

            var view = new Endeavour.View.SingleListItem({
                model: model,
            });

            view.on('click', this.onSingleItemClick, this);

            this.views[this.views.length] = view;

            this.els.list.append(view.render().$el);

            return this;

        },

        removeSingleListItem: function(model) {

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

        /*




            ===================================
            RESIZE FUNCTIONS
            ===================================

        */

        resizeStart: function() {

            this.resizing = true;
            this.hasMoved = false;
            this.bindDragEvents();
            this.els.detailsResizer.addClass('resizing');

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

            this.setDetailsWidth(this.detailsWidth + movedX);

        },

        resizeEnd: function() {

            this.els.detailsResizer.removeClass('resizing');
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
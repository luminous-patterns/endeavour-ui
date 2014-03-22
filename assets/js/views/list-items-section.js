$(function() {

    window.Endeavour.View.ListItemsSection = Backbone.Marionette.View.extend({

        tagName: 'div',
        className: 'list-items-section',

        initialize: function() {

            this.collection = null;

            this.emptyIndicatorExists = false;
            this.loadingIndicatorExists = false;

            this.views = [];
            this.els = {};

            this.els.list = $('<ul class="list-items"></ul>');

            this.$el.append(this.els.list);

            if (this.options.collection) this.setCollection(this.options.collection);

        },

        render: function() {

            return this;

        },

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

        addSingleListItem: function(model) {

            if (this.emptyIndicatorExists) this.removeEmptyIndicator();

            var view = new Endeavour.View.SingleListItem({
                model: model,
            });

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

        addEmptyIndicator: function() {

            if (this.emptyIndicatorExists) return this;
            if (this.loadingIndicatorExists) this.removeLoadingIndicator();

            this.els.emptyIndicator = $('<div class="indicator empty-indicator">List empty</div>');
            this.$el.append(this.els.emptyIndicator);
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
            this.$el.append(this.els.loadingIndicator);
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
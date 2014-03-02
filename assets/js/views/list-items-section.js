$(function() {

    window.Endeavour.View.ListItemsSection = Backbone.Marionette.View.extend({

        tagName: 'div',
        className: 'list-items-section',

        initialize: function() {

            this.collection = null;

            this.views = [];
            this.viewsByModelID = {};
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
            }
            
            collection.on('add', this.onCollectionAdd, this);
            this.collection = collection;

            this.clearList();

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
            this.viewsByModelID = {};

            this.els.list.html('');

            return this;

        },

        onCollectionAdd: function(model) {
            return this.addSingleListItem(model);
        },

        addSingleListItem: function(model) {
            var view = new Endeavour.View.SingleListItem({
                model: model,
            });
            this.views[this.views.length] = view;
            this.viewsByModelID[model.id] = view;
            this.els.list.append(view.render().$el);
            return this;
        },

    });

});
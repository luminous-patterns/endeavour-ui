$(function() {

    window.Endeavour.View.AllLists = Backbone.Marionette.View.extend({

        id: 'all-lists',
        tagName: 'div',

        initialize: function() {

            this.collection = Endeavour.state.session.user.lists;

            this.listItems = new Endeavour.View.ListItemsSection;

            this.views = [];
            this.viewsByModelID = {};
            this.els = {};

            this.els.list = $('<ul class="lists"></ul>');

            this.$el
                .append("<h1><em>All lists</em></h1>")
                .append(this.els.list)
                .append(this.listItems.render().$el);

            for (var i = 0; i < this.collection.length; i++) {
                this.addSingleList(this.collection.at(i));
            }

            this.collection.on('add', this.onCollectionAdd, this);

        },

        render: function() {

            return this;

        },

        onCollectionAdd: function(model) {
            return this.addSingleList(model);
        },

        onListItemClick: function(view) {
            console.log('clickin');
            this.listItems.setCollection(view.model.items);
            if (!view.model.getItems()) view.model.loadItems();
            return this;
        },

        addSingleList: function(model) {

            var view = new Endeavour.View.SingleList({
                model: model,
            });

            view.on('click', this.onListItemClick, this);

            this.views[this.views.length] = view;
            this.viewsByModelID[model.id] = view;

            this.els.list.append(view.render().$el);

            return this;

        },

    });

});
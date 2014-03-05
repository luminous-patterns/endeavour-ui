$(function() {

    window.Endeavour.View.AllLists = Backbone.Marionette.View.extend({

        id: 'all-lists',
        tagName: 'div',

        initialize: function() {

            this.collection = Endeavour.state.session.user.lists;

            this.listItems = new Endeavour.View.ListItemsSection;

            this.views = [];
            this.els = {};

            this.activeSingleList = null;

            this.els.list = $('<ul class="lists"></ul>');

            this.$el
                .append("<h1><em>All lists</em></h1>")
                .append(this.els.list)
                .append(this.listItems.render().$el);

            for (var i = 0; i < this.collection.length; i++) {
                this.addSingleList(this.collection.at(i));
            }

            this.collection.on('add', this.onCollectionAdd, this);
            this.collection.on('remove', this.onCollectionRemove, this);

        },

        render: function() {

            return this;

        },

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

    });

});
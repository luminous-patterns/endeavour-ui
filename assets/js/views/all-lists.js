$(function() {

    window.Endeavour.View.AllLists = Backbone.View.extend({

        id: 'all-lists',
        tagName: 'div',

        initialize: function() {

            this.views = [];
            this.viewsByModelID = {};

            this.$el
                .append("<h1><em>All lists</em></h1>");

            this.collection = Endeavour.state.session.user.lists;

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

        addSingleList: function(model) {
            var view = new Endeavour.View.SingleList({
                model: model,
            });
            this.views[this.views.length] = view;
            this.viewsByModelID[model.id] = view;
            this.$el.append(view.render().$el);
            return this;
        },

    });

});
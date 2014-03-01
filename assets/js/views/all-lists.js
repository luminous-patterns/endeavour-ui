$(function() {

    window.Endeavour.View.AllLists = Backbone.Marionette.View.extend({

        id: 'all-lists',
        tagName: 'div',

        initialize: function() {

            this.$el
                .append("<h1><em>All lists</em></h1>")
                .append("listy!");

        },

        render: function() {

            return this;

        },

    });

});
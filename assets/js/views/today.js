$(function() {

    window.Endeavour.View.Today = Backbone.Marionette.View.extend({

        id: 'today',
        tagName: 'div',

        initialize: function() {

            this.$el
                .append("<h1>Today</h1>")
                .append("your items for today");

        },

        render: function() {

            return this;

        },

    });

});
$(function() {

    window.Endeavour.View.Dashboard = Backbone.Marionette.View.extend({

        id: 'dashboard',
        tagName: 'div',

        initialize: function() {

            this.$el.append("dashing!");

        },

        render: function() {

            return this;

        },

    });

});
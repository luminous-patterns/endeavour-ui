$(function() {

    window.Endeavour.View.Sidebar = Backbone.Marionette.View.extend({

        id: 'main-sidebar',
        tagName: 'div',

        initialize: function() {

            this.$el.append("sidebarring!");

        },

        render: function() {

            return this;

        },

    });

});
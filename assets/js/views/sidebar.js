$(function() {

    window.Endeavour.View.Sidebar = Backbone.Marionette.View.extend({

        id: 'main-sidebar',
        tagName: 'div',

        template: function() {
            return $( '<div class="sidebar-item">'
                + '<a class="sidebar-button icon-add" href="#">Add new...</a>'
                + '</div>'
                + '<div class="sidebar-item">'
                + '<a class="sidebar-button icon-lists" href="#/lists">All lists</a>'
                + '</div>'
                + '<div class="sidebar-item">'
                + '<a class="sidebar-button icon-calendar" href="#/calendar">Calendar</a>'
                + '</div>'
                + '<div class="sidebar-item">'
                + '<a class="sidebar-button icon-today" href="#/today">Today</a>'
                + '</div>'
            );
        },

        initialize: function() {

            this.$el.append(this.template());

        },

        render: function() {

            return this;

        },

    });

});
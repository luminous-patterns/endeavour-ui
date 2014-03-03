$(function() {

    window.Endeavour.View.Calendar = Backbone.Marionette.View.extend({

        id: 'calendar',
        tagName: 'div',

        initialize: function() {

            this.$el
                .append("<h1>Calendar</h1>")
                .append("blah blah a pretty calendar");

        },

        render: function() {

            return this;

        },

    });

});
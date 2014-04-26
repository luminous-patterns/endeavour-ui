$(function() {

    window.Endeavour.View.FlexiContent = Backbone.Marionette.View.extend({

        tagName: 'div',
        className: 'flexi-content',

        initialize: function() {

        },

        render: function() {
            this.$el.html(this.options.html);
            return this;

        },

    });

});
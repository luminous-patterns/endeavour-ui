$(function() {

    window.Endeavour.View.SingleList = Backbone.Marionette.View.extend({

        tagName: 'li',
        className: 'single-list',

        events: {
            'click':  'onClick',
        },

        initialize: function() {
            
            this.$el.append(this.model.get('Title'));

        },

        onClick: function() {
            return this.trigger('click', this);
        },

        render: function() {
            return this;
        },

    });

});
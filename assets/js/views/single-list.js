$(function() {

    window.Endeavour.View.SingleList = Backbone.View.extend({

        tagName: 'div',
        className: 'single-list-item',

        initialize: function() {
            
            this.$el.append(this.model.get('Title'));

        },

        render: function() {
            return this;
        },

    });

});
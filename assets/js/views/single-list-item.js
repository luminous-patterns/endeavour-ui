$(function() {

    window.Endeavour.View.SingleListItem = Backbone.Marionette.View.extend({

        tagName: 'li',
        className: 'single-list-item',

        initialize: function() {
            
            this.$el.append(this.model.get('Summary'));

        },

        render: function() {
            return this;
        },

    });

});
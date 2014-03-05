$(function() {

    window.Endeavour.View.DragView = Backbone.Marionette.View.extend({

        tagName: 'div',
        className: 'drag-view',

        initialize: function() {

            this.$el.append(this.options.elem.text());

        },

        render: function() {

            return this;

        },

        setPosition: function(x, y) {
            this.$el.css({
                top: y,
                left: x,
            });
            return this;
        },

    });

});
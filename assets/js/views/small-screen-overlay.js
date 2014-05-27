$(function() {

    window.Endeavour.View.SmallScreenOverlay = Backbone.Marionette.View.extend({

        id: 'small-screen-overlay',
        tagName: 'div',

        els: {},

        initialize: function() {

            var stage = Endeavour.stage;
            var minHeight = stage.getMinHeight();
            var minWidth = stage.getMinWidth();
            
            var message = this.message = 'Window size must be at least<br />' + minWidth + 'x' + minHeight + ' pixels.';
            var messageContainerEl = this.els.messageContainer = $('<div class="message-container"></div>');

            messageContainerEl
                .html(message);

            this.$el
                .append(messageContainerEl);

        },

        render: function() {
            this.els.messageContainer.css({
                marginTop: (Endeavour.stage.height - this.els.messageContainer.height()) / 2,
            });
            return this;
        },

    });

});
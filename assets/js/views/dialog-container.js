$(function() {

    window.Endeavour.View.DialogContainer = Backbone.Marionette.View.extend({

        tagName: 'div',
        className: 'dialog-container',

        events: {
            'click':  'onClick',
        },

        initialize: function() {

            if (!('dialog' in this.options)) {
                console.error('No dialog included in options!');
            }

            this.dialog = this.options.dialog;

            if ('onCloseOverlay' in this.options) {
                this.onCloseOverlay = this.options.onCloseOverlay;
            }

            this.$el.append(this.dialog.render().$el);

            this.dialog.on('close', this.closeOverlay, this);

        },

        render: function() {
            return this;
        },

        focusDialogField: function() {
            this.dialog.focusField();
            return this;
        },

        onClick: function() {
            return this.closeOverlay();
        },

        closeOverlay: function() {
            if ('onCloseOverlay' in this && typeof this.onCloseOverlay == 'function') {
                this.onCloseOverlay();
            }
            return this.close();
        },

    });

});
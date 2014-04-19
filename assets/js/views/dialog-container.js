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

            if ('onCloseDialog' in this.options) {
                this.onCloseDialog = this.options.onCloseDialog;
            }

            this.$el.append(this.dialog.render().$el);

            this.dialog.on('close', this.onDialogClose, this);

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
            this.dialog.close();
            return this.close();
        },

        onDialogClose: function() {
            return this.close();
        },

        onClose: function() {
            if ('onCloseDialog' in this && typeof this.onCloseDialog == 'function') {
                this.onCloseDialog();
            }
        },

    });

});
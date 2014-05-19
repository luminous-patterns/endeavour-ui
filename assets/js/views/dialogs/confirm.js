$(function() {

    window.Endeavour.View.ConfirmDialog = Endeavour.View.Dialog.extend({

        events: {
            'click .yes-button':      'onClickYes',
            'click .no-button':       'onClickNo',
        },

        initialize: function() {

            Endeavour.View.Dialog.prototype.initialize.apply(this, arguments);

            this.confirmed = false;
            this.callbackTriggered = false;

            this.els.message = $('<p>' + this.options.message + '</p>');

            this.els.buttonSection = $('<div class="dialog-section button-section"></div>');
            this.els.yesButton = $('<button class="yes-button call-to-action">Yes</button>');
            this.els.noButton = $('<button class="no-button">No</button>');

            this.setTitle('Confirm');

            this.els.buttonSection.append(this.els.noButton)
                .append(this.els.yesButton);

            this.$el.append(this.els.message)
                .append(this.els.buttonSection);

            // this.on('close', this.onClose, this);

        },

        focusField: function() {
            this.els.noButton.focus();
            return this;
        },

        onClickYes: function() {
            this.confirmed = true;
            return this.closeDialog();
        },

        onClickNo: function() {
            return this.closeDialog();
        },

        onClose: function() {
            console.log('onclose');
            if (!this.callbackTriggered) {
                if (this.confirmed) {
                    if (this.options.onConfirm) {
                        this.options.onConfirm();
                    }
                }
                else {
                    if (this.options.onCancel) {
                        this.options.onCancel();
                    }
                }
                this.callbackTriggered = true;
            }
            return this;
        },

    });

});
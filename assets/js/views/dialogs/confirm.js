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

            this.els.yesButton = $('<button class="yes-button">Yes</button>');
            this.els.noButton = $('<button class="no-button">No</button>');

            this.$el.append(this.els.message)
                .append(this.els.yesButton)
                .append(this.els.noButton);

            // this.on('close', this.onClose, this);

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
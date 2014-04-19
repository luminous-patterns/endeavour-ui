$(function() {

    window.Endeavour.View.AlertDialog = Endeavour.View.Dialog.extend({

        events: {
            'click .ok-button':      'onClickOK',
        },

        initialize: function() {

            Endeavour.View.Dialog.prototype.initialize.apply(this, arguments);

            this.els.message = $('<p>' + this.options.message + '</p>');

            this.els.okButton = $('<button class="ok-button">OK</button>');

            this.$el.append(this.els.message)
                .append(this.els.okButton);

            // this.on('close', this.onClose, this);

        },

        onClickOK: function() {
            return this.closeDialog();
        },

        onClose: function() {
            console.log('onclose');
            if (this.options.callback) {
                this.options.callback();
            }
            return this;
        },

    });

});
$(function() {

    window.Endeavour.View.Login = Backbone.Marionette.View.extend({

        id: 'login',
        tagName: 'div',

        initialize: function() {

            this.els = {};

            this.els.emailAddressInput = $('<input type="text" />');
            this.els.passwordInput = $('<input type="password" />');
            this.els.rememberCheckbox = $('<input type="checkbox" />');
            this.els.submitButton = $('<button>Log in</button>');

            this.$el
                .append(this.els.emailAddressInput)
                .append(this.els.passwordInput)
                .append(this.els.rememberCheckbox)
                .append(this.els.submitButton);

            this.els.submitButton
                .on('click', $.proxy(this.onClickSubmit, this));

            console.log('### initialize stage view');
        },

        render: function() {
            console.log('### render stage view');
            return this;
        },

        getInputs: function() {

            var that = this;

            var inputs = {
                EmailAddress: that.els.emailAddressInput.val(),
                Password: that.els.passwordInput.val(),
                Remember: that.els.rememberCheckbox.is(':checked'),
            };

            return inputs;

        },

        onClickSubmit: function() {
            console.log('login submit',this.getInputs());
            return this;
        },

    });

});
$(function() {

    window.Endeavour.View.Login = Backbone.Marionette.View.extend({

        id: 'login',
        tagName: 'div',
        className: 'dialog',

        initialize: function() {

            this.els = {};
            this.validationErrorMessage = '';

            this.els.title = $('<div class="dialog-title">Endeavour Login</div>');

            this.els.emailAddressSection = $('<div class="dialog-section"><label for="email">Email Address</label><input type="email" id="email" /></div>');
            this.els.passwordSection = $('<div class="dialog-section"><label for="password">Password</label><input type="password" id="password" /></div>');
            this.els.rememberSection = $('<div class="dialog-section"><label for="remember"><input type="checkbox" id="remember" value="remember" /> Remember me</div>');

            this.els.emailAddressInput = this.els.emailAddressSection.find('#email');
            this.els.passwordInput = this.els.passwordSection.find('#password');
            this.els.rememberCheckbox = this.els.rememberSection.find('#remember')

            this.els.buttonSection = $('<div class="dialog-section button-section"><button class="call-to-action">Log in</button></div>');
            this.els.submitButton = this.els.buttonSection.find('.call-to-action');

            this.els.errorMessage = $('<div class="error-message"></div>');
            this.els.errorContainer = $('<div class="dialog-section error-section"></div>');

            this.els.errorContainer
                .append(this.els.errorMessage)
                .hide();

            this.$el
                .append(this.els.title)
                .append(this.els.emailAddressSection)
                .append(this.els.passwordSection)
                .append(this.els.rememberSection)
                .append(this.els.buttonSection)
                .prepend(this.els.errorContainer);

            this.els.submitButton
                .on('click', $.proxy(this.onClickSubmit, this));

            Endeavour.subscribe('session:login:failure', this.onInvalidLogin, this);

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

        validInputs: function() {

            var inputs = this.getInputs();

            if (!inputs.EmailAddress || inputs.EmailAddress.length < 3) {
                this.validationErrorMessage = 'Invalid Email Address';
                return false;
            }

            if (!inputs.Password || inputs.Password.length < 3) {
                this.validationErrorMessage = 'Invalid Password';
                return false;
            }

            return true;

        },

        showError: function(error) {
            this.els.errorMessage.html(error);
            this.els.errorContainer.show();
            return this;
        },

        hideError: function() {
            this.els.errorContainer.hide();
            return this;
        },

        onClickSubmit: function() {

            console.log('login submit',this.getInputs());

            if (this.validInputs()) {
                this.hideError();
                Endeavour.state.login(this.getInputs());
            }
            else {
                this.showError(this.validationErrorMessage);
            }

            return this;

        },

        onInvalidLogin: function(jsonResponse) {
            console.log('### invalid login', jsonResponse.responseJSON.error);
            this.showError('Invalid login');
            this.els.passwordInput.val('').focus();
            return this;
        },

    });

});
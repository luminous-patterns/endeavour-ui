$(function() {

    window.Endeavour.View.Login = Backbone.Marionette.View.extend({

        id: 'login',
        tagName: 'div',
        className: 'dialog',

        events: {
            'submit form':     'onSubmit',
        },

        initialize: function() {

            this.els = {};
            this.validationErrorMessage = '';

            this.els.title = $('<div class="dialog-title">Endeavour Login</div>');
            this.els.form = $('<form></form>');

            this.els.emailAddressSection = $('<div class="dialog-section"><label for="email">Email Address</label><input type="email" id="email" /></div>');
            this.els.passwordSection = $('<div class="dialog-section"><label for="password">Password</label><input type="password" id="password" /></div>');
            this.els.rememberSection = $('<div class="dialog-section"><label for="remember"><input type="checkbox" id="remember" value="remember" /> Remember me</div>');

            this.els.emailAddressInput = this.els.emailAddressSection.find('#email');
            this.els.passwordInput = this.els.passwordSection.find('#password');
            this.els.rememberCheckbox = this.els.rememberSection.find('#remember')

            this.els.buttonSection = $('<div class="dialog-section button-section"><div class="loading hidden"></div><div class="create-account-link"><span class="short-message">New user?</span><a href="#/create-account">Create an account</a></div><button type="submit" class="call-to-action">Log in</button></div>');
            this.els.submitButton = this.els.buttonSection.find('.call-to-action');
            this.els.loadingIndicator = this.els.buttonSection.find('.loading');

            this.els.form
                .append(this.els.emailAddressSection)
                .append(this.els.passwordSection)
                .append(this.els.rememberSection)
                .append(this.els.buttonSection);

            this.$el
                .append(this.els.title)
                .append(this.els.form);

            this.hideLoading();

            Endeavour.subscribe('session:login:failure', this.onInvalidLogin, this);

        },

        render: function() {
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

        onSubmit: function(ev) {

            ev.preventDefault();

            if (this.validInputs()) {
                this.showLoading();
                Endeavour.state.login(this.getInputs());
            }
            else {
                var that = this;
                Endeavour.alert({
                    message: this.validationErrorMessage,
                    callback: function() {
                        that.els.emailAddressInput.val('').focus();
                    },
                });
            }

            return this;

        },

        onInvalidLogin: function(jsonResponse) {
            this.hideLoading();
            if (jsonResponse.responseJSON.error == 'invalid_login') {
                var that = this;
                Endeavour.alert({
                    message:'Invalid login',
                    callback: function() {
                        that.els.passwordInput.val('').focus();
                    },
                });
            }
            return this;
        },

        showLoading: function() {
            this.els.loadingIndicator.show();
            return this;
        },

        hideLoading: function() {
            this.els.loadingIndicator.hide();
            return this;
        },

    });

});
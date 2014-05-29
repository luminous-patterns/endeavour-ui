$(function() {

    window.Endeavour.View.MyAccountEmail = Backbone.Marionette.View.extend({

        id: 'change-email',
        tagName: 'div',

        events: {
            'submit form': 'onFormSubmit',
        },

        initialize: function() {

            this.els = {};

            this.step = 1;

            this.els.currentEmailSection = $('<div class="input-section"><label for="CurrentEmail">Current Email Address</label><p class="email-address"></p></div>');
            this.els.currentEmailText = this.els.currentEmailSection.find('.email-address');

            this.els.currentPasswordSection = $('<div class="input-section"><label for="CurrentPassword">Current Password</label><input type="password" id="CurrentPassword" value="" /></div>');
            this.els.currentPasswordInput = this.els.currentPasswordSection.find('input');

            this.els.newEmailSection = $('<div class="input-section"><label for="NewEmail">New Email Address</label><input type="text" id="NewEmail" value="" /></div>');
            this.els.newEmailInput = this.els.newEmailSection.find('input');

            this.els.confirmEmailSection = $('<div class="input-section"><label for="ConfirmEmail">Confirm Email Address</label><input type="text" id="ConfirmEmail" value="" /></div>');
            this.els.confirmEmailInput = this.els.confirmEmailSection.find('input');

            this.els.submitSection = $('<div class="button-section"><button class="call-to-action">Save changes</button></div>');
            this.els.submitButton = this.els.submitSection.find('button');

            this.els.newEmailTextSection = $('<div class="input-section"><label for="NewEmailText">New Email Address</label><p class="email-address"></p></div>');
            this.els.newEmailText = this.els.newEmailTextSection.find('.email-address');

            this.els.verificationCodeSection = $('<div class="input-section"><label for="VerificationCode">10-Digit Verification Code</label><input type="text" id="VerificationCode" value="" /><p class="input-note"><em>(We sent it to your new email address)</em></p></div>');
            this.els.verificationCodeInput = this.els.verificationCodeSection.find('input');

            this.els.verifyButtonSection = $('<div class="button-section"><button class="call-to-action">Verify email</button></div>');
            this.els.verifyButton = this.els.verifyButtonSection.find('button');

            this.els.steps = [];

            this.els.steps[0] = $('<div class="change-email-step-1"></div>');

            this.els.steps[0]
                .append(this.els.currentPasswordSection)
                .append(this.els.newEmailSection)
                .append(this.els.confirmEmailSection)
                .append(this.els.submitSection);

            this.els.steps[1] = $('<div class="change-email-step-2"></div>');

            this.els.steps[1]
                .append(this.els.newEmailTextSection)
                .append(this.els.verificationCodeSection)
                .append(this.els.verifyButtonSection);

            this.els.form = $('<form></form>');

            this.els.form
                .append(this.els.currentEmailSection)
                .append(this.els.steps[0])
                .append(this.els.steps[1]);

            this.$el
                .append('<h2>Change Email Address</h2>')
                .append(this.els.form);

            this.setStep(1);

            Endeavour.state.session.user.on('change', this.render, this);

        },

        render: function() {

            if (Endeavour.state.session.user) {
                this.els.currentEmailText.text(Endeavour.state.session.user.get('EmailAddress'));
            }

            return this;

        },

        getInputs: function(step) {

            var inputs = {};

            switch (step) {
                case 1:
                    inputs = {
                        currentPassword: this.els.currentPasswordInput.val(),
                        newEmailAddress: this.els.newEmailInput.val(),
                        confirmEmailAddress: this.els.confirmEmailInput.val(),
                    };
                    break;
                case 2:
                    inputs = {
                        newEmailAddress: this.els.newEmailInput.val(),
                        verificationCode: this.els.verificationCodeInput.val(),
                    };
                    break;
            }

            return inputs;
        },

        onFormSubmit: function(ev) {

            ev.preventDefault();

            switch (this.step) {

                case 1:
                    this.submitEmailChangeRequest();
                    break;

                case 2:
                    this.submitEmailAddressVerification();
                    break;

            }

            return this;

        },

        submitEmailChangeRequest: function() {

            var inputs = this.getInputs(1);
            var options = {
                currentPassword: inputs.currentPassword,
                newEmailAddress: inputs.newEmailAddress,
                confirmEmailAddress: inputs.confirmEmailAddress,
                success: $.proxy(this.onValidChangeRequest, this),
                error: $.proxy(this.onInvalidChangeRequest, this),
            };

            if (!inputs.currentPassword || !inputs.newEmailAddress || !inputs.confirmEmailAddress) {
                Endeavour.alert({
                    message: 'Please complete all fields',
                })
                return this;
            }

            this.showLoading()
                .disableButtons();

            Endeavour.state.session.user.changeEmailAddress(options);

        },

        onValidChangeRequest: function() {

            this.setStep(2);

            this.els.newEmailText.text(this.els.newEmailInput.val());

            this.hideLoading()
                .enableButtons();

        },

        onInvalidChangeRequest: function(jqxhr) {

            var self = this;
            var response = jqxhr.responseJSON;

            this.hideLoading()
                .enableButtons();

            var message = response.error_description;
            var callback = function() {};

            switch (response.error) {
                case 'incorrect_password':
                    callback = function() {
                        self.els.currentPasswordInput.val('').focus();
                    }
                    break;
                case 'email_mismatch':
                    callback = function() {
                        self.els.confirmEmailInput.val('');
                        self.els.newEmailInput.val('').focus();
                    }
                    break;
                case 'invalid_new_email':
                    callback = function() {
                        self.els.confirmEmailInput.val('');
                        self.els.newEmailInput.val('').focus();
                    }
                    break;
            }

            Endeavour.alert({
                message: message,
                callback: callback,
            });

            return this;

        },

        submitEmailAddressVerification: function() {

            var inputs = this.getInputs(2);
            var options = {
                newEmailAddress: inputs.newEmailAddress,
                verificationCode: inputs.verificationCode,
                success: $.proxy(this.onValidVerification, this),
                error: $.proxy(this.onInvalidVerification, this),
            };

            if (!inputs.verificationCode) {
                Endeavour.alert({
                    message: 'Please enter the 10-digit verification code sent to "' + inputs.newEmailAddress + '"',
                })
                return this;
            }

            this.showLoading()
                .disableButtons();

            Endeavour.state.session.user.verifyEmailAddress(options);

        },

        onValidVerification: function() {

            Endeavour.state.session.user.fetch();

            this.hideLoading()
                .enableButtons();

            this.setStep(1);
            this.clearInputs();

            Endeavour.alert({
                message: "Your email address has been updated",
                callback: function() {
                    Endeavour.router.navigate('#/my-account', {trigger: true, replace: true})
                },
            });

        },

        onInvalidVerification: function(jqxhr) {

            var self = this;
            var response = jqxhr.responseJSON;

            this.hideLoading()
                .enableButtons();

            var message = response.error_description;
            var callback = function() {};

            switch (response.error) {
                case 'invalid_verification_code':
                    callback = function() {
                        self.els.verificationCodeInput.val('').focus();
                    }
                    break;
            }

            Endeavour.alert({
                message: message,
                callback: callback,
            });

            return this;

        },

        showLoading: function() {

            return this;
        },

        hideLoading: function() {

            return this;
        },

        enableButtons: function() {
            this.els.submitButton.removeAttr('disabled');
            this.els.verifyButton.removeAttr('disabled');
            return this;
        },

        disableButtons: function() {
            this.els.submitButton.attr('disabled', 'disabled');
            this.els.verifyButton.attr('disabled', 'disabled');
            return this;
        },

        clearInputs: function() {
            this.els.currentPasswordInput.val('');
            this.els.newEmailInput.val('');
            this.els.confirmEmailInput.val('');
            this.els.verificationCodeInput.val('');
            return this;
        },

        setStep: function(step) {

            this.step = step;

            for (var i = 0; i < this.els.steps.length; i++) {
                this.els.steps[i].hide();
            }

            this.els.steps[step-1].show();

            return this;

        },

    });

});
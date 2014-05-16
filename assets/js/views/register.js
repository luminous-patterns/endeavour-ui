$(function() {

    window.Endeavour.View.Register = Backbone.Marionette.View.extend({

        id: 'register',
        tagName: 'div',
        className: 'dialog',

        initialize: function() {

            this.els = {};
            this.validationErrorMessage = '';

            this.els.title = $('<div class="dialog-title">Endeavour Registration</div>');

            this.els.firstNameSection = $('<div class="dialog-section"><label for="email">First Name</label><input type="email" id="first-name" /></div>');
            this.els.lastNameSection = $('<div class="dialog-section"><label for="email">Last Name</label><input type="email" id="last-name" /></div>');
            this.els.emailAddressSection = $('<div class="dialog-section"><label for="email">Email Address</label><input type="email" id="email" /></div>');
            this.els.confirmEmailSection = $('<div class="dialog-section"><label for="email">Confirm Email Address</label><input type="email" id="confirm-email" /></div>');
            this.els.timeZoneSection = $('<div class="dialog-section"><label for="time-zone">Time Zone</label><select id="time-zone"><option>Australia/Melbourne</option></select></div>');
            this.els.newsletterSection = $('<div class="dialog-section"><label for="newsletter"><input type="checkbox" id="newsletter" value="newsletter" checked="checked" /> Subscribe to our monthly newsletter</div>');

            this.els.firstNameInput = this.els.firstNameSection.find('#first-name');
            this.els.lastNameInput = this.els.lastNameSection.find('#last-name');
            this.els.emailAddressInput = this.els.emailAddressSection.find('#email');
            this.els.confirmEmailInput = this.els.confirmEmailSection.find('#confirm-email');
            this.els.timeZoneSelect = this.els.timeZoneSection.find('#time-zone');
            this.els.newsletterCheckbox = this.els.newsletterSection.find('#newsletter')

            this.els.buttonSection = $('<div class="dialog-section button-section"><button class="call-to-action">Complete registration</button></div>');
            this.els.submitButton = this.els.buttonSection.find('.call-to-action');

            this.els.errorMessage = $('<div class="error-message"></div>');
            this.els.errorContainer = $('<div class="dialog-section error-section"></div>');

            this.els.errorContainer
                .append(this.els.errorMessage)
                .hide();

            this.$el
                .append(this.els.title)
                .append(this.els.firstNameSection)
                .append(this.els.lastNameSection)
                .append(this.els.emailAddressSection)
                .append(this.els.confirmEmailSection)
                .append(this.els.timeZoneSection)
                .append(this.els.newsletterSection)
                .append(this.els.buttonSection)
                .prepend(this.els.errorContainer);

            this.els.submitButton
                .on('click', $.proxy(this.onClickSubmit, this));

        },

        render: function() {
            return this;
        },

        getInputs: function() {

            var that = this;

            var inputs = {
                FirstName: that.els.firstNameInput.val(),
                LastName: that.els.lastNameInput.val(),
                EmailAddress: that.els.emailAddressInput.val(),
                ConfirmEmail: that.els.confirmEmailInput.val(),
                TimeZone: that.els.timeZoneSelect.val(),
                MailingList: that.els.newsletterCheckbox.is(':checked'),
            };

            return inputs;

        },

        validInputs: function() {

            var inputs = this.getInputs();

            if (!inputs.FirstName || inputs.FirstName.length < 3) {
                this.validationErrorMessage = 'Invalid First Name';
                return false;
            }

            if (!inputs.LastName || inputs.LastName.length < 3) {
                this.validationErrorMessage = 'Invalid Last Name';
                return false;
            }

            if (!inputs.EmailAddress || inputs.EmailAddress.length < 3) {
                this.validationErrorMessage = 'Invalid Email Address';
                return false;
            }

            if (!inputs.ConfirmEmail || inputs.EmailAddress != inputs.ConfirmEmail) {
                this.validationErrorMessage = 'Email address does not match';
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

            // if (this.validInputs()) {
            //     this.hideError();
            //     Endeavour.state.login(this.getInputs());
            // }
            // else {
            //     this.showError(this.validationErrorMessage);
            // }

            return this;

        },

        onInvalidSubmission: function(jsonResponse) {
            console.log('### invalid registration', jsonResponse.responseJSON.error);
            // if (jsonResponse.responseJSON.error == 'invalid_login') {
            //     this.showError('Invalid login');
            //     this.els.passwordInput.val('').focus();
            // }
            return this;
        },

    });

});

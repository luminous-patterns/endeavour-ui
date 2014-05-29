$(function() {

    window.Endeavour.View.Register = Backbone.Marionette.View.extend({

        id: 'register',
        tagName: 'div',
        className: 'dialog',

        events: {
            'submit form':   'onSubmit',
        },

        initialize: function() {

            this.els = {};
            this.validationErrorMessage = '';

            this.els.title = $('<div class="dialog-title">Endeavour Registration</div>');
            this.els.form = $('<form></form>');

            this.els.firstNameSection = $('<div class="dialog-section"><label for="email">First Name</label><input type="text" id="first-name" /></div>');
            this.els.lastNameSection = $('<div class="dialog-section"><label for="email">Last Name</label><input type="text" id="last-name" /></div>');
            this.els.emailAddressSection = $('<div class="dialog-section"><label for="email">Email Address</label><input type="email" id="email" /></div>');
            this.els.confirmEmailSection = $('<div class="dialog-section"><label for="email">Confirm Email Address</label><input type="email" id="confirm-email" /></div>');
            this.els.timeZoneSection = $('<div class="dialog-section"><label for="time-zone">Time Zone</label><select id="time-zone"><option>Australia/Melbourne</option></select></div>');
            this.els.newsletterSection = $('<div class="dialog-section"><label for="newsletter"><input type="checkbox" id="newsletter" value="newsletter" /> Subscribe to our monthly newsletter</div>');

            this.els.firstNameInput = this.els.firstNameSection.find('#first-name');
            this.els.lastNameInput = this.els.lastNameSection.find('#last-name');
            this.els.emailAddressInput = this.els.emailAddressSection.find('#email');
            this.els.confirmEmailInput = this.els.confirmEmailSection.find('#confirm-email');
            this.els.timeZoneSelect = this.els.timeZoneSection.find('#time-zone');
            this.els.newsletterCheckbox = this.els.newsletterSection.find('#newsletter')

            this.els.buttonSection = $('<div class="dialog-section button-section"><div class="loading hidden"></div><button type="submit" class="call-to-action">Complete registration</button></div>');
            this.els.submitButton = this.els.buttonSection.find('.call-to-action');
            this.els.loadingIndicator = this.els.buttonSection.find('.loading');

            this.els.form
                .append(this.els.firstNameSection)
                .append(this.els.lastNameSection)
                .append(this.els.emailAddressSection)
                .append(this.els.confirmEmailSection)
                .append(this.els.timeZoneSection)
                .append(this.els.newsletterSection)
                .append(this.els.buttonSection);

            this.$el
                .append(this.els.title)
                .append(this.els.form);

            this.hideLoading();

            this.loadTimeZones();

        },

        render: function() {
            return this;
        },

        loadTimeZones: function() {

            Endeavour.get({
                url: '/timezones',
                success: $.proxy(this.onTimeZoneDataReturn, this),
                error: function(){ Endeavour.alert({message:"Failed to retreive time zones list"}) },
            });

        },

        onTimeZoneDataReturn: function(timeZones) {

            for (var i = 0; i < timeZones.length; i++) {
                this.addTimeZoneOption(timeZones[i]);
            }

        },

        addTimeZoneOption: function(timeZone) {
            this.els.timeZoneSelect.append('<option>' + timeZone + '</option>');
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

        onSubmit: function(ev) {
            ev.preventDefault();
            this.submitRegistration();
            return this;
        },

        onInvalidSubmission: function(jqxhr) {

            var self = this;
            var response = jqxhr.responseJSON;

            this.hideLoading();
            this.enableSubmit();

            console.log('### invalid registration', response.error);

            var message = 'Invalid registration';
            var callback = function() {};

            switch (response.error) {
                case 'fields_missing':
                    message = "Please complete all fields";
                    break;
                case 'invalid_email':
                    message = "Please enter a valid email address";
                    callback = function() {
                        self.els.emailAddressInput.focus();
                    }
                    break;
                case 'email_mismatch':
                    message = "E-mail addresses do not match";
                    callback = function() {
                        self.els.confirmEmailInput.focus();
                    }
                    break;
                case 'email_already_registered':
                    message = "E-mail address is already registered";
                    callback = function() {
                        self.els.emailAddressInput.focus();
                    }
                    break;
            }

            Endeavour.alert({
                message: message,
                callback: callback,
            });

            return this;

        },

        submitRegistration: function() {

            this.showLoading();
            this.disableSubmit();

            Endeavour.post({
                url: '/register',
                data: this.getInputs(),
                success: $.proxy(this.onValidSubmission, this),
                error: $.proxy(this.onInvalidSubmission, this),
            });

        },

        onValidSubmission: function(jsonResponse) {
            this.hideLoading();
            Endeavour.alert({
                message:"Looks good!  Your password has been emailed to you =)",
                callback: function() { Endeavour.router.navigate('#/login', {trigger: true, replace: true}); },
            });
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

        disableSubmit: function() {
            this.els.submitButton.attr('disabled', 'disabled');
            return this;
        },

        enableSubmit: function() {
            this.els.submitButton.removeAttr('disabled');
            return this;
        },

    });

});

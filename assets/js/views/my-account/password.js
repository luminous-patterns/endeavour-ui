$(function() {

    window.Endeavour.View.MyAccountPassword = Backbone.Marionette.View.extend({

        id: 'change-password',
        tagName: 'div',

        events: {
            'submit form': 'onFormSubmit',
        },

        initialize: function() {

            this.els = {};

            this.els.currentPasswordSection = $('<div class="input-section"><label for="CurrentPassword">Current Password</label><input type="password" id="CurrentPassword" value="" /></div>');
            this.els.currentPasswordInput = this.els.currentPasswordSection.find('input');

            this.els.newPasswordSection = $('<div class="input-section"><label for="NewPassword">New Password</label><input type="password" id="NewPassword" value="" /></div>');
            this.els.newPasswordInput = this.els.newPasswordSection.find('input');

            this.els.confirmPasswordSection = $('<div class="input-section"><label for="ConfirmPassword">Confirm Password</label><input type="password" id="ConfirmPassword" value="" /></div>');
            this.els.confirmPasswordInput = this.els.confirmPasswordSection.find('input');

            this.els.submitSection = $('<div class="button-section"><button class="call-to-action">Save changes</button><div class="loading"></div></div>');
            this.els.submitButton = this.els.submitSection.find('button');
            this.els.loadingIndicator = this.els.submitSection.find('.loading');

            this.els.form = $('<form></form>');

            this.els.form
                .append(this.els.currentPasswordSection)
                .append(this.els.newPasswordSection)
                .append(this.els.confirmPasswordSection)
                .append(this.els.submitSection);

            this.$el
                .append('<h2>Change Password</h2>')
                .append(this.els.form);

            this.hideLoading();

        },

        render: function() {

            return this;

        },

        getInputs: function() {
            return {
                currentPassword: this.els.currentPasswordInput.val(),
                newPassword: this.els.newPasswordInput.val(),
                confirmPassword: this.els.confirmPasswordInput.val(),
            };
        },

        onFormSubmit: function(ev) {

            ev.preventDefault();

            var inputs = this.getInputs();

            if (!inputs.newPassword || !inputs.confirmPassword || !inputs.currentPassword) {
                Endeavour.alert({
                    message: 'Please complete all fields',
                })
                return this;
            }

            this.showLoading()
                .disableButtons();

            var options = {
                currentPassword: inputs.currentPassword,
                newPassword: inputs.newPassword,
                confirmPassword: inputs.confirmPassword,
                success: $.proxy(this.onValidSubmission, this),
                error: $.proxy(this.onInvalidSubmission, this),
            };

            Endeavour.state.session.user.changePassword(options);

        },

        onInvalidSubmission: function(jqxhr) {

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
                case 'password_mismatch':
                    callback = function() {
                        self.els.confirmPasswordInput.val('');
                        self.els.newPasswordInput.val('').focus();
                    }
                    break;
                case 'invalid_new_password':
                    callback = function() {
                        self.els.confirmPasswordInput.val('');
                        self.els.newPasswordInput.val('').focus();
                    }
                    break;
            }

            Endeavour.alert({
                message: message,
                callback: callback,
            });

            return this;

        },

        onValidSubmission: function(response) {

            this.resetForm();

            Endeavour.alert({
                message: 'Your password has been updated',
            });

            return this;

        },

        resetForm: function() {
            this.els.currentPasswordInput.val('');
            this.els.newPasswordInput.val('');
            this.els.confirmPasswordInput.val('');
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

        enableButtons: function() {
            this.els.submitButton.removeAttr('disabled');
            return this;
        },

        disableButtons: function() {
            this.els.submitButton.attr('disabled', 'disabled');
            return this;
        },

    });

});
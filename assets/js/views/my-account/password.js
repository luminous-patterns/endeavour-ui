$(function() {

    window.Endeavour.View.MyAccountPassword = Backbone.Marionette.View.extend({

        id: 'change-password',
        tagName: 'div',

        initialize: function() {

            this.els = {};

            this.els.currentPasswordSection = $('<div class="input-section"><label for="CurrentPassword">Current Password</label><input type="password" id="CurrentPassword" value="" /></div>');
            this.els.currentPasswordInput = this.els.currentPasswordSection.find('input');

            this.els.newPasswordSection = $('<div class="input-section"><label for="NewPassword">New Password</label><input type="password" id="NewPassword" value="" /></div>');
            this.els.newPasswordInput = this.els.newPasswordSection.find('input');

            this.els.confirmPasswordSection = $('<div class="input-section"><label for="ConfirmPassword">Confirm Password</label><input type="password" id="ConfirmPassword" value="" /></div>');
            this.els.confirmPasswordInput = this.els.confirmPasswordSection.find('input');

            this.els.submitSection = $('<div class="button-section"><button class="call-to-action">Save changes</button></div>');
            this.els.submitButton = this.els.submitSection.find('button');

            this.$el
                .append('<h2>Change Password</h2>')
                .append(this.els.currentPasswordSection)
                .append(this.els.newPasswordSection)
                .append(this.els.confirmPasswordSection)
                .append(this.els.submitSection);

        },

        render: function() {

            return this;

        },

    });

});
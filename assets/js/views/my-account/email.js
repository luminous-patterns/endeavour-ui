$(function() {

    window.Endeavour.View.MyAccountEmail = Backbone.Marionette.View.extend({

        id: 'change-email',
        tagName: 'div',

        initialize: function() {

            this.els = {};

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

            this.$el
                .append('<h2>Change Email</h2>')
                .append(this.els.currentEmailSection)
                .append(this.els.currentPasswordSection)
                .append(this.els.newEmailSection)
                .append(this.els.confirmEmailSection)
                .append(this.els.submitSection);

            Endeavour.state.session.user.on('change', this.render, this);

        },

        render: function() {

            if (Endeavour.state.session.user) {
                this.els.currentEmailText.html(Endeavour.state.session.user.get('EmailAddress'));
            }

            return this;

        },

    });

});
$(function() {

    window.Endeavour.View.MyAccountProfile = Backbone.Marionette.View.extend({

        id: 'profile',
        tagName: 'div',

        events: {
            'submit form': 'onFormSubmit',
        },

        initialize: function() {

            this.els = {};

            this.els.firstNameSection = $('<div class="input-section"><label for="FirstName">First Name</label><input type="text" id="FirstName" value="" /></div>');
            this.els.lastNameSection = $('<div class="input-section"><label for="LastName">Last Name</label><input type="text" id="LastName" value="" /></div>');
            this.els.timeZoneSection = $('<div class="input-section"><label for="time-zone">Time Zone</label><select id="time-zone"></select></div>');
            this.els.submitSection = $('<div class="button-section"><button class="call-to-action">Save changes</button><div class="loading"></div></div>');

            this.els.firstNameInput = this.els.firstNameSection.find('input');
            this.els.lastNameInput = this.els.lastNameSection.find('input');
            this.els.submitButton = this.els.submitSection.find('button');
            this.els.timeZoneSelect = this.els.timeZoneSection.find('select');
            this.els.loadingIndicator = this.els.submitSection.find('.loading');

            this.els.form = $('<form></form>');

            this.els.form
                .append(this.els.firstNameSection)
                .append(this.els.lastNameSection)
                .append(this.els.timeZoneSection)
                .append(this.els.submitSection);

            this.$el
                .append('<h2>Profile &amp; Preferences</h2>')
                .append(this.els.form);

            Endeavour.state.session.user.on('change', this.render, this);

            this.els.timeZoneSelect.attr('disabled', 'disabled');
            this.loadTimeZones();

        },

        render: function() {

            var userModel = Endeavour.state.session.user;

            if (!userModel) {
                Endeavour.alert({message: "Invalid user"});
                return this;
            }

            this.els.firstNameInput.val(userModel.get('FirstName'));
            this.els.lastNameInput.val(userModel.get('LastName'));
            this.els.timeZoneSelect.val(userModel.get('TimeZone'));

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
            
            this.els.timeZoneSelect.removeAttr('disabled');

        },

        addTimeZoneOption: function(timeZone) {
            var selected = Endeavour.state.session.user.get('TimeZone') == timeZone ? 'selected="selected"' : '';
            this.els.timeZoneSelect.append('<option ' + selected + '>' + timeZone + '</option>');
            return this;
        },

        getInputs: function() {
            return {
                FirstName: this.els.firstNameInput.val(),
                LastName: this.els.lastNameInput.val(),
                TimeZone: this.els.timeZoneSelect.val(),
            };
        },

        onFormSubmit: function(ev) {

            ev.preventDefault();

            var inputs = this.getInputs();

            if (!inputs.FirstName || !inputs.LastName || !inputs.TimeZone) {
                Endeavour.alert({
                    message: 'Please complete all fields',
                });
                return this;
            }

            this.showLoading()
                .disableButtons();

            var options = {
                success: $.proxy(this.onValidSubmission, this),
                error: $.proxy(this.onInvalidSubmission, this),
                patch: true,
            };

            Endeavour.state.session.user.save(inputs, options);

        },

        onInvalidSubmission: function(jqxhr) {

            var self = this;
            var response = jqxhr.responseJSON;

            this.hideLoading()
                .enableButtons();

            Endeavour.alert({
                message: response.error_description,
            });

            return this;

        },

        onValidSubmission: function() {

            this.hideLoading()
                .enableButtons()
                .render();

            Endeavour.alert({
                message: 'Your profile has been updated',
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
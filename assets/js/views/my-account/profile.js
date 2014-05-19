$(function() {

    window.Endeavour.View.MyAccountProfile = Backbone.Marionette.View.extend({

        id: 'profile',
        tagName: 'div',

        initialize: function() {

            this.els = {};

            this.els.firstNameSection = $('<div class="input-section"><label for="FirstName">First Name</label><input type="text" id="FirstName" value="" /></div>');
            this.els.lastNameSection = $('<div class="input-section"><label for="LastName">Last Name</label><input type="text" id="LastName" value="" /></div>');
            this.els.timeZoneSection = $('<div class="input-section"><label for="time-zone">Time Zone</label><select id="time-zone"></select></div>');
            this.els.submitSection = $('<div class="button-section"><button class="call-to-action">Save changes</button></div>');

            this.els.firstNameInput = this.els.firstNameSection.find('input');
            this.els.lastNameInput = this.els.lastNameSection.find('input');
            this.els.submitButton = this.els.submitSection.find('button');
            this.els.timeZoneSelect = this.els.timeZoneSection.find('select');

            this.$el
                .append('<h2>Profile &amp; Preferences</h2>')
                .append(this.els.firstNameSection)
                .append(this.els.lastNameSection)
                .append(this.els.timeZoneSection)
                .append(this.els.submitSection);

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
            this.els.timeZoneSelect.val(Endeavour.state.session.user.get('TimeZone'));

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

    });

});
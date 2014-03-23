$(function() {

    window.Endeavour.View.Dialog = Backbone.Marionette.View.extend({

        tagName: 'div',
        className: 'dialog',

        events: {
            'click':                 'onClick',
            'click .call-to-action': 'onClickSubmit',
            'click .cancel':         'onClickCancel',
            'submit form':           'onSubmitForm',
        },

        fields: [{
            type: 'plaintext',
            value: 'No fields!',
            pos: 1,
        }],

        initialize: function() {

            this.els = {};
            this.validationErrorMessage = '';

            this.els.title = $('<div class="dialog-title">Add List</div>');
            this.els.form = $('<form></form>');

            this.els.buttonSection = $('<div class="dialog-section button-section"><button type="button" class="cancel">Cancel</button><button type="submit" class="call-to-action">Create</button></div>');
            this.els.submitButton = this.els.buttonSection.find('.call-to-action');
            this.els.cancelButton = this.els.buttonSection.find('.cancel');

            this.els.errorMessage = $('<div class="error-message"></div>');
            this.els.errorContainer = $('<div class="dialog-section error-section"></div>');

            this.els.errorContainer
                .append(this.els.errorMessage)
                .hide();

            this.$el
                .append(this.els.title)
                .append(this.els.form)
                .prepend(this.els.errorContainer);

            this.createFormEls();

            this.els.form.append(this.els.buttonSection);

            console.log('### initialize dialog');

        },

        sortFields: function(field) {
            return field.pos;
        },

        createFormEls: function() {

            var orderedFields = this.orderedFields = _.sortBy(this.fields, this.sortFields);

            for (var i = 0; i < orderedFields.length; i++) {

                var field = orderedFields[i];

                switch (field.type) {
                    case 'plaintext':
                        field.containerEl = $('<div class="plaintext"><div>' + field.value + '</div></div>');
                        field.$el = field.containerEl.find('div');
                        break;
                    case 'input':
                        field.containerEl = $('<div class="dialog-section">'
                            + '<label for="' + field.id + '">' + field.label + '</label>'
                            + '<input type="text" id="' + field.id + '" class="full-width" value="' + field.value + '" />'
                            + '</div>');
                        field.$el = field.containerEl.find('#' + field.id);
                        break;
                    case 'textarea':
                        field.containerEl = $('<div class="dialog-section">'
                            + '<label for="' + field.id + '">' + field.label + '</label>'
                            + '<textarea id="' + field.id + '" class="full-width">' + field.value + '</textarea>'
                            + '</div>');
                        field.$el = field.containerEl.find('#' + field.id);
                        break;
                    case 'datetime':
                        field.containerEl = $('<div class="dialog-section">'
                            + '<label for="' + field.id + '-year">Due on</label>'
                            + '<div class="input date-input"><input type="text" id="' + field.id + '-year" value="YYYY" /><span>-</span><input type="text" id="' + field.id + '-month" value="MM" /><span>-</span><input type="text" id="' + field.id + '-date" value="DD" /></div>'
                            + ' @ '
                            + '<div class="input time-input"><input type="text" id="' + field.id + '-hour" value="HH" /><span>:</span><input type="text" id="' + field.id + '-minute" value="MM" /></div>'
                            + '<input type="hidden" id="' + field.id + '" value="' + field.value + '" />'
                            + '</div>');
                        field.containerEl.find('input').on('change', $.proxy(this.onDateTimeInputChange, field));
                        field.$el = field.containerEl.find('#' + field.id);
                        break;
                }

                this.els.form.append(field.containerEl);

            }

            return this;

        },

        render: function() {
            console.log('### render dialog');
            return this;
        },

        focusField: function() {
            this.orderedFields[0].$el.focus();
            return this;
        },

        getInputs: function() {

            var inputs = {};

            _.each(this.fields, function(field) {
                inputs[field.inputKey] = field.$el.val();
            });

            return inputs;

        },

        submit: function() {
            console.log('no submit handler set',this.getInputs());
            return this;
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

        closeDialog: function() {
            this.trigger('close');
            return this.close();
        },

        onClick: function(ev) {
            ev.stopPropagation();
            return this;
        },

        onClickSubmit: function(ev) {
            ev.preventDefault();
            return this.submit();
        },

        onClickCancel: function(ev) {
            ev.preventDefault();
            return this.closeDialog();
        },

        onSubmitForm: function(ev) {
            ev.preventDefault();
            return this.submit();
        },

        onDateTimeInputChange: function(ev) {

            // Context of a field item
            var field = this;

            // The changed el
            var el = $(ev.target);
            console.log(field,this,el);

            if (el.attr('id') == field.id) return;

            var yearEl = field.$el.find('#' + field.id + '-year');
            var monthEl = field.$el.find('#' + field.id + '-month');
            var dateEl = field.$el.find('#' + field.id + '-date');

            var hourEl = field.$el.find('#' + field.id + '-hour');
            var minuteEl = field.$el.find('#' + field.id + '-minute');

            var yyyy = !yearEl.val() || yearEl.val() == 'YYYY' ? '2014' : yearEl.val();
            var mo = !monthEl.val() || monthEl.val() == 'MM' ? '01' : monthEl.val();
            var dd = !dateEl.val() || dateEl.val() == 'DD' ? '01' : dateEl.val();
            var hh = !hourEl.val() || hourEl.val() == 'HH' ? '00' : hourEl.val();
            var mi = !minuteEl.val() || minuteEl.val() == 'MM' ? '00' : minuteEl.val();

            field.$el.val(yyyy + '-' + mo + '-' + dd + ' ' + hh + ':' + mi + ':00');

        },

    });

});
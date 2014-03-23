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

            this.els.buttonSection = $('<div class="dialog-section button-section"><button class="cancel">Cancel</button><button class="call-to-action">Create</button></div>');
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
                .append(this.els.buttonSection)
                .prepend(this.els.errorContainer);

            this.createFormEls();

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

        onClickSubmit: function() {
            return this.submit();
        },

        onClickCancel: function() {
            return this.closeDialog();
        },

        onSubmitForm: function(ev) {
            ev.preventDefault();
            return this.submit();
        },

    });

});
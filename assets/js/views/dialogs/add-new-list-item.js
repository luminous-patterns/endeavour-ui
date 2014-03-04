$(function() {

    window.Endeavour.View.DialogAddNewListItem = Backbone.Marionette.View.extend({

        id: 'add-new-dialog',
        tagName: 'div',
        className: 'dialog',

        events: {
            'click':  'onClick',
        },

        initialize: function() {

            this.els = {};
            this.validationErrorMessage = '';

            this.els.title = $('<div class="dialog-title">Add List Item</div>');

            this.els.summarySection = $('<div class="dialog-section"><label for="summary">Summary</label><input type="text" id="summary" class="full-width" /></div>');
            this.els.summaryInput = this.els.summarySection.find('#summary');

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
                .append(this.els.summarySection)
                .append(this.els.buttonSection)
                .prepend(this.els.errorContainer);

            this.els.submitButton.on('click', $.proxy(this.onClickSubmit, this));
            this.els.cancelButton.on('click', $.proxy(this.onClickCancel, this));

            this.$el.on('keypress', $.proxy(this.onKeyPress, this));

            console.log('### initialize stage view');

        },

        render: function() {
            console.log('### render stage view');
            return this;
        },

        focusField: function() {
            this.els.summaryInput.focus();
            return this;
        },

        getInputs: function() {

            var that = this;

            var inputs = {
                Summary: that.els.summaryInput.val(),
            };

            return inputs;

        },

        validInputs: function() {

            var inputs = this.getInputs();

            if (!inputs.Summary || inputs.Summary.length < 3) {
                this.validationErrorMessage = 'Invalid Summary';
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

        submit: function() {

            var activeListModel = Endeavour.state.getActiveModel('list');

            if (activeListModel) {
                activeListModel.createItem(this.getInputs());
                return this.closeDialog();
            }

            return this;

        },

        onKeyPress: function(ev) {
            if (event.which == 13) {
                return this.submit();
            }
        },

        onClick: function(ev) {
            ev.stopPropagation();
            return this;
        },

        onClickSubmit: function() {

            console.log('add new list item submit',this.getInputs());

            return this.submit();

        },

        onClickCancel: function() {
            return this.closeDialog();
        },

        closeDialog: function() {
            this.trigger('close');
            return this.close();
        },

    });

});
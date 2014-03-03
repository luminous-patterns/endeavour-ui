$(function() {

    window.Endeavour.View.DialogAddNewList = Backbone.Marionette.View.extend({

        id: 'add-new-dialog',
        tagName: 'div',
        className: 'dialog',

        events: {
            'click':  'onClick',
        },

        initialize: function() {

            this.els = {};
            this.validationErrorMessage = '';

            this.els.title = $('<div class="dialog-title">Add List</div>');

            this.els.listTitleSection = $('<div class="dialog-section"><label for="list-title">Title</label><input type="text" id="list-title" /></div>');
            this.els.listTitleInput = this.els.listTitleSection.find('#list-title');

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
                .append(this.els.listTitleSection)
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
            this.els.listTitleInput.focus();
            return this;
        },

        getInputs: function() {

            var that = this;

            var inputs = {
                Title: that.els.listTitleInput.val(),
            };

            return inputs;

        },

        validInputs: function() {

            var inputs = this.getInputs();

            if (!inputs.Title || inputs.Title.length < 3) {
                this.validationErrorMessage = 'Invalid Title';
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
            Endeavour.state.session.user.createList(this.getInputs());
            return this.closeDialog();
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

            console.log('add new list submit',this.getInputs());

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
$(function() {

    window.Endeavour.View.ListItemDetails = Backbone.Marionette.View.extend({

        tagName: 'div',
        className: 'list-item-details',

        events: {
            'click .reset':      'onClickReset',
            'click .save':       'onClickSave',
            'keypress input':    'onChangeInput',
            'keypress textarea': 'onChangeInput',
        },

        initialize: function() {

            this.emptyIndicatorExists = false;
            this.loadingIndicatorExists = false;
            this.detailsLoaded = false;

            this.views = [];
            this.els = {};

            this.els.summaryContainer = $('<div class="item-summary input-row"><label>Summary</label><div class="input-container"><input class="fullwidth" /></div></div>');
            this.els.summaryInput = this.els.summaryContainer.find('input');

            this.els.dueDateContainer = $('<div class="item-due input-row"><label>Due Date</label><div class="input-container"><input class="fullwidth" /></div></div>');
            this.els.dueDateInput = this.els.dueDateContainer.find('input');

            this.els.tagsContainer = $('<div class="item-tags input-row"><label>Tags</label><div class="input-container"><input class="fullwidth" /></div></div>');
            this.els.tagsInput = this.els.tagsContainer.find('input');

            this.els.inputsContainer = $('<div class="input-rows"></div>');

            this.els.buttons = $('<div class="buttons"><div class="button-container"><button class="reset">Reset</button></div><div class="button-container"><button class="save">Save</button></div></div>');
            this.els.resetButton = this.els.buttons.find('.reset');
            this.els.saveButton = this.els.buttons.find('.save');

            this.els.inputsContainer
                .append(this.els.summaryContainer)
                .append(this.els.dueDateContainer)
                .append(this.els.tagsContainer);

            this.els.header = $('<div class="item-details-header"></div>');
            this.els.detailsInput = $('<textarea class="item-details"></textarea>');

            this.els.header
                .append(this.els.inputsContainer)
                .append(this.els.buttons);

            this.$el
                .append(this.els.header)
                .append(this.els.detailsInput);

        },

        render: function() {

            if (this.model) {

                this.enableInputs();

                this.els.summaryInput.val(this.model.get('Summary'));

                if (this.model.due) this.els.dueDateInput.val(this.model.due.toString());
                else this.els.dueDateInput.val('');

                if (this.model.detailsLoaded) {
                    this.els.detailsInput.val(this.model.details.get('Body'))
                }
                else {
                    this.els.detailsInput.val('');
                    this.model.loadDetails();
                }

            }
            else {
                this.disableInputs();
            }

            this.disableButtons();

            return this;

        },

        save: function() {

            // Save ListItem model
            this.model.save({
                Summary: this.els.summaryInput.val(),
            }, {patch: true})

            // Save ListItemDetails model
            this.model.details.save({Body: this.els.detailsInput.val()}, {patch: true});

            return this;

        },

        setModel: function(model) {

            if (this.model) {
                this.model.off('loaded:details', this.onDetailsLoaded, this);
            }

            this.model = model;
            this.render();

            model.on('loaded:details', this.onDetailsLoaded, this);

            return this;

        },

        disableButtons: function() {
            this.els.resetButton.attr('disabled', 'disabled');
            this.els.saveButton.attr('disabled', 'disabled');
            return this;
        },

        enableButtons: function() {
            this.els.resetButton.removeAttr('disabled');
            this.els.saveButton.removeAttr('disabled');
            return this;
        },

        onChangeInput: function() {
            this.enableButtons();
            return this;
        },

        onClickReset: function() {
            return this.render();
        },

        onClickSave: function() {
            return this.save();
        },

        onDetailsLoaded: function() {
            return this.render()
        },

        enableInputs: function() {
            this.els.summaryInput.removeAttr('disabled');
            this.els.dueDateInput.removeAttr('disabled');
            this.els.tagsInput.removeAttr('disabled');
            this.els.detailsInput.removeAttr('disabled');
            return this;
        },

        disableInputs: function() {
            this.els.summaryInput.attr('disabled', 'disabled');
            this.els.dueDateInput.attr('disabled', 'disabled');
            this.els.tagsInput.attr('disabled', 'disabled');
            this.els.detailsInput.attr('disabled', 'disabled');
            return this;
        },

    });

});
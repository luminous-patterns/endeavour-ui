$(function() {

    window.Endeavour.View.ListItemDetails = Backbone.Marionette.View.extend({

        tagName: 'div',
        className: 'list-item-details',

        events: {

            'click h2':                          'onClickTitle',
            'blur .inline-summary-input':        'onBlurInlineSummaryInput',
            'keydown .inline-summary-input':     'onKeydownInlineSummaryInput',

            'blur .item-details':                'onBlurItemDetailsInput',

            'click .add-due-date button':        'onClickAddDueDateButton',
            'click .due-date-text':              'onClickDueDateText',
            'click .clear-due-date':             'onClickClearDueDateButton',

        },

        initialize: function() {

            this.emptyIndicatorExists = false;
            this.loadingIndicatorExists = false;
            this.detailsLoaded = false;

            this.datePicker = null;

            this.views = [];
            this.els = {};

            var headerEl = this.els.header = $('<div class="item-details-header"></div>');
            var actionBarEl = this.els.actionBar = $('<div class="item-details-actions"></div>');
            var fullDetailsSectionEl = this.els.fullDetailsSection = $('<div class="item-details-body"></div>');

            var summaryEl = this.els.summary = $('<h2></h2>');
            var inlineSummaryInputContainerEl = this.els.inlineSummaryInputContainer = $('<div class="input-container"><input type="text" class="inline-summary-input fullwidth" /></div>');
            var inlineSummaryInputEl = this.els.inlineSummaryInput = inlineSummaryInputContainerEl.find('input');
            
            var dueDateContainerEl = this.els.dueDateContainer = $('<div class="due-date-container"></div>');
            var addDueDateEl = this.els.addDueDate = $('<div class="add-due-date"><button class="action-bar-button">Set due date</button></div>');
            var addDueDateButtonEl = this.els.addDueDateButton = addDueDateEl.find('button');
            var dueDateEl = this.els.dueDate = $('<div class="due-date"><span class="due-date-label">Due</span><div class="due-date-text"></div><button class="clear-due-date action-bar-button">Clear</button></div>');
            var dueDateTextEl = this.els.dueDateText = dueDateEl.find('.due-date-text');

            var fullDetailsEl = this.els.fullDetails = $('<div class="full-details"></div>');
            var inlineDetailsInputEl = this.els.inlineDetailsInput = $('<textarea class="item-details"></textarea>');

            headerEl
                .append(summaryEl)
                .append(inlineSummaryInputContainerEl.hide());

            dueDateContainerEl
                .append(dueDateEl)
                .append(addDueDateEl);

            actionBarEl
                .append(dueDateContainerEl);

            fullDetailsSectionEl
                .append(inlineDetailsInputEl);

            this.$el
                .append(headerEl)
                .append(actionBarEl)
                .append(fullDetailsSectionEl);

            this.disableDetailsInput();

        },

        render: function() {

            if (this.model) {

                this.show()
                    .renderModelElements();

            }
            else {
                this.hide();
            }

            return this;

        },

        renderModelElements: function() {

            this.els.inlineSummaryInput.val(this.model.get('Summary'));
            this.els.summary.text(this.model.get('Summary'));

            var dueDate = this.model.getDueDate();
            if (dueDate) {
                this.els.addDueDate.hide();
                this.els.dueDate.show();
                this.els.dueDateText.html(dueDate.toDateString());
            }
            else {
                this.els.addDueDate.show();
                this.els.dueDate.hide();
                this.els.dueDateText.html('');
            }

            if (this.model.detailsLoaded) {
                this.enableDetailsInput();
                this.els.inlineDetailsInput.val(this.model.details.get('Body'))
            }
            else {
                this.disableDetailsInput();
                this.els.inlineDetailsInput.val('');
                this.model.loadDetails();
            }

            return this;

        },

        show: function() {
            this.$el.show();
            return this;
        },

        hide: function() {
            this.$el.hide();
            return this;
        },

        reset: function() {
            console.log('resetting');
            this.unsetModel();
            return this.render();
        },

        unsetModel: function() {
            if (this.model) this.unbindModelEvents();
            this.model = null;
            return this;
        },

        onListItemDestroy: function() {
            console.log('onListItemDestroy');
            return this.reset();
        },

        unbindModelEvents: function() {
            this.model.off('loaded:details', this.onDetailsLoaded, this);
            this.model.off('destroy', this.onListItemDestroy, this);
            this.model.off('change', this.render, this);
            return this;
        },

        bindModelEvents: function() {
            this.model.on('loaded:details', this.onDetailsLoaded, this);
            this.model.on('destroy', this.onListItemDestroy, this);
            this.model.on('change', this.render, this);
            return this;
        },

        setModel: function(model) {

            if (this.model) {
                this.unbindModelEvents();
            }

            this.model = model;
            this.render();

            this.bindModelEvents();

            return this;

        },

        onClickTitle: function() {
            return this.editSummary();
        },

        editSummary: function() {
            this.els.summary.hide();
            this.els.inlineSummaryInputContainer.show();
            this.els.inlineSummaryInput.select();
            return this;
        },

        finishedEditingSummary: function() {
            var Summary = this.els.inlineSummaryInput.val();
            if (Summary != this.model.get('Summary')) {
                this.model.save({Summary: Summary}, {patch: true})
            }
            this.els.inlineSummaryInputContainer.hide();
            this.els.summary.show();
            return this;
        },

        cancelEditSummary: function() {
            this.els.inlineSummaryInputContainer
                .val(this.model.get('Summary'))
                .hide();
            this.els.summary.show();
            return this.render();
        },

        onBlurInlineSummaryInput: function() {
            return this.finishedEditingSummary();
        },

        onBlurItemDetailsInput: function() {

            var detailsBody = this.els.inlineDetailsInput.val();

            if (detailsBody == this.model.details.get('Body')) {
                return this;
            }

            this.model.details.save({Body: detailsBody}, {patch: true});

            return this.render();

        },

        onKeydownInlineSummaryInput: function(ev) {

            var which = ev.which;

            if (which != 13 && which != 27) {
                return this;
            }

            if (which == 13) {
                
                // Prevent new line
                ev.preventDefault();

                // Finished editing summary
                return this.finishedEditingSummary();

            }

            if (which == 27) {
                return this.cancelEditSummary();
            }

        },

        onClickClearDueDateButton: function(ev) {
            this.model.save({Due: null}, {patch: true});
            return this.renderModelElements();
        },

        showDueDatePicker: function() {

            if (this.datePicker) return this;

            var datePickerOptions = {

            };

            var dueDate = this.model.getDueDate();
            if (dueDate) datePickerOptions.selectedDate = new Date(dueDate.toJSON());

            var datePicker = this.datePicker = new Endeavour.View.DatePicker(datePickerOptions);

            this.els.dueDateContainer.append(datePicker.render().$el);

            datePicker.on('date-selected', function(date) {
                this.model.save({Due: date.toJSON()}, {patch: true});
                this.closeDatePicker();
                this.renderModelElements();
            }, this);

            this.bindBodyClickEvents();

            return this;

        },

        onClickDueDateText: function(ev) {
            ev.stopPropagation();
            return this.showDueDatePicker();
        },

        onClickAddDueDateButton: function(ev) {
            ev.stopPropagation();
            return this.showDueDatePicker();
        },

        onDetailsLoaded: function() {
            this.enableDetailsInput();
            this.els.inlineDetailsInput.val(this.model.details.get('Body'));
            return this;
        },

        onBodyClick: function(ev) {
            this.unbindBodyClickEvents();
            this.closeDatePicker();
        },

        closeDatePicker: function() {
            if (!this.datePicker) return this;
            this.datePicker.close();
            this.datePicker = null;
            return this;
        },
        
        bindBodyClickEvents: function() {
            $('body').on('click', $.proxy(this.onBodyClick, this));
        },

        unbindBodyClickEvents: function() {
            $('body').off('click', $.proxy(this.onBodyClick, this));
        },

        disableDetailsInput: function() {
            this.els.inlineDetailsInput.attr('disabled', 'disabled');
            return this;
        },

        enableDetailsInput: function() {
            this.els.inlineDetailsInput.removeAttr('disabled');
            return this;

        },

    });

});
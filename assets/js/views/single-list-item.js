$(function() {

    window.Endeavour.View.SingleListItem = Backbone.Marionette.View.extend({

        tagName: 'li',
        className: 'single-list-item',

        events: {
            'dblclick .summary':           'onClickSummary',
        },

        inputMinSize: 25,
        inputMaxSize: 100,

        initialize: function() {
            
            this.els = {};

            this.$el.addClass('list-item-' + this.model.id);

            this.els.summary = $('<div class="summary"></div>');
            this.els.summaryInput = $('<input class="summary-input-inline" value="" />');
            this.els.checkbox = $('<div class="checkbox"></div>');

            this.els.checkbox.html('<div class="outline"><div class="indicator"></div></div>');

            this.$el
                .append(this.els.summary)
                .append(this.els.summaryInput.hide())
                .append(this.els.checkbox);

            this.els.checkbox.on('click', $.proxy(this.onClickCheckbox, this));
            this.els.summaryInput.bind('blur', $.proxy(this.onSummaryInputBlur, this));
            this.els.summaryInput.bind('keydown', $.proxy(this.onSummaryInputKeyDown, this));

            this.model.on('change', this.render, this);

        },

        render: function() {

            this.els.summary.html(this.model.get('Summary'));
            this.els.summaryInput.val(this.model.get('Summary'));

            if (this.model.get('Completed')) {
                this.els.checkbox.addClass('checked');
            }
            else {
                this.els.checkbox.removeClass('checked');
            }

            return this;

        },

        editSummary: function() {
            this.els.summary.hide();
            this.els.summaryInput.show().focus();
            return this;
        },

        saveSummary: function() {
            var newSummary = this.els.summaryInput.val().trim();
            if (this.model.get('Summary') != newSummary) {
                this.model.save({Summary: newSummary}, {patch: true});
            }
            this.finishedEditingSummary();
            return this;
        },

        finishedEditingSummary: function() {
            this.els.summaryInput.hide();
            this.els.summary.show();
            return this;
        },

        onClickSummary: function() {
            this.editSummary();
            return this;
        },

        onClickCheckbox: function() {
            this.model.toggleComplete();
            return this;
        },

        onSummaryInputBlur: function(ev) {
            this.saveSummary();
            return this;
        },

        onSummaryInputKeyDown: function(ev) {
            var inputEl = this.els.summaryInput;
            inputEl.attr('size', Math.min(this.inputMaxSize, Math.max(this.inputMinSize, inputEl.val().length + Number(inputEl.val().length * 0.1))));
            if (ev.which == 13) {
                this.saveSummary();
            }
            return this;
        },

    });

});
$(function() {

    window.Endeavour.View.SingleListItem = Backbone.Marionette.View.extend({

        tagName: 'li',
        className: 'single-list-item',

        events: {

            'dblclick .summary':                'onClickSummary',
            'click .delete':                    'onClickDelete',

            // Drag & drop
            'mousedown':                        'onMouseDown',

        },

        inputMinSize: 25,
        inputMaxSize: 100,

        initialize: function() {
            
            this.els = {};
            this.dragging = false;
            this.hasMoved = false;
            this.dragView = null;
            this.dragCoords = {
                initial: {x: 0, y: 0},
                last: {x: 0, y: 0},
            };

            this.$el.addClass('list-item-' + this.model.id);

            this.els.summary = $('<div class="summary"></div>');
            this.els.summaryInput = $('<input class="summary-input-inline" value="" />');
            this.els.checkbox = $('<div class="checkbox"></div>');
            this.els.deleteButton = $('<div class="delete"></div>');

            this.els.checkbox.html('<div class="outline"><div class="indicator"></div></div>');

            this.$el
                .append(this.els.summary)
                .append(this.els.summaryInput.hide())
                .append(this.els.checkbox)
                .append(this.els.deleteButton);

            this.els.checkbox.on('click', $.proxy(this.onClickCheckbox, this));
            this.els.summaryInput.bind('blur', $.proxy(this.onSummaryInputBlur, this));
            this.els.summaryInput.bind('keydown', $.proxy(this.onSummaryInputKeyDown, this));
            this.els.summaryInput.bind('mousedown', $.proxy(this.onSummaryInputMousedown, this));

            this.model.on('change', this.render, this);

        },

        render: function() {

            this.els.summary.html(this.model.get('Summary'));
            this.els.summaryInput.val(this.model.get('Summary'));
            this.els.summaryInput.attr('size', Math.min(this.inputMaxSize, Math.max(this.inputMinSize, this.els.summaryInput.val().length + Number(this.els.summaryInput.val().length * 0.1))));

            if (this.model.get('Completed')) {
                this.els.checkbox.addClass('checked');
                this.$el.addClass('complete');
            }
            else {
                this.els.checkbox.removeClass('checked');
                this.$el.removeClass('complete');
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

        onClickDelete: function() {
            this.deleteModel();
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

        onSummaryInputMousedown: function(ev) {
            ev.stopImmediatePropagation();
            return this;
        },

        deleteModel: function() {
            this.model.destroy();
            return this.close();
        },

        onMouseDown: function() {
            this.dragStart();
        },

        onBodyMouseMove: function(ev) {
            this.dragMove(ev.pageX, ev.pageY);
        },

        onBodyMouseUp: function() {
            this.dragEnd();
        },

        bindDragEvents: function() {

            $('body').on('mousemove', $.proxy(this.onBodyMouseMove, this));
            $('body').on('mouseup', $.proxy(this.onBodyMouseUp, this));

        },

        unbindDragEvents: function() {

            $('body').off('mousemove', $.proxy(this.onBodyMouseMove, this));
            $('body').off('mouseup', $.proxy(this.onBodyMouseUp, this));

        },

        dragStart: function() {

            this.dragging = true;
            this.hasMoved = false;
            this.bindDragEvents();

        },

        dragMove: function(x, y) {

            if (!this.hasMoved) {
                this.dragCoords.initial.x = x;
                this.dragCoords.initial.y = y;
                this.hasMoved = true;
                return;
            }

            this.dragCoords.last.x = x;
            this.dragCoords.last.y = y;

            // Load DragView on first mouse move.
            // Improves performance of click and dblclick
            if (this.hasMoved && !this.dragView) {
                if ((this.dragCoords.initial.x + 5) > this.dragCoords.last.x
                    || (this.dragCoords.initial.y + 5) > this.dragCoords.last.y) {
                    this.dragView = new Endeavour.View.DragView({elem: this.$el.clone(), model: this.model});
                    $('body').append(this.dragView.render().$el);
                    Endeavour.publish('drag:start', this.dragView);
                }
                else {
                    return;
                }
            }

            this.dragView.setPosition(x + 10, y + 10);

        },

        dragEnd: function() {

            this.unbindDragEvents();
            this.dragging = false;

            if (this.hasMoved) {
                this.hasMoved = false;
                if (this.dragView) {
                    this.dragView.close();
                    this.dragView = null;
                    Endeavour.publish('drag:end');
                }
            }

        },

    });

});
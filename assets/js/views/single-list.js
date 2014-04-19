$(function() {

    window.Endeavour.View.SingleList = Backbone.Marionette.View.extend({

        tagName: 'li',
        className: 'single-list',

        events: {

            'click':                        'onClick',
            'click .sublist-indicator':     'onClickSubListIndicator',
            'dblclick .title-text':         'onDblClickTitleText',
            'click .delete':                'onClickDelete',

            // Drag & drop
            'mousedown':                    'onMouseDown',
            'mouseover .title':             'onMouseOver',
            'mouseout .title':              'onMouseOut',
            'mouseup .title':               'onMouseUp',

        },

        inputMinSize: 15,
        inputMaxSize: 30,

        initialize: function() {
            
            this.views = [];
            this.els = {};
            this.dragging = false;
            this.hasMoved = false;
            this.dragView = null;
            this.dragCoords = {
                initial: {x: 0, y: 0},
                last: {x: 0, y: 0},
            };

            this.$el.addClass('list-item-' + this.model.id);

            this.els.title = $('<div class="title"></div>');
            this.els.titleText = $('<div class="title-text"></div>');
            this.els.titleInput = $('<input class="title-input-inline" value="" />');
            this.els.ownerLabel = $('<div class="owner-label"></div>');
            this.els.deleteButton = $('<div class="delete"></div>');
            this.els.subListIndicator = $('<div class="sublist-indicator"></div>');
            this.els.subList = $('<ul class="sub-lists"></ul>');

            this.els.title.append(this.els.titleText)
                .append(this.els.titleInput.hide())
                .append(this.els.deleteButton)
                .append(this.els.subListIndicator);

            this.$el
                .append(this.els.title)
                .append(this.els.subList);

            this.els.subList.hide();

            for (var i = 0; i < this.model.lists.length; i++) {
                this.addSingleList(this.model.lists.at(i));
            }

            if (this.model.get('Shared')) this.$el.addClass('shared');

            this.els.titleInput.bind('blur', $.proxy(this.onTitleInputBlur, this));
            this.els.titleInput.bind('keydown', $.proxy(this.onTitleInputKeyDown, this));
            this.els.titleInput.bind('mousedown', $.proxy(this.onTitleInputMousedown, this));

            this.model.on('change', this.render, this);
            this.model.lists.on('add', this.onModelListAdd, this);
            this.model.lists.on('remove', this.onModelListRemove, this);

        },

        render: function() {

            this.els.titleText.html(this.model.get('Title'));
            this.els.titleInput.val(this.model.get('Title'));
            this.els.titleInput.attr('size', Math.min(this.inputMaxSize, Math.max(this.inputMinSize, this.els.titleInput.val().length + Number(this.els.titleInput.val().length * 0.1))));

            if (!this.model.hasLists()) this.els.subListIndicator.hide();
            else this.els.subListIndicator.show();

            if (this.model.owner) {
                this.els.ownerLabel.html(this.model.owner.get('FirstName'));
                this.els.titleText.append(this.els.ownerLabel);
            }

            return this;

        },

        editTitle: function() {
            this.els.titleText.hide();
            this.els.titleInput.show().focus();
            return this;
        },

        saveTitle: function() {
            var newTitle = this.els.titleInput.val().trim();
            if (this.model.get('Title') != newTitle) {
                this.model.save({Title: newTitle}, {patch: true});
            }
            this.finishedEditingTitle();
            return this;
        },

        finishedEditingTitle: function() {
            this.els.titleInput.hide();
            this.els.titleText.show();
            return this;
        },

        onDblClickTitleText: function(ev) {
            ev.stopImmediatePropagation();
            this.editTitle();
            return this;
        },

        onClick: function(ev) {
            ev.stopImmediatePropagation();
            if (this.model.hasLists() && !this.els.subListIndicator.hasClass('expanded')) this.toggleSubList();
            return this.trigger('click', this);
        },

        onClickSubListIndicator: function(ev) {
            ev.stopImmediatePropagation();
            if (this.model.hasLists()) this.toggleSubList();
            return this;
        },

        onClickDelete: function() {
            Endeavour.confirm({
                message: 'Delete list \'' + this.model.get('Title') + '\'',
                onConfirm: $.proxy(this.onConfirmDelete, this),
            });
            return this;
        },

        onConfirmDelete: function() {
            this.deleteModel();
        },

        onTitleInputBlur: function(ev) {
            this.saveTitle();
            return this;
        },

        onTitleInputKeyDown: function(ev) {
            var inputEl = this.els.titleInput;
            inputEl.attr('size', Math.min(this.inputMaxSize, Math.max(this.inputMinSize, inputEl.val().length + Number(inputEl.val().length * 0.1))));
            if (ev.which == 13) {
                this.saveTitle();
            }
            return this;
        },

        onTitleInputMousedown: function(ev) {
            ev.stopImmediatePropagation();
            return this;
        },

        setActiveClass: function() {
            this.$el.addClass('active');
            return this;
        },

        clearActiveClass: function() {
            this.$el.removeClass('active');
            return this;
        },

        toggleSubList: function() {
            if (this.els.subListIndicator.hasClass('expanded')) {
                this.hideSubList();
            }
            else {
                this.showSubList();
                if (!this.model.listsLoaded) this.model.loadLists();
            }
            return this;
        },

        showSubList: function() {
            this.els.subList.show();
            this.els.subListIndicator.addClass('expanded');
            return this;
        },

        hideSubList: function() {
            this.els.subList.hide();
            this.els.subListIndicator.removeClass('expanded');
            return this;
        },

        onModelListAdd: function(model) {
            return this.addSingleList(model);
        },

        onModelListRemove: function(model) {
            return this.removeSingleList(model);
        },

        onSingleListClick: function(view) {
            // Event bubbles . O o *
            return this.trigger('click', view);
        },

        addSingleList: function(model) {

            var view = new Endeavour.View.SingleList({
                model: model,
            });

            view.on('click', this.onSingleListClick, this);

            this.views[this.views.length] = view;

            this.els.subList.append(view.render().$el);

            return this;

        },

        removeSingleList: function(model) {

            var modelView = this.getViewByModelID(model.id);

            if (modelView) {
                this.views.splice(this.views.indexOf(modelView), 1);
                modelView.close();
            }

            return this;

        },

        getViewByModelID: function(modelID) {

            var predicate = function(view) { 
                return view.model.id == modelID; 
            };

            return _.find(this.views, predicate);

        },

        deleteModel: function() {
            this.model.destroy();
            return this.close();
        },

        onMouseOver: function(ev) {
            ev.stopImmediatePropagation();
            this.els.title.addClass('droppable');
        },

        onMouseOut: function(ev) {
            ev.stopImmediatePropagation();
            this.els.title.removeClass('droppable');
        },

        onMouseUp: function(ev) {

            // Make sure this onMouseUp was meant for this view
            if ($(ev.currentTarget).parent().attr('class') != $(ev.delegateTarget).attr('class')) return;

            if (Endeavour.stage.dragging) {
                if (Endeavour.stage.dragging.model instanceof Endeavour.Model.ListItem) {
                    Endeavour.stage.dragging.model.setListID(this.model.id);
                }
                else if (Endeavour.stage.dragging.model instanceof Endeavour.Model.List) {
                    // Prevent nesting an item inside its self
                    if (Endeavour.stage.dragging.model.id == this.model.id) return;
                    Endeavour.stage.dragging.model.setParentID(this.model.id);
                }
            }

        },

        onMouseDown: function(ev) {

            ev.stopImmediatePropagation();

            if (!this.model.get('Shared')) this.dragStart();

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

            this.bindDragEvents();
            this.dragging = true;
            this.hasMoved = false;

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
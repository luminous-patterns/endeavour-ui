$(function() {

    window.Endeavour.View.SingleList = Backbone.Marionette.View.extend({

        tagName: 'li',
        className: 'single-list',

        events: {
            'click':                        'onClick',
            'click .sublist-indicator':     'onClickSubListIndicator',
            'dblclick .title-text':         'onDblClickTitleText',
            'click .delete':                'onClickDelete',
        },

        inputMinSize: 15,
        inputMaxSize: 30,

        initialize: function() {
            
            this.views = [];
            this.viewsByModelID = {};
            this.els = {};

            this.$el.addClass('list-item-' + this.model.id);

            this.els.title = $('<div class="title"></div>');
            this.els.titleText = $('<div class="title-text"></div>');
            this.els.titleInput = $('<input class="title-input-inline" value="" />');
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

            this.els.titleInput.bind('blur', $.proxy(this.onTitleInputBlur, this));
            this.els.titleInput.bind('keydown', $.proxy(this.onTitleInputKeyDown, this));

            this.model.on('change', this.render, this);
            this.model.lists.on('add', this.onModelListAdd, this);

        },

        render: function() {

            this.els.titleText.html(this.model.get('Title'));
            this.els.titleInput.val(this.model.get('Title'));
            this.els.titleInput.attr('size', Math.min(this.inputMaxSize, Math.max(this.inputMinSize, this.els.titleInput.val().length + Number(this.els.titleInput.val().length * 0.1))));

            if (!this.model.hasLists()) this.els.subListIndicator.hide();
            else this.els.subListIndicator.show();

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
            this.deleteModel();
            return this;
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
                if (!this.model.getLists()) this.model.loadLists();
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
            this.viewsByModelID[model.id] = view;

            this.els.subList.append(view.render().$el);

            return this;

        },

        deleteModel: function() {
            this.model.destroy();
            return this.close();
        },

    });

});
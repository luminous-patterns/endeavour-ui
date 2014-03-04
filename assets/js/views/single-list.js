$(function() {

    window.Endeavour.View.SingleList = Backbone.Marionette.View.extend({

        tagName: 'li',
        className: 'single-list',

        events: {
            'click':                        'onClick',
            'click .sublist-indicator':     'onClickSubListIndicator',
        },

        initialize: function() {
            
            this.views = [];
            this.viewsByModelID = {};
            this.els = {};

            this.$el.addClass('list-item-' + this.model.id);

            this.els.title = $('<div class="title"></div>');
            this.els.titleText = $('<div class="title-text"></div>');
            this.els.subListIndicator = $('<div class="sublist-indicator"></div>');
            this.els.subList = $('<ul class="sub-lists"></ul>');

            this.els.title.append(this.els.titleText)
                .append(this.els.subListIndicator);

            this.$el
                .append(this.els.title)
                .append(this.els.subList);

            this.els.subList.hide();

            for (var i = 0; i < this.model.lists.length; i++) {
                this.addSingleList(this.model.lists.at(i));
            }

            this.model.lists.on('add', this.onModelListAdd, this);

        },

        render: function() {

            this.els.titleText.html(this.model.get('Title'));

            if (!this.model.hasLists()) this.els.subListIndicator.hide();
            else this.els.subListIndicator.show();

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

        onListItemClick: function(view) {
            // Event bubbles . O o *
            return this.trigger('click', view);
        },

        addSingleList: function(model) {

            var view = new Endeavour.View.SingleList({
                model: model,
            });

            view.on('click', this.onListItemClick, this);

            this.views[this.views.length] = view;
            this.viewsByModelID[model.id] = view;

            this.els.subList.append(view.render().$el);

            return this;

        },

    });

});
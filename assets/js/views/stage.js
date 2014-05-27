$(function() {

    window.Endeavour.View.Stage = Backbone.Marionette.View.extend({

        id: 'stage',
        tagName: 'div',

        currentView: null,

        dragging: null,

        minWidth: 950,
        minHeight: 600,

        initialize: function() {

            console.log('### initialize stage view');

            this.dragging = null;

            this.headerOn = true;
            this.header = new Endeavour.View.Header;
            this.smallScreenOverlay = null;

            this.currentViewName = null;

            if (!'height' in this.options) console.error("Stage height must be specified!");

            this.height = this.options.height;
            this.width = this.options.width;

            this.els = {};

            this.els.content = $('<div id="content"></div>');

            this.$el
                .append(this.header.render().$el)
                .append(this.els.content);

            Endeavour.subscribe('show:dialog', this.showDialog, this);
            Endeavour.subscribe('drag:start', this.onDragStart, this);
            Endeavour.subscribe('drag:end', this.onDragEnd, this);

        },

        render: function() {
            console.log('### render stage view');
            this.checkStageSize();
            return this;
        },

        resize: function(height, width) {

            this.height = height;
            this.width = width;

            this.checkStageSize();

            if (this.currentView) {
                var currentView = this.currentView;
                if ('resize' in currentView) {
                    currentView.resize(this.getUseableHeight(), this.getUseableWidth());
                }
            }

        },

        checkStageSize: function() {

            if (this.height < this.minHeight || this.width < this.minWidth) {
                if (!this.smallScreenOverlay) this.showSmallScreenOverlay();
                else this.smallScreenOverlay.render();
            }
            else if (this.smallScreenOverlay) {
                this.hideSmallScreenOverlay();
            }

            return this;

        },

        getMinHeight: function() {
            return this.minHeight;
        },

        getMinWidth: function() {
            return this.minWidth;
        },

        showSmallScreenOverlay: function() {
            console.log('showing overlay');
            if (this.smallScreenOverlay) return this;
            var smallScreenOverlay = this.smallScreenOverlay = new Endeavour.View.SmallScreenOverlay;
            this.$el.append(smallScreenOverlay.$el);
            smallScreenOverlay.render();
            return this;
        },

        hideSmallScreenOverlay: function() {
            if (!this.smallScreenOverlay) return this;
            this.smallScreenOverlay.close();
            this.smallScreenOverlay = null;
            return this;
        },

        newDialogContainer: function(dialog) {
            console.log('show dialog', dialog);
            var that = this;
            this.dialogContainer = new Endeavour.View.DialogContainer({
                dialog: dialog,
                onCloseDialog: $.proxy(that.onCloseDialog, that),
            });
            this.$el.append(this.dialogContainer.render().$el);
            this.dialogContainer.focusDialogField();
            return this;
        },

        onCloseDialog: function() {
            this.dialogContainer = null;
            return this;
        },

        showDialog: function(what, options) {

            console.log('### stage view showDialog:', what);

            if (Endeavour.state.isLoggedIn()) {
                this.header.$el.show();
            }
            else {
                this.header.$el.hide();
            }

            if (!options) options = {};

            switch(what) {

                case 'login':
                    this.setCurrentView(new Endeavour.View.Login(options));
                    var currentEl = this.currentView.$el;
                    currentEl.css({marginTop: ( this.getUseableHeight() - currentEl.outerHeight() ) / 2 });
                    break;

                case 'register':
                    this.setCurrentView(new Endeavour.View.Register(options));
                    var currentEl = this.currentView.$el;
                    currentEl.css({marginTop: ( this.getUseableHeight() - currentEl.outerHeight() ) / 2 });
                    break;

                case 'add-new-list-item':
                    this.newDialogContainer(new Endeavour.View.DialogAddNewListItem(options));
                    break;

                case 'add-new-list':
                    this.newDialogContainer(new Endeavour.View.DialogAddNewList(options));
                    var currentEl = this.dialogContainer.dialog.$el;
                    currentEl.css({marginTop: ( this.getUseableHeight() - currentEl.outerHeight() ) / 2 });
                    break;

                case 'feedback':
                    this.newDialogContainer(new Endeavour.View.FeedbackDialog(options));
                    var currentEl = this.dialogContainer.dialog.$el;
                    currentEl.css({marginTop: ( this.getUseableHeight() - currentEl.outerHeight() ) / 2 });
                    break;

            }

            return this;

        },

        showSection: function(what) {

            console.log('### stage view showSection:', what);

            if (what == this.currentViewName) {
                return this;
            }

            this.currentViewName = what;

            if (Endeavour.state.isLoggedIn()) {
                this.header.$el.show();
                this.els.content.css({marginTop: this.header.$el.height()});
            }
            else {
                this.header.$el.hide();
                this.els.content.css({marginTop: 0});
            }

            switch(what) {
                case 'dashboard':
                    this.setCurrentView(new Endeavour.View.Dashboard());
                    break;
                case 'all-lists':
                    this.setCurrentView(new Endeavour.View.AllLists());
                    break;
                case 'calendar':
                    this.setCurrentView(new Endeavour.View.Calendar());
                    break;
                case 'today':
                    this.setCurrentView(new Endeavour.View.Today());
                    break;
                case 'my-account':
                    this.setCurrentView(new Endeavour.View.MyAccount());
                    break;
            }

            return this;

        },

        getUseableHeight: function() {
            var headerHeight = this.header.$el.css('display') != 'none' ? this.header.$el.height() : 0;
            return this.height - headerHeight;
        },

        getUseableWidth: function() {
            return this.width;
        },

        setCurrentView: function(view) {

            if (this.currentView) {
                // Close `currentView`
                this.currentView.close();
            }

            // Set new view to `currentView`
            this.currentView = view;

            // Append new view to stage
            this.els.content.html(view.$el);

            if ('resize' in view) view.resize(this.getUseableHeight(), this.getUseableWidth());

            // Render it
            view.render();

            return this;

        },

        onDragStart: function(view) {
            this.dragging = view;
            return this;
        },

        onDragEnd: function(view) {
            this.dragging = null;
            return this;
        },

    });

});
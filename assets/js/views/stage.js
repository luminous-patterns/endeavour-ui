$(function() {

    window.Endeavour.View.Stage = Backbone.Marionette.View.extend({

        id: 'stage',
        tagName: 'div',

        currentView: null,

        dragging: null,

        initialize: function() {

            console.log('### initialize stage view');

            this.dragging = null;

            this.headerOn = true;
            this.header = new Endeavour.View.Header;

            this.$el
                .append(this.header.render().$el);

            Endeavour.subscribe('show:dialog', this.showDialog, this);
            Endeavour.subscribe('drag:start', this.onDragStart, this);
            Endeavour.subscribe('drag:end', this.onDragEnd, this);

        },

        render: function() {
            console.log('### render stage view');
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

        showDialog: function(what) {

            console.log('### stage view showDialog:', what);

            if (Endeavour.state.isLoggedIn()) {
                this.header.$el.show();
            }
            else {
                this.header.$el.hide();
            }

            switch(what) {

                case 'login':
                    this.setCurrentView(new Endeavour.View.Login());
                    break;

                case 'add-new-list-item':
                    this.newDialogContainer(new Endeavour.View.DialogAddNewListItem());
                    break;

                case 'add-new-list':
                    this.newDialogContainer(new Endeavour.View.DialogAddNewList());
                    break;

                case 'feedback':
                    this.newDialogContainer(new Endeavour.View.FeedbackDialog());
                    break;

            }

            return this;

        },

        showSection: function(what) {

            console.log('### stage view showSection:', what);

            if (!(this.currentView instanceof Endeavour.Layout.Main)) {
                console.log('### stage view load layout');
                this.setCurrentView(new Endeavour.Layout.Main());
            }

            if (Endeavour.state.isLoggedIn()) {
                this.header.$el.show();
            }
            else {
                this.header.$el.hide();
            }

            switch(what) {
                case 'dashboard':
                    this.currentView.content.show(new Endeavour.View.Dashboard());
                    break;
                case 'all-lists':
                    this.currentView.content.show(new Endeavour.View.AllLists());
                    break;
                case 'calendar':
                    this.currentView.content.show(new Endeavour.View.Calendar());
                    break;
                case 'today':
                    this.currentView.content.show(new Endeavour.View.Today());
                    break;
            }

            return this;

        },

        setCurrentView: function(view) {

            if (this.currentView) {
                // Close `currentView`
                this.currentView.close();
            }

            // Set new view to `currentView`
            this.currentView = view;

            // Append new view to stage
            this.$el.append(view.$el)

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
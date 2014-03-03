$(function() {

    window.Endeavour.View.Stage = Backbone.Marionette.View.extend({

        id: 'stage',
        tagName: 'div',

        currentView: null,

        initialize: function() {
            console.log('### initialize stage view');
        },

        render: function() {
            console.log('### render stage view');
            return this;
        },

        showDialog: function(what) {

            console.log('### stage view showDialog:', what);

            switch(what) {
                case 'login':
                    this.setCurrentView(new Endeavour.View.Login());
                    break;
            }

            return this;

        },

        showSection: function(what) {

            console.log('### stage view showSection:', what);

            if (!(this.currentView instanceof Endeavour.Layout.Main)) {
                console.log('### stage view load layout');
                this.setCurrentView(new Endeavour.Layout.Main());
                this.currentView.sidebar.show(new Endeavour.View.Sidebar());
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

            // Render new view & append it to stage
            return this.$el.append(view.render().$el);

        },

    });

});
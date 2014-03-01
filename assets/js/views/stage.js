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

            switch(what) {
                case 'dashboard':
                    this.setCurrentView(new Endeavour.View.Dashboard());
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
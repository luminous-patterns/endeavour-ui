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

        show: function(what) {
            console.log('### stage view show:', what);
            switch(what) {
                case 'login':
                    this.setCurrentView(new Endeavour.View.Login());
                    break;
            }
            return this;
        },

        setCurrentView: function(view) {
            this.$el.html('');
            this.currentView = view;
            return this.$el.append(view.render().$el);
        },

    });

});
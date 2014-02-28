$(function() {

    window.Endeavour.View.Stage = Backbone.Marionette.View.extend({

        id: 'stage',
        tagName: 'div',

        initialize: function() {
            console.log('### initialize stage view');
        },

        render: function() {
            console.log('### render stage view');
            return this;
        },

        show: function(what) {
            console.log('### stage view show:', what);
            return this;
        },

    });

});
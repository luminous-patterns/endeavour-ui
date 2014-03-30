$(function() {

    window.Endeavour.Layout.Main = Backbone.Marionette.Layout.extend({

        id: 'layout',

        regions: {
            content: '#content',
        },

        template: function() {
            return $('<div id="content"></div>');
        },

    });

});
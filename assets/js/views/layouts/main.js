$(function() {

    window.Endeavour.Layout.Main = Backbone.Marionette.Layout.extend({

        id: 'layout',

        regions: {
            sidebar: '#sidebar',
            content: '#content',
        },

        template: function() {
            return $('<div id="sidebar"></div><div id="content"></div>');
        },

    });

});
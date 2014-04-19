$(function() {

    window.Endeavour.View.Dialog = Backbone.Marionette.View.extend({

        tagName: 'div',
        className: 'dialog',

        initialize: function() {

            this.els = {};

            this.els.title = $('<div class="dialog-title">Dialog</div>');

            this.$el.append(this.els.title);

            this.$el.on('click', $.proxy(this.onClick, this));

            console.log('### initialize dialog');

        },

        render: function() {
            console.log('### render dialog');
            return this;
        },

        closeDialog: function() {
            this.trigger('close');
            return this.close();
        },

        onClick: function(ev) {
            ev.stopPropagation();
            return this;
        },

        focusField: function() {
            return this;
        },

    });

});
$(function() {

    window.Endeavour.View.SingleListItem = Backbone.Marionette.View.extend({

        tagName: 'li',
        className: 'single-list-item',

        initialize: function() {
            
            this.els = {};

            this.$el.addClass('list-item-' + this.model.id);

            this.els.summary = $('<div class="summary"></div>');
            this.els.checkbox = $('<div class="checkbox"></div>');

            this.els.checkbox.html('<div class="outline"><div class="indicator"></div></div>');

            this.$el
                .append(this.els.summary)
                .append(this.els.checkbox);

            this.els.checkbox.on('click', $.proxy(this.onClickCheckbox, this));

            this.model.on('change', this.render, this);

        },

        render: function() {

            this.els.summary.html(this.model.get('Summary'));
            
            if (this.model.get('Completed')) {
                this.els.checkbox.addClass('checked');
            }
            else {
                this.els.checkbox.removeClass('checked');
            }

            return this;

        },

        onClickCheckbox: function() {
            this.model.toggleComplete();
            return this;
        },

    });

});
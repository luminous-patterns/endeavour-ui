$(function() {

    window.Endeavour.View.CalendarMonthDay = Backbone.Marionette.View.extend({

        tagName: 'div',
        className: 'day-cell',

        initialize: function() {

            this.date = this.options.date ? this.options.date : null;

            var date = new Date;

            if (date.toString().substr(0,15) == this.date.toString().substr(0,15)) {
                this.$el.addClass('today');
            }

            if (this.options.extra) {
                this.$el.addClass('extra');
                this.$el.append(this.date.getDate() + '/' + (this.date.getMonth() + 1));
            }
            else {
                this.$el.append(this.date.getDate());
            }
            
        },

        render: function() {

            return this;

        },

    });

});
$(function() {

    window.Endeavour.View.CalendarMonthDay = Backbone.Marionette.View.extend({

        tagName: 'div',
        className: 'day-cell',

        initialize: function() {

            this.date = this.options.date ? this.options.date : null;

            var date = new Date;

            if (this.date) {
                
                this.$el.append(this.date.getDate());

                if (date.toString().substr(0,15) == this.date.toString().substr(0,15)) {
                    this.$el.addClass('today');
                }

            }
            else {
                this.$el.addClass('empty');
            }
            
        },

        render: function() {

            return this;

        },

    });

});
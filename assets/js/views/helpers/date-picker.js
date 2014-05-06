$(function() {

    window.Endeavour.View.DatePicker = Backbone.Marionette.View.extend({

        tagName: 'div',
        className: 'date-picker',

        initialize: function() {

            this.calendarMonth = new Endeavour.View.CalendarMonth({
                shortenDayNames: 'letters',
            });

            this.$el.append(this.calendarMonth.render().$el);

            this.calendarMonth.on('date-selected', this.onCalendarDateSelected, this);

        },

        render: function() {

            

            return this;

        },

        onCalendarDateSelected: function(date) {
            this.trigger('date-selected', date);
        },

        setPosition: function(x, y) {
            this.$el.css({
                top: y,
                left: x,
            });
            return this;
        },

    });

});
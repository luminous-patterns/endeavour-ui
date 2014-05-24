$(function() {

    window.Endeavour.View.DatePicker = Backbone.Marionette.View.extend({

        tagName: 'div',
        className: 'date-picker',

        events: {
            'click':      'onClick',
        },

        initialize: function() {

            var monthOptions = {
                shortenDayNames: 'letters',
            };

            var selectedDate = this.selectedDate = 'selectedDate' in this.options ? this.options.selectedDate : null;

            if (selectedDate) {
                monthOptions.date = selectedDate;
            }

            this.calendarMonth = new Endeavour.View.CalendarMonth(monthOptions);

            this.$el.append(this.calendarMonth.render().$el);

            this.calendarMonth.on('date-selected', this.onCalendarDateSelected, this);

        },

        render: function() {

            return this;

        },

        onClick: function(ev) {
            ev.stopPropagation();
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
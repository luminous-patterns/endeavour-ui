$(function() {

    window.Endeavour.View.CalendarMonth = Backbone.Marionette.View.extend({

        tagName: 'div',
        className: 'calendar-month',

        initialize: function() {

            this.els = {};
            this.els.grid = $('<div class="month-grid"></div>');

            this.calendar = this.options.calendar;
            this.date = this.calendar.getCurrentDate();

            for (var i = 0; i < this.firstDayOffset(); i++) {
                this.addCell(new Endeavour.View.CalendarMonthDay);
            }

            for (var i = 0; i < this.daysInMonth(); i++) {
                newDate = new Date(this.date.getTime());
                newDate.setDate(i+1);
                this.addCell(new Endeavour.View.CalendarMonthDay({
                    date: newDate,
                }));
            }

            for (var i = 0; i < 7 - ((this.firstDayOffset() + this.daysInMonth())%7); i++) {
                this.addCell(new Endeavour.View.CalendarMonthDay);
            }

            this.$el.append(this.els.grid);

            console.log('calendar month view instantiated', this.calendar.getCurrentDate(), this.calendar);

        },

        render: function() {

            return this;

        },

        addCell: function(view) {
            this.els.grid.append(view.render().$el);
            return this;
        },

        isLeapYear: function() {
            return this.date.getFullYear()%4 == 0;
        },

        daysInMonth: function() {
            var months = {
                0: 31, 1: 28, 2: 31,
                3: 30, 4: 31, 5: 30,
                6: 31, 7: 31, 8: 30,
                9: 31, 10: 30, 11: 31,
            };
            if (this.isLeapYear()) months[1] = 29;
            return months[this.date.getMonth()];
        },

        firstDayOffset: function() {
            return this.date.getDay();
        },

    });

});
$(function() {

    window.Endeavour.View.CalendarMonth = Backbone.Marionette.View.extend({

        tagName: 'div',
        className: 'calendar-month',

        initialize: function() {

            this.els = {};
            this.els.header = $('<div class="month-header"></div>');
            this.els.headerText = $('<div class="header-text"></div>');
            this.els.columnTitles = $('<div class="col-titles">'
                + '<div class="title-cell">Sunday</div>'
                + '<div class="title-cell">Monday</div>'
                + '<div class="title-cell">Tuesday</div>'
                + '<div class="title-cell">Wednesday</div>'
                + '<div class="title-cell">Thursday</div>'
                + '<div class="title-cell">Friday</div>'
                + '<div class="title-cell">Saturday</div>'
                + '</div>');
            this.els.grid = $('<div class="month-grid"></div>');

            this.els.header.append(this.els.headerText);

            this.calendar = this.options.calendar;
            this.date = this.calendar.getCurrentDate();

            for (var i = 0; i < this.firstDayOffset(); i++) {
                secondsUntilMonthStart = 86400 * (this.firstDayOffset() - (i + 1));
                newDate = new Date(this.date.getTime());
                newDate.setDate(0);
                newDate.setTime(newDate.getTime() - (secondsUntilMonthStart * 1000));
                this.addCell(new Endeavour.View.CalendarMonthDay({
                    date: newDate,
                    extra: true,
                }));
            }

            for (var i = 0; i < this.daysInMonth(); i++) {
                newDate = new Date(this.date.getTime());
                newDate.setDate(i+1);
                this.addCell(new Endeavour.View.CalendarMonthDay({
                    date: newDate,
                }));
            }

            for (var i = 0; i < 7 - ((this.firstDayOffset() + this.daysInMonth()) % 7); i++) {
                newDate = new Date(this.date.getTime());
                newDate.setMonth(newDate.getMonth() + 1);
                newDate.setDate(0);
                newDate.setTime(newDate.getTime() + ((86400 * (i + 1)) * 1000));
                this.addCell(new Endeavour.View.CalendarMonthDay({
                    date: newDate,
                    extra: true,
                }));
            }

            this.$el
                .append(this.els.header)
                .append(this.els.columnTitles)
                .append(this.els.grid);

            console.log('calendar month view instantiated', this.calendar.getCurrentDate(), this.calendar);

        },

        render: function() {

            this.els.headerText.html(this.getMonthText(this.date.getMonth()) + ' ' + this.date.getFullYear());

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

        getMonthText: function(month) {
            var monthTexts = {
                0: 'January',
                1: 'February',
                2: 'March',
                3: 'April',
                4: 'May',
                5: 'June',
                6: 'July',
                7: 'August',
                8: 'September',
                9: 'October',
                10: 'November',
                11: 'December',
            };
            return monthTexts[month];
        },

        getDayText: function(day) {
            var dayTexts = {
                0: 'Sunday',
                0: 'Monday',
                0: 'Tuesday',
                0: 'Wednesday',
                0: 'Thursday',
                0: 'Friday',
                0: 'Saturday',
            };
            return dayTexts[day];
        },

    });

});
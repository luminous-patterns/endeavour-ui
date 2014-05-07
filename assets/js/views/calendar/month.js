$(function() {

    window.Endeavour.View.CalendarMonth = Backbone.Marionette.View.extend({

        tagName: 'div',
        className: 'calendar-month',

        events: {
            'click .prev-month':      'onClickPrevMonth',
            'click .next-month':      'onClickNextMonth',
        },

        initialize: function() {

            this.els = {};
            this.cells = [];
            this.date = null;
            this.selectedDate = null;
            this.todaysDate = new Date;
            this.shortenDayNames = 'shortenDayNames' in this.options ? this.options.shortenDayNames : false;
            this.selectedDate = null;

            var dayColumnTitles = this.getDayColumnTitles();

            this.els.header = $('<div class="month-header"></div>');
            this.els.controls = $('<div class="month-controls"><button type="button" class="prev-month">Prev</button><button type="button" class="next-month">Next</button></div>');
            this.els.headerText = $('<div class="header-text"></div>');
            this.els.columnTitles = $('<div class="col-titles">'
                + '<div class="title-cell">' + dayColumnTitles[0] + '</div>'
                + '<div class="title-cell">' + dayColumnTitles[1] + '</div>'
                + '<div class="title-cell">' + dayColumnTitles[2] + '</div>'
                + '<div class="title-cell">' + dayColumnTitles[3] + '</div>'
                + '<div class="title-cell">' + dayColumnTitles[4] + '</div>'
                + '<div class="title-cell">' + dayColumnTitles[5] + '</div>'
                + '<div class="title-cell">' + dayColumnTitles[6] + '</div>'
                + '</div>');
            this.els.grid = $('<div class="month-grid"></div>');

            this.els.header
                .append(this.els.headerText)
                .append(this.els.controls);

            if ('date' in this.options) {
                this.selectedDate = this.options.date;
            }

            this.setMonth('date' in this.options ? this.options.date : new Date);

            this.$el
                .append(this.els.header)
                .append(this.els.columnTitles)
                .append(this.els.grid);

        },

        render: function() {

            this.renderHeaderText();

            return this;

        },

        renderHeaderText: function() {
            this.els.headerText.html(this.getMonthText(this.date.getMonth()) + ' ' + this.date.getFullYear());
            return this;
        },

        setMonth: function(date) {

            this.date = date;

            this.renderHeaderText();

            this.clearCells();

            for (var i = 0; i < this.firstDayOffset(); i++) {
                secondsUntilMonthStart = 86400 * (this.firstDayOffset() - (i + 1));
                newDate = new Date(this.date.getTime());
                newDate.setDate(0);
                newDate.setTime(newDate.getTime() - (secondsUntilMonthStart * 1000));
                this.addCell(new Endeavour.View.CalendarMonthDay({
                    date: newDate,
                    extra: true,
                    onClick: $.proxy(this.onClickDay, this),
                }));
            }

            for (var i = 0; i < this.daysInMonth(); i++) {
                newDate = new Date(this.date.getTime());
                newDate.setDate(i+1);
                addClasses = [];
                if (this.selectedDate && newDate.toDateString() === this.selectedDate.toDateString()) {
                    addClasses[addClasses.length] = 'selected';
                }
                this.addCell(new Endeavour.View.CalendarMonthDay({
                    date: newDate,
                    onClick: $.proxy(this.onClickDay, this),
                    addClasses: addClasses,
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
                    onClick: $.proxy(this.onClickDay, this),
                }));
            }

        },

        clearCells: function() {
            for (var i = 0; i < this.cells.length; i++) {
                cell = this.cells[i];
                cell.close();
            }
            this.cells = [];
            return this;
        },

        addCell: function(view) {
            this.cells[this.cells.length] = view;
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
            // return this.date.getDay();
            var newDate = new Date(this.date);
            newDate.setDate(1);
            return newDate.getDay();
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

        getDayFirstLetters: function() {
            return {
                0: 'S',
                1: 'M',
                2: 'T',
                3: 'W',
                4: 'T',
                5: 'F',
                6: 'S',
            };
        },

        getShortDayNames: function() {
            return {
                0: 'Sun',
                1: 'Mon',
                2: 'Tue',
                3: 'Wed',
                4: 'Thu',
                5: 'Fri',
                6: 'Sat',
            };
        },

        getFullDayNames: function() {
            return {
                0: 'Sunday',
                1: 'Monday',
                2: 'Tuesday',
                3: 'Wednesday',
                4: 'Thursday',
                5: 'Friday',
                6: 'Saturday',
            };
        },

        getDayColumnTitles: function() {
            if (this.shortenDayNames) {
                if (this.shortenDayNames === 'letters') return this.getDayFirstLetters();
                else return this.getShortDayNames();
            }
            else return this.getFullDayNames();
        },

        getDayColumnTitle: function(day) {
            return this.getDayColumnTitles()[day];
        },

        onClickNextMonth: function() {
            var nextMonth = new Date(this.date);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            this.setMonth(nextMonth);
        },

        onClickPrevMonth: function() {
            var lastMonth = new Date(this.date);
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            this.setMonth(lastMonth);
        },

        onClickDay: function(date) {
            this.trigger('date-selected', date);
        },

    });

});
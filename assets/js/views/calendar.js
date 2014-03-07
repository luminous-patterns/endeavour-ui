$(function() {

    window.Endeavour.View.Calendar = Backbone.Marionette.View.extend({

        id: 'calendar',
        tagName: 'div',

        initialize: function() {

            this.els = {};
            this.currentView = null;
            this.currentZoom = this.options.zoom ? this.options.zoom : 'month';
            this.currentDate = this.options.date ? this.options.date : new Date;

            if (!(this.currentDate instanceof Date)) {
                console.error('invalid date passed to calendar: ' + this.currentDate);
            }

            switch (this.currentZoom) {
                case 'week':
                    this.currentView = new Endeavour.View.CalendarWeek({calendar: this});
                    break;
                case 'month':
                    this.currentView = new Endeavour.View.CalendarMonth({calendar: this});
                    break;
                case 'year':
                    // not implemented
                    // this.currentView = new Endeavour.View.CalendarYear({});
                    console.log('not implemented yet');
                    break;
            }

            this.$el
                .append("<h1>Calendar</h1>")
                .append(this.currentView.render().$el);

        },

        render: function() {

            return this;

        },

        getCurrentDate: function() {
            return this.currentDate;
        },

        setCurrentView: function(view) {

            if (this.currentView) {
                // Close `currentView`
                this.currentView.close();
            }

            // Set new view to `currentView`
            this.currentView = view;

            // Render new view & append it to stage
            return this.$el.append(view.render().$el);

        },

    });

});
$(function() {

    window.Endeavour.View.Dashboard = Backbone.Marionette.View.extend({

        id: 'dashboard',
        tagName: 'div',

        initialize: function() {

            this.flexi = null;

            this.els = {};

            this.els.main = $('<div class="dashboard-flexi"></div>');

            this.height = 'height' in this.options ? this.options.height : 0;
            this.width = 'width' in this.options ? this.options.width : 0;

            this.newsAndAnnouncements = new Endeavour.View.NewsAnnouncementsBox;

            this.itemsDueSoon = new Endeavour.View.ListItemsContainer({
                paginate: false,
                limit: 20,
                title: 'Upcoming',
                collection: {
                    type: Endeavour.Collection.ListItems,
                    url: Endeavour.serverURL + '/listitems',
                    data: {
                        search: 'upcoming',
                        days: 14,
                        orderBy: 'Due',
                        order: 'ASC',
                    },
                },
            });

            this.itemsOverdue = new Endeavour.View.ListItemsContainer({
                paginate: false,
                limit: 20,
                title: 'Overdue',
                collection: {
                    type: Endeavour.Collection.ListItems,
                    url: Endeavour.serverURL + '/listitems',
                    data: {
                        search: 'overdue',
                        orderBy: 'Due',
                        order: 'ASC',
                    },
                },
            });

            this.$el
                .append("<h1>Dashboard</h1>")
                .append(this.els.main);

        },

        render: function() {

            if (!this.flexi) {
                this.initFlexi(this.height - 100, this.width);
            }
            else {
                this.flexi
                    .setDimensions(this.height - 100, this.width)
                    .render();
            }

            return this;

        },

        resize: function(height, width) {
            console.log('resize dashboard',height,width);
            this.height = height;
            this.width = width;
            if (this.flexi) this.flexi.setDimensions(height - 100, width);
            return this;
        },

        initFlexi: function(height, width) {

            var flexi = this.flexi = new Endeavour.View.FlexiContainer({
                containerID: 'main',
                height: height - 100,
                width: width,
                margin: 20,
            });

            this.els.main.append(flexi.$el);

            flexi.render();

            // Add left cell
            var leftCell = flexi.addCell({
                extraClassName: 'news-cell',
                weight: 2,
                minWidth: 260,
            });
            var middleCell = flexi.addCell({
                weight: 2,
                minWidth: 310,
            });
            var rightCell = flexi.addCell({
                weight: 2,
                minWidth: 310,
            });

            leftCell.addContent({
                html: this.newsAndAnnouncements.render().$el,
            });

            middleCell.addContent({
                html: this.itemsOverdue.render().$el,
            });

            rightCell.addContent({
                html: this.itemsDueSoon.render().$el,
            });

            this.render();

        },

    });

});
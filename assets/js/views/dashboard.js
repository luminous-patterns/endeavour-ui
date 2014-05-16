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
                type: 'container',
            });
            var middleCell = flexi.addCell({
                weight: 2,
            });
            var rightCell = flexi.addCell({
                weight: 2,
            });

            middleCell.addContent({
                html: 'Middle left cell',
            });

            rightCell.addContent({
                html: 'Right cell',
            });

                var leftContainer = leftCell.addContainer({
                    containerID: 'left',
                    height: leftCell.getHeight(),
                    width: leftCell.getWidth(),
                    margin: 0,
                    cellOrientation: 'horizontal',
                });

                var leftTopCell = leftContainer.addCell();
                var leftMiddleCell = leftContainer.addCell({
                    weight: 2,
                });
                var leftBottomCell = leftContainer.addCell({
                    type: 'container',
                    weight: 2,
                });

                leftTopCell.addContent({
                    html: 'Left top cell',
                });

                leftMiddleCell.addContent({
                    html: 'Left middle cell',
                });

                    var leftBottomContainer = leftBottomCell.addContainer({
                        containerID: 'left-bottom',
                        height: leftBottomCell.getHeight(),
                        width: leftBottomCell.getWidth(),
                        margin: 0,
                        cellOrientation: 'vertical',
                    });

                    var leftBottomLeftCell = leftBottomContainer.addCell();
                    var leftBottomMiddleCell = leftBottomContainer.addCell();
                    var leftBottomRightCell = leftBottomContainer.addCell();

                    leftBottomLeftCell.addContent({
                        html: 'Left bottom left cell',
                    });

                    leftBottomMiddleCell.addContent({
                        html: 'Left bottom middle cell',
                    });

                    leftBottomRightCell.addContent({
                        html: 'Right bottom right cell',
                    });

            this.render();

        },

    });

});
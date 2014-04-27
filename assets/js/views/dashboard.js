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
                this.initFlexi(this.height, this.width);
            }
            else {
                this.flexi
                    .setDimensions(this.height, this.width)
                    .render();
            }

            return this;

        },

        resize: function(height, width) {
            console.log('resize dashboard',height,width);
            this.height = height;
            this.width = width;
            return this;
        },

        initFlexi: function(height, width) {
console.log('init flexi',height,width);
            var flexi = this.flexi = new Endeavour.View.FlexiContainer({
                containerID: 'main',
                height: height,
                width: width,
                margin: 20,
            });

            this.els.main.append(flexi.$el);

            flexi.render();

            // Add left cell
            var leftCell = flexi.addCell(new Endeavour.View.FlexiCell({
                type: 'container',
            }));

                var leftContainer = leftCell.addContainer(new Endeavour.View.FlexiContainer({
                    containerID: 'left',
                    height: leftCell.getHeight(),
                    width: leftCell.getWidth(),
                    margin: 0,
                    cellOrientation: 'horizontal',
                }));

                var leftTopCell = leftContainer.addCell(new Endeavour.View.FlexiCell({

                }));

                leftTopCell.addContent(new Endeavour.View.FlexiContent({
                    html: 'Left top cell',
                }));

                var leftMiddleCell = leftContainer.addCell(new Endeavour.View.FlexiCell({

                }));

                leftMiddleCell.addContent(new Endeavour.View.FlexiContent({
                    html: 'Left middle cell',
                }));

                // Add right bottom cell
                var leftBottomCell = leftContainer.addCell(new Endeavour.View.FlexiCell({
                    type: 'container',
                }));

                    var leftBottomContainer = leftBottomCell.addContainer(new Endeavour.View.FlexiContainer({
                        containerID: 'left-bottom',
                        height: leftBottomCell.getHeight(),
                        width: leftBottomCell.getWidth(),
                        margin: 0,
                        cellOrientation: 'vertical',
                    }));

                    var leftBottomLeftCell = leftBottomContainer.addCell(new Endeavour.View.FlexiCell({

                    }));

                    leftBottomLeftCell.addContent(new Endeavour.View.FlexiContent({
                        html: 'Left bottom left cell',
                    }));

                    leftBottomMiddleCell = leftBottomContainer.addCell(new Endeavour.View.FlexiCell({

                    }));

                    leftBottomMiddleCell.addContent(new Endeavour.View.FlexiContent({
                        html: 'Left bottom middle cell',
                    }));

                    leftBottomRightCell = leftBottomContainer.addCell(new Endeavour.View.FlexiCell({

                    }));

                    leftBottomRightCell.addContent(new Endeavour.View.FlexiContent({
                        html: 'Right bottom right cell',
                    }));

            // Add middle cell
            var middleLeftCell = flexi.addCell(new Endeavour.View.FlexiCell({

            }));

            middleLeftCell.addContent(new Endeavour.View.FlexiContent({
                html: 'Middle left cell',
            }));

            // Add right cell
            var middleRightCell = flexi.addCell(new Endeavour.View.FlexiCell({

            }));

            middleRightCell.addContent(new Endeavour.View.FlexiContent({
                html: 'Middle right cell',
            }));

            // Add right cell
            var rightCell = flexi.addCell(new Endeavour.View.FlexiCell({

            }));

            rightCell.addContent(new Endeavour.View.FlexiContent({
                html: 'Right cell',
            }));

            this.render();

        },

    });

});
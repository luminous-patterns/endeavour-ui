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
console.log('init flexi',height,width);
            var flexi = this.flexi = new Endeavour.View.FlexiContainer({
                containerID: 'main',
                height: height - 100,
                width: width,
                margin: 20,
            });

            this.els.main.append(flexi.$el);

            flexi.render();

            // Add left cell
            var leftCell = flexi.addCell(new Endeavour.View.FlexiCell({
                type: 'container',
            }));
            
            var middleLeftCell = flexi.addCell(new Endeavour.View.FlexiCell);
            var middleRightCell = flexi.addCell(new Endeavour.View.FlexiCell);
            var rightCell = flexi.addCell(new Endeavour.View.FlexiCell);

            middleLeftCell.addContent(new Endeavour.View.FlexiContent({
                html: 'Middle left cell',
            }));

            middleRightCell.addContent(new Endeavour.View.FlexiContent({
                html: 'Middle right cell',
            }));

            rightCell.addContent(new Endeavour.View.FlexiContent({
                html: 'Right cell',
            }));

            console.log('left container init', leftCell.getHeight(), leftCell.getWidth());

                var leftContainer = leftCell.addContainer(new Endeavour.View.FlexiContainer({
                    containerID: 'left',
                    height: leftCell.getHeight(),
                    width: leftCell.getWidth(),
                    margin: 0,
                    cellOrientation: 'horizontal',
                }));

                var leftTopCell = leftContainer.addCell(new Endeavour.View.FlexiCell);
                var leftMiddleCell = leftContainer.addCell(new Endeavour.View.FlexiCell);
                var leftBottomCell = leftContainer.addCell(new Endeavour.View.FlexiCell({
                    type: 'container',
                }));

                leftTopCell.addContent(new Endeavour.View.FlexiContent({
                    html: 'Left top cell',
                }));

                leftMiddleCell.addContent(new Endeavour.View.FlexiContent({
                    html: 'Left middle cell',
                }));

                console.log('left bottom container init', leftBottomCell.getHeight(), leftBottomCell.getWidth());

                    var leftBottomContainer = leftBottomCell.addContainer(new Endeavour.View.FlexiContainer({
                        containerID: 'left-bottom',
                        height: leftBottomCell.getHeight(),
                        width: leftBottomCell.getWidth(),
                        margin: 0,
                        cellOrientation: 'vertical',
                    }));

                    var leftBottomLeftCell = leftBottomContainer.addCell(new Endeavour.View.FlexiCell);
                    var leftBottomMiddleCell = leftBottomContainer.addCell(new Endeavour.View.FlexiCell);
                    var leftBottomRightCell = leftBottomContainer.addCell(new Endeavour.View.FlexiCell);

                    leftBottomLeftCell.addContent(new Endeavour.View.FlexiContent({
                        html: 'Left bottom left cell',
                    }));

                    leftBottomMiddleCell.addContent(new Endeavour.View.FlexiContent({
                        html: 'Left bottom middle cell',
                    }));

                    leftBottomRightCell.addContent(new Endeavour.View.FlexiContent({
                        html: 'Right bottom right cell',
                    }));

            this.render();

        },

    });

});
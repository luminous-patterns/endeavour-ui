$(function() {

    window.Endeavour.View.Dashboard = Backbone.Marionette.View.extend({

        id: 'dashboard',
        tagName: 'div',

        initialize: function() {

            this.flexi = null;

            this.els = {};

            this.els.main = $('<div class="dashboard-flexi"></div>');

            this.$el
                .append("<h1>Dashboard</h1>")
                .append(this.els.main);

        },

        render: function() {

            if (!this.flexi) {
                this.initFlexi(this.els.main.height(), this.els.main.width());
            }
            else {
                this.flexi.setDimensions(this.els.main.height(), this.els.main.width()).render();
            }

            return this;

        },

        initFlexi: function(height, width) {

            var flexi = this.flexi = new Endeavour.View.FlexiContainer({
                containerID: 'main',
                parentEl: this.$el,
                height: height,
                width: width,
                margin: 20,
            });

            // Add left cell
            var leftCell = flexi.addCell(new Endeavour.View.FlexiCell({

            }));

            leftCell.addContent(new Endeavour.View.FlexiContent({
                html: 'Left cell',
            }));

            // Add right cell
            var middleCell = flexi.addCell(new Endeavour.View.FlexiCell({

            }));

            middleCell.addContent(new Endeavour.View.FlexiContent({
                html: 'Middle cell',
            }));

            // Add right cell
            var rightCell = flexi.addCell(new Endeavour.View.FlexiCell({
                type: 'container',
            }));

                var rightContainer = rightCell.addContainer(new Endeavour.View.FlexiContainer({
                    containerID: 'right',
                    parentEl: this.$el,
                    height: height,
                    width: width,
                    margin: 0,
                    cellOrientation: 'horizontal',
                }));

                var rightTopCell = rightContainer.addCell(new Endeavour.View.FlexiCell({

                }));

                rightTopCell.addContent(new Endeavour.View.FlexiContent({
                    html: 'Right top cell',
                }));

                var rightMiddleCell = rightContainer.addCell(new Endeavour.View.FlexiCell({

                }));

                rightMiddleCell.addContent(new Endeavour.View.FlexiContent({
                    html: 'Right middle cell',
                }));

                // Add right bottom cell
                var rightBottomCell = rightContainer.addCell(new Endeavour.View.FlexiCell({
                    type: 'container',
                }));

                    var rightBottomContainer = rightBottomCell.addContainer(new Endeavour.View.FlexiContainer({
                        containerID: 'right-bottom',
                        parentEl: this.$el,
                        height: height,
                        width: width,
                        margin: 0,
                        cellOrientation: 'vertical',
                    }));

                    var rightBottomLeftCell = rightBottomContainer.addCell(new Endeavour.View.FlexiCell({

                    }));

                    rightBottomLeftCell.addContent(new Endeavour.View.FlexiContent({
                        html: 'Right bottom left cell',
                    }));

                    var rightBottomMiddleCell = rightBottomContainer.addCell(new Endeavour.View.FlexiCell({

                    }));

                    rightBottomMiddleCell.addContent(new Endeavour.View.FlexiContent({
                        html: 'Right bottom middle cell',
                    }));

                    var rightBottomRightCell = rightBottomContainer.addCell(new Endeavour.View.FlexiCell({

                    }));

                    rightBottomRightCell.addContent(new Endeavour.View.FlexiContent({
                        html: 'Right bottom right cell',
                    }));

            this.els.main.append(flexi.render().$el);

            this.render();

        },

    });

});
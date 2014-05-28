$(function() {

    window.Endeavour.View.FlexiContainer = Backbone.Marionette.View.extend({

        tagName: 'div',
        className: 'flexi-container',

        initialize: function() {

            this.resizing = false;
            this.hasMoved = false;
            this.resizeCoords = {
                initial: {x: 0, y: 0},
                last: {x: 0, y: 0},
            };

            this.views = [];
            this.els = {};

            this.cells = [];
            this.cellPos = [];
            this.cellPositionsSet = 0;
            this.handleEls = [];
            this.handleTopPos = [];
            this.handleLeftPos = [];
            this.resizeHandleIndex = null;
            this.resizeCellIndex = 0;

            this.cellOrientation = 'cellOrientation' in this.options ? this.options.cellOrientation : 'vertical';
            this.margin = 'margin' in this.options ? this.options.margin : 0;
            this.spacing = 'spacing' in this.options ? this.options.spacing : 20;

            this.width = this.options.width;
            this.height = this.options.height;

            this.containerID = this.options.containerID;

            this.$el.addClass(this.cellOrientation + '-cells');

        },

        render: function() {

            return this;

        },

        setHeight: function(height) {
            var oldHeight = this.height;
            this.height = height;
            if (this.cellOrientation == 'horizontal') this.updateHorizontalCellPositions(oldHeight, height);
            else this.updateHorizontalCellHeights(oldHeight, height);
            return this;
        },

        setWidth: function(width) {
            var oldWidth = this.width;
            this.width = width;
            if (this.cellOrientation == 'vertical') this.updateVerticalCellPositions(oldWidth, width);
            else this.updateVerticalCellWidths(oldWidth, width);
            return this;
        },

        updateHorizontalCellHeights: function(oldHeight, height) {
            var changeHeight = height - oldHeight;
            var heightIncreased = changeHeight > 0;
            for (var i = 0; i < this.cells.length; i++) {
                if (heightIncreased) this.addCellHeight(i, changeHeight);
                else this.subCellHeight(i, Math.abs(changeHeight));
            }
            return this;
        },

        updateVerticalCellWidths: function(oldWidth, width) {
            var changeWidth = width - oldWidth;
            var widthIncreased = changeWidth > 0;
            for (var i = 0; i < this.cells.length; i++) {
                if (widthIncreased) this.addCellWidth(i, changeWidth);
                else this.subCellWidth(i, Math.abs(changeWidth));
            }
            return this;
        },

        setDimensions: function(height, width) {
            this.setHeight(height);
            this.setWidth(width);
            return this;
        },

        renderCellPositions: function() {

            var totalCells = this.cells.length;

            if (totalCells < 1 || !this.height || this.cellPositionsSet == totalCells) return this;

            this.cellPositionsSet = totalCells;

            for (var i = 0; i < totalCells; i++) {
                this.renderCellPosition(i, totalCells);
            }

            return this;

        },

        getTotalCells: function() {
            return this.cells.length;
        },

        getTotalCellWeights: function() {
            var totalWeights = 0;
            _.each(this.cellPos, function(cellPos) {
                totalWeights += cellPos.weight;
            });
            return totalWeights;
        },

        getTotalCellWeightsUntil: function(cellIndex) {
            var totalWeights = 0;
            _.each(this.cellPos, function(cellPos) {
                if (cellPos.index < cellIndex) totalWeights += cellPos.weight;
            });
            return totalWeights;
        },

        setHandlePosition: function(handleIndex, position) {
            if (this.cellOrientation == 'vertical') this.setHandleLeft(handleIndex, position);
            else this.setHandleTop(handleIndex, position);
            return this;
        },

        nextResizeCell: function() {
            this.resizeCellIndex = this.resizeCellIndex == this.cells.length - 1 ? 0 : this.resizeCellIndex + 1;
            return this.resizeCellIndex;
        },

        prevResizeCell: function() {
            this.resizeCellIndex = this.resizeCellIndex == 0 ? this.cells.length - 1 : this.resizeCellIndex - 1;
            return this.resizeCellIndex;
        },

        getResizeCellIndex: function() {
            return this.resizeCellIndex;
        },

        increaseCellHeights: function(px) {

            var resizeCellIndex = null;
            var numCells = this.cells.length;
            var totalCellWeights = this.getTotalCellWeights();

            for (var i = 0; i < numCells; i++) {

                var cellWeight = this.cellPos[i].weight;

                resizeCellIndex = this.getResizeCellIndex();

                this.addCellHeight(resizeCellIndex, (px/totalCellWeights)*cellWeight);
                this.addNextCellsHorizontal(resizeCellIndex, (px/totalCellWeights)*cellWeight);

                this.nextResizeCell();

            }

        },

        decreaseCellHeights: function(px) {

            var resizeCellIndex = null;
            var numCells = this.cells.length;
            var totalCellWeights = this.getTotalCellWeights();

            for (var i = 0; i < numCells; i++) {

                var cellWeight = this.cellPos[i].weight;

                resizeCellIndex = this.getResizeCellIndex();

                this.subCellHeight(resizeCellIndex, (px/totalCellWeights)*cellWeight);
                this.subNextCellsHorizontal(resizeCellIndex, (px/totalCellWeights)*cellWeight);

                this.prevResizeCell();

            }

        },

        addNextCellsHorizontal: function(cellIndex, px) {

            for (var i = cellIndex + 1; i < this.cells.length; i++) {
                this.addCellTop(i, px);
                this.addHandleTop(i-1, px);
            }

        },

        subNextCellsHorizontal: function(cellIndex, px) {

            for (var i = cellIndex + 1; i < this.cells.length; i++) {
                this.subCellTop(i, px);
                this.subHandleTop(i-1, px);
            }

        },

        updateHorizontalCellPositions: function(oldHeight, newHeight) {

            var changeHeight = newHeight - oldHeight;
            var heightIncreased = changeHeight > 0;

            if (heightIncreased) this.increaseCellHeights(changeHeight);
            else this.decreaseCellHeights(Math.abs(changeHeight));

        },

        increaseCellWidths: function(px) {

            var resizeCellIndex = null;
            var numCells = this.cells.length;
            var totalCellWeights = this.getTotalCellWeights();

            for (var i = 0; i < numCells; i++) {

                var cellWeight = this.cellPos[i].weight;

                resizeCellIndex = this.getResizeCellIndex();

                this.addCellWidth(resizeCellIndex, (px/totalCellWeights)*cellWeight);
                this.addNextCellsVertical(resizeCellIndex, (px/totalCellWeights)*cellWeight);

                this.nextResizeCell();

            }

        },

        decreaseCellWidths: function(px) {

            var resizeCellIndex = null;
            var numCells = this.cells.length;
            var totalCellWeights = this.getTotalCellWeights();

            for (var i = 0; i < numCells; i++) {

                var cellWeight = this.cellPos[i].weight;

                resizeCellIndex = this.getResizeCellIndex();

                this.subCellWidth(resizeCellIndex, (px/totalCellWeights)*cellWeight);
                this.subNextCellsVertical(resizeCellIndex, (px/totalCellWeights)*cellWeight);

                this.prevResizeCell();

            }

        },

        addNextCellsVertical: function(cellIndex, px) {

            for (var i = cellIndex + 1; i < this.cells.length; i++) {
                this.addCellLeft(i, px);
                this.addHandleLeft(i-1, px);
            }

        },

        subNextCellsVertical: function(cellIndex, px) {

            for (var i = cellIndex + 1; i < this.cells.length; i++) {
                this.subCellLeft(i, px);
                this.subHandleLeft(i-1, px);
            }

        },

        updateVerticalCellPositions: function(oldWidth, newWidth) {

            var changeWidth = newWidth - oldWidth;
            var widthIncreased = changeWidth > 0;

            if (widthIncreased) this.increaseCellWidths(changeWidth);
            else this.decreaseCellWidths(Math.abs(changeWidth));

            return this;

        },

        renderCellPosition: function(cellIndex, totalCells) {

            var cell = this.cells[cellIndex];
            var cellWeight = this.cellPos[cellIndex].weight;
            var totalCellWeights = this.getTotalCellWeights();
            var totalCellWeightsBeforeThis = this.getTotalCellWeightsUntil(cellIndex);
            var handlePosition = 0;

            if (this.cellOrientation == 'vertical') {

                cellWidth = Math.round((this.width - ((this.spacing * (totalCells-1)) + (this.margin * 2))) / totalCellWeights);
                cellHeight = this.height - (this.margin*2);

                this.setCellLeft(cellIndex, this.margin + (cellWidth*totalCellWeightsBeforeThis) + (this.spacing*cellIndex));
                this.setCellTop(cellIndex, this.margin);
                this.setCellBottom(cellIndex, this.margin);

                this.setCellDimensions(cellIndex, cellHeight, cellWidth * cellWeight);

                handlePosition = this.margin + (cellWidth*totalCellWeightsBeforeThis) + (this.spacing*cellIndex) - (this.spacing/2) - 2;

            }
            else {

                cellWidth = this.width - (this.margin*2);
                cellHeight = Math.round((this.height - ((this.spacing * (totalCells-1)) + (this.margin * 2))) / totalCellWeights);

                this.setCellLeft(cellIndex, this.margin);
                this.setCellRight(cellIndex, this.margin);
                this.setCellTop(cellIndex, this.margin + (cellHeight*totalCellWeightsBeforeThis) + (this.spacing*cellIndex));
                
                this.setCellDimensions(cellIndex, cellHeight * cellWeight, cellWidth);

                handlePosition = this.margin + (cellHeight*totalCellWeightsBeforeThis) + (this.spacing*cellIndex) - (this.spacing/2) - 2;

            }

            if (cellIndex > 0) this.setHandlePosition(cellIndex - 1, handlePosition);

            return this;

        },

        addCell: function(flexiCellOptions) {

            var cellIndex = this.cells.length;

            if (!flexiCellOptions) flexiCellOptions = {};

            // Add cell to container array
            var flexiCell = this.cells[cellIndex] = new Endeavour.View.FlexiCell(flexiCellOptions);
            var cellWeight = 'weight' in flexiCellOptions ? flexiCellOptions.weight : 1;
            var cellMinWidth = 'minWidth' in flexiCellOptions ? flexiCellOptions.minWidth : 0;
            var cellMinHeight = 'minHeight' in flexiCellOptions ? flexiCellOptions.minHeight : 0;

            // Set cell position defaults
            this.cellPos[cellIndex] = {
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                height: 0,
                width: 0,
                weight: cellWeight,
                index: cellIndex,
                minWidth: cellMinWidth,
                minHeight: cellMinHeight,
            };

            // Add resize handle for each cell not including the first
            if (this.cells.length > 1) {

                var handleIndex = this.handleEls.length;
                var handleEl = this.handleEls[handleIndex] = $('<div class="resize-handle" data-handle-index="' + handleIndex + '"></div>');
                
                handleEl.on('mousedown', $.proxy(this.onResizeMouseDown, this));

                this.$el.append(handleEl);

            }

            // Append cell element to container
            this.$el.append(flexiCell.render().$el);

            // Render cell positions
            this.renderCellPositions();

            return flexiCell;

        },

        /*




            ===================================
            RESIZE FUNCTIONS
            ===================================

        */

        resizeStart: function(handleIndex) {

            this.resizing = true;
            this.resizeHandleIndex = parseInt(handleIndex);
            this.hasMoved = false;
            this.bindDragEvents();
            // this.els.detailsResizer.addClass('resizing');

        },

        resizeMoveX: function(x) {

            if (!this.hasMoved) {
                this.resizeCoords.initial.x = x;
                this.resizeCoords.last.x = x;
                this.hasMoved = true;
                return;
            }

            var movedX = this.resizeCoords.last.x - x;

            if ((movedX > 0 && !this.canSubCellWidth(this.resizeHandleIndex))
                || (movedX < 0 && !this.canSubCellWidth(this.resizeHandleIndex+1))) {
                return this.resizeEnd();
            }

            this.resizeCoords.last.x = x;

            this.subHandleLeft(this.resizeHandleIndex, movedX);
            this.subCellWidth(this.resizeHandleIndex, movedX);
            this.addCellWidth(this.resizeHandleIndex+1, movedX);
            this.subCellLeft(this.resizeHandleIndex+1, movedX);

        },

        resizeMoveY: function(y) {

            if (!this.hasMoved) {
                this.resizeCoords.initial.y = y;
                this.resizeCoords.last.y = y;
                this.hasMoved = true;
                return;
            }

            var movedY = this.resizeCoords.last.y - y;

            if ((movedY < 0 && !this.canSubCellHeight(this.resizeHandleIndex))
                || (movedY > 0 && !this.canSubCellHeight(this.resizeHandleIndex+1))) {
                return this.resizeEnd();
            }

            this.resizeCoords.last.y = y;

            this.subHandleTop(this.resizeHandleIndex, movedY);
            this.subCellHeight(this.resizeHandleIndex, movedY);
            this.addCellHeight(this.resizeHandleIndex+1, movedY);
            this.subCellTop(this.resizeHandleIndex+1, movedY);

        },

        resizeEnd: function() {

            // this.els.detailsResizer.removeClass('resizing');
            this.unbindDragEvents();
            this.resizeHandleIndex = null;
            this.resizing = false;

        },

        bindDragEvents: function() {

            // Doing it this way for better performance
            if (this.cellOrientation == 'vertical') $('body').on('mousemove', $.proxy(this.onBodyMouseMoveX, this));
            else $('body').on('mousemove', $.proxy(this.onBodyMouseMoveY, this));

            $('body').on('mouseup', $.proxy(this.onBodyMouseUp, this));

        },

        unbindDragEvents: function() {

            if (this.cellOrientation == 'vertical') $('body').off('mousemove', $.proxy(this.onBodyMouseMoveX, this));
            else $('body').off('mousemove', $.proxy(this.onBodyMouseMoveY, this));

            $('body').off('mouseup', $.proxy(this.onBodyMouseUp, this));

        },

        /*




            ===================================
            BROWSER EVENTS
            ===================================

        */

        onResizeMouseDown: function(ev) {
            this.resizeStart($(ev.currentTarget).attr('data-handle-index'));
        },

        onBodyMouseMoveX: function(ev) {
            ev.preventDefault();
            this.resizeMoveX(ev.pageX);
        },

        onBodyMouseMoveY: function(ev) {
            ev.preventDefault();
            this.resizeMoveY(ev.pageY);
        },

        onBodyMouseUp: function() {
            this.resizeEnd();
        },

        /*




            ===================================
            CELL TOP POSITIONING
            ===================================

        */

        addCellTop: function(cellIndex, top) {
            return this.setCellTop(cellIndex, this.cellPos[cellIndex].top + top);
        },

        subCellTop: function(cellIndex, top) {
            return this.setCellTop(cellIndex, this.cellPos[cellIndex].top - top);
        },

        setCellTop: function(cellIndex, top) {
            var cell = this.cells[cellIndex];
            this.cellPos[cellIndex].top = top;
            cell.setTop(top);
            return this;
        },

        /*




            ===================================
            CELL BOTTOM POSITIONING
            ===================================

        */

        addCellBottom: function(cellIndex, bottom) {
            return this.setCellBottom(cellIndex, this.cellPos[cellIndex].bottom + bottom);
        },

        subCellBottom: function(cellIndex, bottom) {
            return this.setCellBottom(cellIndex, this.cellPos[cellIndex].bottom - bottom);
        },

        setCellBottom: function(cellIndex, bottom) {
            var cell = this.cells[cellIndex];
            this.cellPos[cellIndex].bottom = bottom;
            cell.setBottom(bottom);
            return this;
        },

        /*




            ===================================
            CELL LEFT POSITIONING
            ===================================

        */

        addCellLeft: function(cellIndex, left) {
            return this.setCellLeft(cellIndex, this.cellPos[cellIndex].left + left);
        },

        subCellLeft: function(cellIndex, left) {
            return this.setCellLeft(cellIndex, this.cellPos[cellIndex].left - left);
        },

        setCellLeft: function(cellIndex, left) {
            var cell = this.cells[cellIndex];
            this.cellPos[cellIndex].left = left;
            cell.setLeft(left);
            return this;
        },

        /*




            ===================================
            CELL RIGHT POSITIONING
            ===================================

        */

        addCellRight: function(cellIndex, right) {
            return this.setCellRight(cellIndex, this.cellPos[cellIndex].right + right);
        },

        subCellRight: function(cellIndex, right) {
            return this.setCellRight(cellIndex, this.cellPos[cellIndex].right - right);
        },

        setCellRight: function(cellIndex, right) {
            var cell = this.cells[cellIndex];
            this.cellPos[cellIndex].right = right;
            cell.setRight(right);
            return this;
        },

        /*




            ===================================
            CELL HEIGHT
            ===================================

        */

        canSubCellHeight: function(cellIndex) {
            var cellPos = this.cellPos[cellIndex];
            return cellPos.minHeight && cellPos.height > cellPos.minHeight;
        },

        addCellHeight: function(cellIndex, height) {
            return this.setCellHeight(cellIndex, this.cellPos[cellIndex].height + height);
        },

        subCellHeight: function(cellIndex, height) {
            // if (!this.canSubCellHeight(cellIndex)) {
            //     return false;
            // }
            return this.setCellHeight(cellIndex, this.cellPos[cellIndex].height - height);
        },

        setCellHeight: function(cellIndex, height) {
            var cell = this.cells[cellIndex];
            this.cellPos[cellIndex].height = height;
            cell.setHeight(height);
            return this;
        },

        /*




            ===================================
            CELL WIDTH
            ===================================

        */

        canSubCellWidth: function(cellIndex) {
            var cellPos = this.cellPos[cellIndex];
            return cellPos.minWidth > 0 && cellPos.width > cellPos.minWidth;
        },

        addCellWidth: function(cellIndex, width) {
            return this.setCellWidth(cellIndex, this.cellPos[cellIndex].width + width);
        },

        subCellWidth: function(cellIndex, width) {
            // if (!this.canSubCellWidth(cellIndex)) {
            //     return false;
            // }
            return this.setCellWidth(cellIndex, this.cellPos[cellIndex].width - width);
        },

        setCellWidth: function(cellIndex, width) {
            var cell = this.cells[cellIndex];
            this.cellPos[cellIndex].width = width;
            cell.setWidth(width);
            return this;
        },

        setCellDimensions: function(cellIndex, height, width) {
            var cell = this.cells[cellIndex];
            this.cellPos[cellIndex].height = height;
            this.cellPos[cellIndex].width = width;
            cell.setDimensions(height, width);
            return this;
        },

        /*




            ===================================
            HANDLE POSITIONING
            ===================================

        */

        addHandleLeft: function(handleIndex, left) {
            return this.setHandleLeft(handleIndex, this.handleLeftPos[handleIndex] + left);
        },

        subHandleLeft: function(handleIndex, left) {
            return this.setHandleLeft(handleIndex, this.handleLeftPos[handleIndex] - left);
        },

        setHandleLeft: function(handleIndex, left) {
            this.handleLeftPos[handleIndex] = left;
            this.handleEls[handleIndex].css('left', left);
            return this;
        },

        addHandleTop: function(handleIndex, top) {
            return this.setHandleTop(handleIndex, this.handleTopPos[handleIndex] + top);
        },

        subHandleTop: function(handleIndex, top) {
            return this.setHandleTop(handleIndex, this.handleTopPos[handleIndex] - top);
        },

        setHandleTop: function(handleIndex, top) {
            this.handleTopPos[handleIndex] = top;
            this.handleEls[handleIndex].css('top', top);
            return this;
        },

    });

});
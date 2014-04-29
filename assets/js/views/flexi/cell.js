$(function() {

    window.Endeavour.View.FlexiCell = Backbone.Marionette.View.extend({

        tagName: 'div',
        className: 'flexi-cell',

        initialize: function() {

            this.defaults = {
                type:         'content',     // content or container
                orientation:  'vertical',    // vertical or horizontal
                left:         0,
                right:        0,
                top:          0,
                bottom:       0,
                height:       0,
                width:        0,
            };

            this.opt = _.extend(this.defaults, this.options);

        },

        render: function() {

            if (this.container) this.container.render();

            return this;

        },

        setDimensions: function(height, width) {
            this.$el.css({height: height});
            this.opt.height = height;
            this.$el.css({width: width});
            this.opt.width = width;
            if (this.container) {
                this.container.setHeight(height);
                this.container.setWidth(width);
                this.render();
            }
            return this;
        },

        getHeight: function() {
            return this.opt.height;
        },

        setHeight: function(height) {
            this.$el.css({height: height});
            this.opt.height = height;
            if (this.container) {
                this.container.setHeight(height);
                this.render();
            }
            return this;
        },

        addHeight: function(height) {
            return this.setHeight(this.opt.height + height);
        },

        subHeight: function(height) {
            return this.setHeight(this.opt.height - height);
        },

        getWidth: function() {
            return this.opt.width;
        },

        setWidth: function(width) {
            this.$el.css({width: width});
            this.opt.width = width;
            if (this.container) {
                this.container.setWidth(width);
                this.render();
            }
            return this;
        },

        addWidth: function(width) {
            return this.setWidth(this.opt.width + width);
        },

        subWidth: function(width) {
            return this.setWidth(this.opt.width - width);
        },

        addLeft: function(left) {
            this.addWidth(left);
            return this.setLeft(this.opt.left + parseInt(left));
        },

        subLeft: function(left) {
            this.subWidth(left);
            return this.setLeft(this.opt.left - parseInt(left));
        },

        setLeft: function(left) {
            this.$el.css('left', left);
            this.opt.left = left;
            return this;
        },

        addRight: function(right) {
            this.addWidth(right);
            return this.setRight(this.opt.right + parseInt(right));
        },

        subRight: function(right) {
            this.subWidth(right);
            return this.setRight(this.opt.right - parseInt(right));
        },

        setRight: function(right) {
            // this.$el.css('right', right);
            // this.opt.right = right;
            return this;
        },

        addTop: function(top) {
            this.addHeight(top);
            return this.setTop(this.opt.top + parseInt(top));
        },

        subTop: function(top) {
            this.subHeight(top);
            return this.setTop(this.opt.top - parseInt(top));
        },

        setTop: function(top) {
            this.$el.css('top', top);
            this.opt.top = top;
            return this;
        },

        addBottom: function(bottom) {
            this.addHeight(bottom);
            return this.setBottom(this.opt.bottom + parseInt(bottom));
        },

        subBottom: function(bottom) {
            this.subHeight(bottom);
            return this.setBottom(this.opt.bottom - parseInt(bottom));
        },

        setBottom: function(bottom) {
            this.$el.css('bottom', bottom);
            this.opt.bottom = bottom;
            return this;
        },

        // setWidth: function(width) {

        //     if (this.type != 'vertical') {
        //         console.error('FlexiCell must be have orientation "vertical" for height resize');
        //         return;
        //     }

        //     this.$el.css({width: width});

        //     return this;

        // },

        // setHeight: function(width) {

        //     if (this.type != 'horizontal') {
        //         console.error('FlexiCell must be have orientation "horizontal" for height resize');
        //         return;
        //     }

        //     this.$el.css({height: height});

        //     return this;

        // },

        addContent: function(flexiContent) {

            if (this.opt.type != 'content') {
                console.error('FlexiCell must be of type "content"');
                return;
            }

            // Set a reference to FlexiContent view
            this.content = flexiContent;

            // Set cell HTML to FlexiContent $el
            this.$el.html(this.content.render().$el);

            return flexiContent;

        },

        addContainer: function(flexiContainer) {

            if (this.opt.type != 'container') {
                console.error('FlexiCell must be of type "container"');
                return;
            }

            // Set a reference to FlexiContainer view
            this.container = flexiContainer;

            // Set cell HTML to FlexiContainer $el
            this.$el.html(this.container.render().$el);

            return flexiContainer;

        },

    });

});
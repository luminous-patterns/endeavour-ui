$(function() {

    window.Endeavour.View.MyAccount = Backbone.Marionette.View.extend({

        id: 'my-account',
        tagName: 'div',

        initialize: function() {

            this.flexi = null;

            this.els = {};

            this.els.main = $('<div class="my-account-flexi"></div>');
            this.els.menu = $('<ul class="side-menu"></ul>');

            this.height = 'height' in this.options ? this.options.height : 0;
            this.width = 'width' in this.options ? this.options.width : 0;

            this.addMenuItem('profile', 'Profile', $.proxy(this.onClickMyInfo, this));
            this.addMenuItem('preferences', 'Preferences', $.proxy(this.onClickMyInfo, this));
            this.addMenuItem('settings', 'Account Settings', $.proxy(this.onClickMyInfo, this));
            this.addMenuItem('security', 'Security', $.proxy(this.onClickMyInfo, this));

            this.$el
                .append("<h1>My Account</h1>")
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

            });
            var rightCell = flexi.addCell({
                weight: 3,
            });

            leftCell.addContent({
                html: this.els.menu,
            });

            rightCell.addContent({
                html: 'Right cell',
            });

            this.render();

        },

        addMenuItem: function(tagClass, label, callback) {

            var menuItemEl = $('<li class="menu-item ' + tagClass + '"><a href="#"></a></li>');
            menuItemEl.find('a').append(label);

            if (typeof callback == 'function') {
                menuItemEl.on('click', callback);
            }
            else {
                menuItemEl.find('a').attr('href', callback);
            }

            this.els.menu.append(menuItemEl);

            return this;

        },

    });

});
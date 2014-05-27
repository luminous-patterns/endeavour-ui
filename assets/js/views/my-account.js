$(function() {

    window.Endeavour.View.MyAccount = Backbone.Marionette.View.extend({

        id: 'my-account',
        tagName: 'div',

        initialize: function() {

            this.flexi = null;

            this.els = {};
            this.sections = {};

            this.els.main = $('<div class="my-account-flexi"></div>');
            this.els.menu = $('<ul class="side-menu"></ul>');
            this.els.sectionContainer = $('<div class="section-container"></div>');

            this.height = 'height' in this.options ? this.options.height : 0;
            this.width = 'width' in this.options ? this.options.width : 0;

            this.addSection('profile', 'Profile & Preferences', Endeavour.View.MyAccountProfile);
            this.addSection('change-password', 'Change Password', Endeavour.View.MyAccountPassword);
            this.addSection('change-email', 'Change Email', Endeavour.View.MyAccountEmail);

            this.setCurrentSection(_.keys(this.sections)[0]);

            this.$el
                .append("<h1>My Account</h1>")
                .append(this.els.main);

        },

        addSection: function(id, title, viewType) {

            this.sections[id] = {
                'title':      title,
                'viewType':   viewType,
            };

            var onMenuItemClick = function(ev) {
                ev.preventDefault();
                this.setCurrentSection(id);
            };

            this.addMenuItem(id, title, $.proxy(onMenuItemClick, this));

            return this;

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
                margin: 10,
                spacing: 10,
            });

            this.els.main.append(flexi.$el);

            flexi.render();

            // Add left cell
            var leftCell = flexi.addCell({

                minWidth: 210,
            });
            var rightCell = flexi.addCell({
                weight: 4,
                minWidth: 660,
            });

            leftCell.addContent({
                html: this.els.menu,
            });

            rightCell.addContent({
                html: this.els.sectionContainer,
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

        setCurrentSection: function(id) {
            return this.setCurrentView(new this.sections[id].viewType);
        },

        setCurrentView: function(view) {

            if (this.currentView) {
                this.closeCurrentView();
            }

            this.currentView = view;

            this.els.sectionContainer.html(view.render().$el);

            return this;

        },

        closeCurrentView: function() {
            this.currentView.close();
            this.currentView = null;
            this.els.sectionContainer.html('');
            return this;
        },

    });

});
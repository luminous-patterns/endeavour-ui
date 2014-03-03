$(function() {

    window.Endeavour.View.Sidebar = Backbone.Marionette.View.extend({

        id: 'main-sidebar',
        tagName: 'div',

        template: function() {
            return $( '<div class="sidebar-item">'
                + '<a class="sidebar-button add-new-button icon-add" href="#">Add new...</a>'
                + '</div>'
                + '<div class="sidebar-submenu add-new-submenu">'
                    + '<div class="sidebar-item">'
                    + '<a class="sidebar-button add-new-list-item-button icon-add" href="#">List Item</a>'
                    + '</div>'
                    + '<div class="sidebar-item">'
                    + '<a class="sidebar-button add-new-list-button icon-add" href="#">List</a>'
                    + '</div>'
                + '</div>'
                + '<div class="sidebar-item">'
                + '<a class="sidebar-button icon-lists" href="#/lists">All lists</a>'
                + '</div>'
                + '<div class="sidebar-item">'
                + '<a class="sidebar-button icon-calendar" href="#/calendar">Calendar</a>'
                + '</div>'
                + '<div class="sidebar-item">'
                + '<a class="sidebar-button icon-today" href="#/today">Today</a>'
                + '</div>'
            );
        },

        initialize: function() {

            this.$el.append(this.template());

            this.els = {};

            this.els.addNewButton = this.$el.find('.add-new-button');
            this.els.addNewSubmenu = this.$el.find('.add-new-submenu');
            this.els.addNewListButton = this.$el.find('.add-new-list-button');
            this.els.addNewListItemButton = this.$el.find('.add-new-list-item-button');

            this.els.addNewSubmenu.hide();

            this.els.addNewButton.on('click', $.proxy(this.onClickAddNew, this));
            this.els.addNewListButton.on('click', $.proxy(this.onClickAddNewList, this));
            this.els.addNewListItemButton.on('click', $.proxy(this.onClickAddNewListItem, this));

        },

        render: function() {

            return this;

        },

        onClickAddNew: function(ev) {
            ev.preventDefault();
            this.els.addNewSubmenu.toggle();
            return this;
        },

        onClickAddNewList: function(ev) {
            ev.preventDefault();
            Endeavour.publish('show:dialog', 'add-new-list');
            console.log('click add new list item');
            return this;
        },

        onClickAddNewListItem: function(ev) {
            ev.preventDefault();
            Endeavour.publish('show:dialog', 'add-new-list-item');
            console.log('click add new list item');
            return this;
        },

    });

});
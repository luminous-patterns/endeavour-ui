$(function() {

    window.Endeavour.View.NewsAnnouncementsPost = Backbone.Marionette.View.extend({

        tagName: 'li',
        className: 'news-post',

        els: {},

        initialize: function() {

            var titleEl = this.els.title = $('<h3></h3>');
            var dateEl = this.els.date = $('<div class="date"></div>');
            var excerptEl = this.els.excerpt = $('<div class="excerpt"></div>');

            this.$el
                .append(titleEl)
                .append(dateEl)
                .append(excerptEl);

        },

        render: function() {

            var model = this.model;

            this.els.title.text(model.get('Title'));
            this.els.date.text(model.getPublishedDate().toDateString());
            this.els.excerpt.html(model.get('Excerpt'));

            return this;

        },

    });

});
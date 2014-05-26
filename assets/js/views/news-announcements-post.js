$(function() {

    window.Endeavour.View.NewsAnnouncementsPost = Backbone.Marionette.View.extend({

        tagName: 'li',
        className: 'news-post',

        els: {},

        initialize: function() {

            var titleEl = this.els.title = $('<h3></h3>');
            var excerptEl = this.els.excerpt = $('<ul class="news-posts"></ul>');

            this.$el
                .append(titleEl)
                .append(excerptEl);

        },

        render: function() {

            var model = this.model;

            this.els.title.html(model.get('Title'));
            this.els.excerpt.html(model.get('Excerpt'));

            return this;

        },

    });

});
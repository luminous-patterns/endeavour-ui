$(function() {

    window.Endeavour.View.NewsAnnouncementsBox = Backbone.Marionette.View.extend({

        tagName: 'div',
        className: 'news-and-announcements',

        els: {},

        loading: false,
        newsPosts: {},

        initialize: function() {

            var titleEl = this.els.title = $('<h2>News &amp; Announcements</h2>');
            var newsPostsListEl = this.els.newsPostsList = $('<ul class="news-posts"></ul>');

            this.$el
                .append(titleEl)
                .append(newsPostsListEl);

            this.collection = new Endeavour.Collection.NewsPosts;
            this.collection.url = Endeavour.serverURL + '/news';
            this.collection.on('add', this.addNewsPost, this);

            this.collection.fetch({
                success: $.proxy(this.onNewsPostsLoadSuccess, this),
                error: $.proxy(this.onNewsPostsLoadError, this),
            });

        },

        render: function() {

            return this;

        },

        isLoading: function() {
            if (arguments.length > 0) {
                this.loading = arguments[0];
                return this.loading;
            }
            else return this.loading;
        },

        onNewsPostsLoadSuccess: function() {
            this.isLoading(false);
            return this;
        },

        onNewsPostsLoadError: function(jqxhr) {

            this.isLoading(false);

            var self = this;
            var response = jqxhr.responseJSON;

            console.log('Error retreiving news announcements::',response);

            return this;

        },

        addNewsPost: function(newsPost) {

            var newsPostView = this.newsPosts[newsPost.get('ID')] = new Endeavour.View.NewsAnnouncementsPost({
                model: newsPost
            });

            this.els.newsPostsList
                .append(newsPostView.render().$el);

        },

    });

});
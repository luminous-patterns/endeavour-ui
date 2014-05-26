$(function() {

    Endeavour.Model.NewsPost = Endeavour.Model.Abstract.extend({

        urlRoot: function() {
            return Endeavour.serverURL + '/news';
        },

        defaults: {
            'ID':                null, // int
            'Title':             null, // int
            'Excerpt':           null, // int
            'Link':              null, // string
            'Published':         null, // str - ISO-8601 date
        },

        initialize: function() {

        },

        getPublishedDate: function() {
            return new Date(this.get('Published'));
        },

        save: function() {
            return this;
        },

    });

    Endeavour.Collection.NewsPosts = Endeavour.Collection.Abstract.extend({
        model: Endeavour.Model.NewsPost
    });

});
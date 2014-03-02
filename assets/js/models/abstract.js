$(function() {

    Endeavour.Model.Abstract = Backbone.Model.extend({

        idAttribute: 'ID',

        fetch: function(options) {
            options = options ? _.clone(options) : {};
            options.beforeSend = Endeavour.ajaxSetHeaders;
            console.log('fetching', options);
            return Backbone.Model.prototype.fetch.call(this, options);
        },

    });

    Endeavour.Collection.Abstract = Backbone.Collection.extend({

        fetch: function(options) {
            options = options ? _.clone(options) : {};
            options.beforeSend = Endeavour.ajaxSetHeaders;
            console.log('fetching', options);
            return Backbone.Collection.prototype.fetch.call(this, options);
        },

    });

});
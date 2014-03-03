$(function() {

    Endeavour.Model.Abstract = Backbone.Model.extend({

        idAttribute: 'ID',

        sync: function(method, model, options) {
            options.beforeSend = Endeavour.ajaxSetHeaders;
            return Backbone.Model.prototype.sync.call(this, method, model, options);
        },

    });

    Endeavour.Collection.Abstract = Backbone.Collection.extend({

        sync: function(method, model, options) {
            options.beforeSend = Endeavour.ajaxSetHeaders;
            return Backbone.Collection.prototype.sync.call(this, method, model, options);
        },

    });

});
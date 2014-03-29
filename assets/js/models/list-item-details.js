$(function() {

    Endeavour.Model.ListItemDetails = Endeavour.Model.Abstract.extend({

        urlRoot: function() {
            return Endeavour.serverURL + '/listitemdetails';
        },

        defaults: {
            'ListItemID':         null, // int
            'Body':               null, // string
            'Modified':           null, // str - ISO-8601 date
        },

        idAttribute: 'ListItemID',

        initialize: function() {

            this.on('sync', this.onSync, this);

            // Add this to global collection
            Endeavour.publish('new:model:listItemDetails', this);

        },

        onSync: function() {
            return this;
        },

    });

});
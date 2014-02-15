Endeavour.Model.Session = Backbone.Model.extend({
    
    defaults: {
        'ID':                 null, // int
        'UserID':             null, // int
        'Key':                null, // str
        'Expiry':             null, // int - Session expiry in seconds
        'Created':            null, // str - ISO-8601 date
        'Revoked':            false, // bool
    },

    initialize: function() {

    },

});
Endeavour.Model.User = Backbone.Model.extend({

    defaults: {
        'ID':                 null, // int
        'EmailAddress':       null, // str
        'FirstName':          null, // str
        'LastName':           null, // str
        'Created':            null, // str - ISO-8601 date
        'Modified':           null, // str - ISO-8601 date
    },

    initialize: function() {

        this.lists = new Endeavour.Collection.Lists;
        this.lists.url = '/users/' + this.id + '/lists';

        this.tags = new Endeavour.Collection.Tags;
        this.tags.url = '/users/' + this.id + '/tags';

        this.reminders = new Endeavour.Collection.Reminders;
        this.reminders.url = '/users/' + this.id + '/reminders';

        this.timetable = new Endeavour.Collection.Timetable;
        this.timetable.url = '/users/' + this.id + '/timetable';


    },

});
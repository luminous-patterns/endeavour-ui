$(function() {

    Endeavour.Model.ListItem = Endeavour.Model.Abstract.extend({

        urlRoot: function() {
            return Endeavour.serverURL + '/listitems';
        },

        defaults: {
            'ID':                 null, // int
            'ParentID':           null, // int
            'UserID':             null, // int
            'Title':              null, // string
            'Description':        null, // string
            'Created':            null, // str - ISO-8601 date
            'Due':                null, // str - ISO-8601 date
            'Completed':          null, // str - ISO-8601 date
            'Deleted':            null, // boolean
        },

        created: null,
        due: null,
        completed: null,

        initialize: function() {

            this.on('change:Created', this.onChangeCreated, this);
            this.on('change:Due', this.onChangeDue, this);
            this.on('change:Completed', this.onChangeCompleted, this);

            this.on('sync', this.onSync, this);

            // Add this to global collection
            Endeavour.publish('new:model:listItem', this);

        },

        onChangeCreated: function() {
            var created = this.get('Created');
            if (created && typeof created == 'object') {
                this.created = Endeavour.newDate(created.date);
            }
            return this;
        },

        onChangeDue: function() {
            var due = this.get('Due');
            if (due && typeof due == 'object') {
                this.due = Endeavour.newDate(due.date);
            }
            return this;
        },

        onChangeCompleted: function() {
            var completed = this.get('Completed');
            if (completed && typeof completed == 'object') {
                this.completed = Endeavour.newDate(completed.date);
            }
            return this;
        },

        toggleComplete: function() {
            if (this.get('Completed')) {
                this.save('Completed', 0, {patch: true});
            }
            else {
                this.save('Completed', 'now', {patch: true});
            }
            return this;
        },

        setListID: function(ListID) {

            var lastListID = this.get('ListID');
            var lastList = Endeavour.collection.lists.get(lastListID);

            var list = Endeavour.collection.lists.get(ListID);
            
            if (lastList) lastList.items.remove(this);
            if (list) list.items.add(this);

            console.log('moving item from' +lastListID+' to ' +ListID,lastList, list);

            this.save({ListID: ListID}, {patch: true});

            return this;

        },

        onSync: function() {
            return this;
        },

    });

    Endeavour.Collection.ListItems = Endeavour.Collection.Abstract.extend({
        model: Endeavour.Model.ListItem
    });

});
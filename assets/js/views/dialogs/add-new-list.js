$(function() {

    window.Endeavour.View.DialogAddNewList = Endeavour.View.FormDialog.extend({

        id: 'add-new-dialog',

        fields: [{
            id: 'list-title',
            type: 'input',
            label: 'Title',
            value: '',
            inputKey: 'Title',
            pos: 1,
        },
        {
            id: 'list-title',
            type: 'hidden',
            label: 'Title',
            value: '',
            inputKey: 'ParentID',
            pos: 1,
        }],

        initialize: function() {

            Endeavour.View.FormDialog.prototype.initialize.apply(this, arguments);

            if ('ParentID' in this.options) {
                this.fields[1].$el.val(this.options.ParentID);
            }

            this.setTitle('Add New List');

        },

        submit: function() {
            var inputs = this.getInputs();
            if ('ParentID' in inputs) {
                parentID = inputs.ParentID;
                parentModel = Endeavour.collection.lists.get(parentID);
                if (parentModel) {
                    parentModel.createList(inputs);
                }
                else {
                    parentModel = new Endeavour.Model.List({ID: parentID});
                    parentModel.on('sync', function() {
                        parentModel.createList(inputs);
                    });
                    parentModel.fetch();
                }
            }
            else {
                Endeavour.state.session.user.createList(inputs);
            }
            return this.closeDialog();
        },

    });

});
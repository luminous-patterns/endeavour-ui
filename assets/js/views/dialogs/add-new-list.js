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
            id: 'parent-id',
            type: 'hidden',
            label: 'Parent ID',
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

            var self = this;
            var inputs = this.getInputs();

            if (!inputs.Title || !inputs.Title.trim()) {
                Endeavour.alert({
                    message: 'Please enter a title',
                    callback: function() {
                        self.getFieldByID('list-title').$el.focus();
                    },
                });
                return this;
            }

            if ('ParentID' in inputs && inputs.ParentID) {
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
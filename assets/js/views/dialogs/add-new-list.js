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
        }],

        initialize: function() {

            Endeavour.View.FormDialog.prototype.initialize.apply(this, arguments);

            this.setTitle('Add New List');

        },

        submit: function() {
            Endeavour.state.session.user.createList(this.getInputs());
            return this.closeDialog();
        },

    });

});
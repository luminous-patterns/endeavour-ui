$(function() {

    window.Endeavour.View.DialogAddNewListItem = Endeavour.View.Dialog.extend({

        id: 'add-new-dialog',

        fields: [{
            id: 'item-summary',
            type: 'input',
            label: 'Summary',
            value: '',
            inputKey: 'Summary',
            pos: 1,
        },
        {
            id: 'item-details',
            type: 'textarea',
            label: 'Details (e.g. chocolate, with sprinkles)',
            value: '',
            inputKey: 'Details',
            pos: 2,
        },
        {
            id: 'item-due',
            type: 'datetime',
            label: 'Due on',
            value: '',
            inputKey: 'Due',
            pos: 3,
        }],

        submit: function() {

            var activeListModel = Endeavour.state.getActiveModel('list');

            if (activeListModel) {
                activeListModel.createItem(this.getInputs());
                return this.closeDialog();
            }

            return this;

        },

    });

});
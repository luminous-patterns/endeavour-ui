$(function() {

    window.Endeavour.View.FormDialog = Endeavour.View.Dialog.extend({

        events: {
            'click .call-to-action': 'onClickSubmit',
            'click .cancel':         'onClickCancel',
            'submit form':           'onSubmitForm',
        },

        fields: [{
            type: 'plaintext',
            value: 'No fields!',
            pos: 1,
        }],

        initialize: function() {

            Endeavour.View.Dialog.prototype.initialize.apply(this, arguments);

            this.validationErrorMessage = '';

            this.els.form = $('<form></form>');

            this.els.buttonSection = $('<div class="dialog-section button-section"><button type="button" class="cancel">Cancel</button><button type="submit" class="call-to-action">Create</button></div>');
            this.els.submitButton = this.els.buttonSection.find('.call-to-action');
            this.els.cancelButton = this.els.buttonSection.find('.cancel');

            this.els.errorMessage = $('<div class="error-message"></div>');
            this.els.errorContainer = $('<div class="dialog-section error-section"></div>');

            this.els.errorContainer
                .append(this.els.errorMessage)
                .hide();

            this.$el
                .append(this.els.form)
                .prepend(this.els.errorContainer);

            this.createFormEls();

            this.els.form.append(this.els.buttonSection);

            console.log('initialize form dialog');

        },

        sortFields: function(field) {
            return field.pos;
        },

        createFormEls: function() {

            if (!this.fields) return this;

            var orderedFields = this.orderedFields = _.sortBy(this.fields, this.sortFields);

            for (var i = 0; i < orderedFields.length; i++) {

                var field = orderedFields[i];
                var className = 'className' in field ? field.className : '';

                switch (field.type) {
                    case 'plaintext':
                        field.containerEl = $('<div class="plaintext"><div>' + field.value + '</div></div>');
                        field.$el = field.containerEl.find('div');
                        break;
                    case 'input':
                        field.containerEl = $('<div class="dialog-section">'
                            + '<label for="' + field.id + '">' + field.label + '</label>'
                            + '<input type="text" id="' + field.id + '" class="full-width" value="' + field.value + '" />'
                            + '</div>');
                        field.$el = field.containerEl.find('#' + field.id);
                        break;
                    case 'textarea':
                        field.containerEl = $('<div class="dialog-section">'
                            + '<label for="' + field.id + '">' + field.label + '</label>'
                            + '<textarea id="' + field.id + '" class="full-width ' + className + '">' + field.value + '</textarea>'
                            + '</div>');
                        field.$el = field.containerEl.find('#' + field.id);
                        break;
                    case 'rating':
                        field.containerEl = $('<div class="dialog-section">'
                            + '<label for="' + field.id + '">' + field.label + '</label>'
                            + '<ol class="rating-stars">'
                            + '<li class="rating-star"></li><li class="rating-star"></li><li class="rating-star"></li><li class="rating-star"></li><li class="rating-star"></li>'
                            + '</ol>'
                            + '<span class="rating-value">No rating</span>'
                            + '<input type="hidden" id="' + field.id + '" value="' + field.value + '" />'
                            + '</div>');
                        field.containerEl.find('ol.rating-stars li.rating-star')
                            .on('mouseover', $.proxy(this.onRatingStarMouseOver, field))
                            .on('mouseout', $.proxy(this.onRatingStarMouseOut, field))
                            .on('click', $.proxy(this.onRatingStarClick, field));
                        field.$valueDisplayEl = field.containerEl.find('span.rating-value');
                        field.$el = field.containerEl.find('#' + field.id);
                        field.formDialog = this;
                        break;
                    case 'datetime':
                        field.containerEl = $('<div class="dialog-section">'
                            + '<label for="' + field.id + '-year">Due on</label>'
                            + '<div class="input date-input"><input type="text" id="' + field.id + '-year" class="date-year" value="YYYY" /><span>-</span><input type="text" id="' + field.id + '-month" value="MM" /><span>-</span><input type="text" id="' + field.id + '-date" value="DD" /></div>'
                            // + ' @ '
                            // + '<div class="input time-input"><input type="text" id="' + field.id + '-hour" value="HH" /><span>:</span><input type="text" id="' + field.id + '-minute" value="MM" /></div>'
                            + '<input type="hidden" id="' + field.id + '" value="' + field.value + '" />'
                            + '</div>');
                        field.containerEl.find('input')
                            .on('change', $.proxy(this.onDateTimeInputChange, field))
                            .on('focus', $.proxy(this.onDateTimeInputFocus, field))
                            .on('blur', $.proxy(this.onDateTimeInputBlur, field));
                        field.$el = field.containerEl.find('#' + field.id);
                        break;
                }

                this.els.form.append(field.containerEl);

            }

            return this;

        },

        setSubmitText: function(text) {
            this.els.submitButton.html(text);
            return this;
        },

        render: function() {
            console.log('### render form dialog');
            return this;
        },

        focusField: function() {
            this.orderedFields[0].$el.focus();
            return this;
        },

        getInputs: function() {

            var inputs = {};

            _.each(this.fields, function(field) {
                inputs[field.inputKey] = field.$el.val();
                if (field.type == 'datetime' && field.$el.val()) inputs[field.inputKey] = new Date(field.$el.val());
            });

            return inputs;

        },

        submit: function() {
            console.log('no submit handler set',this.getInputs());
            return this;
        },

        showError: function(error) {
            this.els.errorMessage.html(error);
            this.els.errorContainer.show();
            return this;
        },

        hideError: function() {
            this.els.errorContainer.hide();
            return this;
        },

        onClickSubmit: function(ev) {
            ev.preventDefault();
            return this.submit();
        },

        onClickCancel: function(ev) {
            ev.preventDefault();
            return this.closeDialog();
        },

        onSubmitForm: function(ev) {
            ev.preventDefault();
            return this.submit();
        },

        onClose: function() {

            var orderedFields = this.orderedFields = _.sortBy(this.fields, this.sortFields);

            for (var i = 0; i < orderedFields.length; i++) {

                var field = orderedFields[i];
                if (field.type == 'datetime' && field.datePicker)  {
                    field.datePicker.close();
                    delete field.datePicker;
                }

            }

        },

        onDateTimeInputFocus: function(ev) {

            // Context of a field item
            var field = this;

            // The specific input el
            var el = $(ev.delegateTarget);
console.log('datetimeinputfocus',field.datePicker);
            if ('datePicker' in field && field.datePicker) return;

            var datePickerOptions = {

            };

            if (field.$el.val()) datePickerOptions.selectedDate = new Date(field.$el.val());

            var datePicker = field.datePicker = new Endeavour.View.DatePicker(datePickerOptions);

            el.parent().append(datePicker.render().$el);

            datePicker.on('date-selected', function(date) {
                field.$el.val(date.toJSON());
                var dateTimeArray = date.toJSON().split('T');
                var dateArray = dateTimeArray[0].split('-');
                field.containerEl.find('#' + field.id + '-year').val(dateArray[0]);
                field.containerEl.find('#' + field.id + '-month').val(dateArray[1]);
                field.containerEl.find('#' + field.id + '-date').val(dateArray[2]);
                datePicker.close();
                delete field.datePicker;
            });

        },

        onDateTimeInputBlur: function(ev) {

            // Context of a field item
            var field = this;

            // if (!('datePicker' in field) || !field.datePicker) return;

            // field.datePicker.close();
            // delete field.datePicker;

        },

        onDateTimeInputChange: function(ev) {

            Endeavour.alert({message:'dont do that...'});

        },

        onRatingStarMouseOver: function(ev) {
            var rating = $(ev.target).prevAll('li').length+1;
            this.formDialog.setRatingStars(rating, this);
        },

        onRatingStarMouseOut: function(ev) {
            var rating = this.$el.val();
            this.formDialog.setRatingStars(rating, this);
        },

        onRatingStarClick: function(ev) {
            var rating = $(ev.target).prevAll('li').length+1;
            this.$el.val(rating);
            this.formDialog.setRatingStars(rating, this);
        },

        setRatingStars: function(num, field) {
            var count = 1;
            field.containerEl.find('.rating-stars .rating-star').each(function(i, el) {
                $(el).removeClass('active');
                if (count <= num) {
                    $(el).addClass('active');
                }
                count++;
            });
            var ratingText = num ? num + ' out of 5' : 'No rating';
            field.$valueDisplayEl.html(ratingText);
            return this;
        },

    });

});
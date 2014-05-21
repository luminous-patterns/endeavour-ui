$(function() {

    Endeavour.on('initialize:before', function(options) {
        console.log('Initialization Starting...');
        options.router = new Endeavour.Router();
    });

    Endeavour.on('initialize:after', function(options) {
        console.log('Initialization Finished');
    });

    Endeavour.on('start', function(options) {

        if (navigator.userAgent && /Android|iPhone|iPad|iPod|IEMobile|BlackBerry/i.test(navigator.userAgent)){
            window.location = 'https://m.endeavourapp.com/' + window.location.hash;
            return;
        }

        if (/^http\:\/\//i.test(window.location)){
            window.location = 'https://beta.endeavourapp.com/' + window.location.hash;
            return;
        }

        console.log('Endeavour start',options);

        // Copy options to Endeavour object
        window.Endeavour.router = options.router;
        window.Endeavour.state = new Endeavour.Model.State;

        // Global collections ...
        window.Endeavour.collection = {};
        window.Endeavour.collection.lists = new Endeavour.Collection.Lists;
        window.Endeavour.collection.listItems = new Endeavour.Collection.ListItems;

        // ... listen for new models
        window.Endeavour.subscribe('new:model:list', function(model) {Endeavour.collection.lists.add(model)});
        window.Endeavour.subscribe('new:model:listItem', function(model) {Endeavour.collection.listItems.add(model)});

        // Load stage view
        window.Endeavour.stage = new Endeavour.View.Stage({
            height: $(window).height(),
            width: $(window).width(),
        });
        $('body').prepend(window.Endeavour.stage.render().$el);

        $(document).ajaxError(function(event, jqxhr, settings, exception) {
            switch (jqxhr.status) {
                case 400:
                    var response = jqxhr.responseJSON;
                    console.log('Bad request [' + response.error + ']: ', response.error_description);
                    switch (response.error) {
                        case 'invalid_session':
                            if (Endeavour.state.getSavedSessionKey()) {
                                Endeavour.state.clearSavedSessionKey();
                                Endeavour.alert({
                                    message: 'Your session has expired.',
                                    callback: function() { window.location.reload(); },
                                });
                            }
                            break;
                    }
                    break;
                case 404:
                    var response = jqxhr.responseJSON;
                    console.log('Not found [' + response.error + ']: ', response.error_description);
                    break;
                case 500:
                    var response = jqxhr.responseJSON;
                    console.log('Internal error [' + response.error + ']: ', response.error_description);
                    break;
            }
        });

        window.Endeavour.checkin = function() {
            if (!Endeavour.state.isLoggedIn()) return;
            window.Endeavour.post({
                url: '/check-in',
                data: {},
                beforeSend: Endeavour.ajaxSetHeaders,
            });
            console.log('beat', this.get('runs'));
        };

        Endeavour.internalTimer = new Endeavour.Model.InternalTimer;
        Endeavour.subscribe('beat', Endeavour.checkin, Endeavour.internalTimer);

        // Alerts & Confirmation Dialogs
        Endeavour.alert = function(options) {

            var message = options.message;
            var callback = options.callback;

            var dialog = new Endeavour.View.AlertDialog({
                message: message,
                callback: callback,
            });

            Endeavour.haltWithDialog(dialog);

        }

        Endeavour.confirm = function(options) {

            var message = options.message;
            var onConfirm = options.onConfirm;
            var onCancel = options.onCancel;

            var dialog = new Endeavour.View.ConfirmDialog({
                message: message,
                onConfirm: onConfirm,
                onCancel: onCancel,
            });

            Endeavour.haltWithDialog(dialog);

        }

        Endeavour.haltWithDialog = function(dialog) {

            var onClose = function() {
                // Resume internal timer
                Endeavour.internalTimer.start();
            };

            // Pause internal timer
            Endeavour.internalTimer.stop();

            dialogContainer = new Endeavour.View.DialogContainer({
                dialog: dialog,
                onCloseDialog: onClose,
            });

            $('body').append(dialogContainer.render().$el);

            dialogContainer.focusDialogField();

        }

        $(window).on('resize', function() {
            Endeavour.stage.resize($(window).height(), $(window).width());
        });

        // Start backbone history
        Backbone.history.start({pushState: false});

        // Start internal timer
        Endeavour.internalTimer.start();

    });

    Endeavour.start({});

});
$(function() {

    Endeavour.on('initialize:before', function(options) {
        console.log('Initialization Starting...');
        options.router = new Endeavour.Router();
    });

    Endeavour.on('initialize:after', function(options) {
        console.log('Initialization Finished');
    });

    Endeavour.on('start', function(options) {

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
        window.Endeavour.stage = new Endeavour.View.Stage;
        $('body').prepend(window.Endeavour.stage.render().$el);

        $(document).ajaxError(function( event, jqxhr, settings, exception ) {
            console.log(arguments);
        });

        // Start backbone history
        Backbone.history.start({pushState: false});

    });

    Endeavour.start({});

});
(function() {

window.Endeavour = {
    Model: {},
    Collection: {},
    View: {},
    Router: {},
};

})();

$(function() {

    new Endeavour.Model.State();

    new Endeavour.Router.App();
    new Endeavour.Router.Site();

    Backbone.history.start({pushState: true});

});
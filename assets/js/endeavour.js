$(function() {

    var Endeavour = window.Endeavour = new Backbone.Marionette.Application();

    Endeavour.serverURL = 'http://api.endeavour.local';

    Endeavour.publish = Backbone.Events.trigger;
    Endeavour.subscribe = Backbone.Events.on;
    Endeavour.unsubscribe = Backbone.Events.off;

    Endeavour.Model = {};
    Endeavour.View = {};
    Endeavour.Layout = {};

    Endeavour.post = function(options) {
        options.type = 'POST';
        return Endeavour.ajax(options);
    };

    Endeavour.get = function(options) {
        options.type = 'GET';
        return Endeavour.ajax(options);
    };

    Endeavour.ajax = function(options) {
        options.url = Endeavour.serverURL + options.url;
        options.dataType = 'json';
        return $.ajax(options);
    };

});
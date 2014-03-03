$(function() {

    var Endeavour = window.Endeavour = new Backbone.Marionette.Application();

    Endeavour.serverURL = 'http://api.endeavour.local';

    Endeavour.publish = Backbone.Events.trigger;
    Endeavour.subscribe = Backbone.Events.on;
    Endeavour.unsubscribe = Backbone.Events.off;

    Endeavour.Collection = {};
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

    Endeavour.ajaxSetHeaders = function(xhr) {
        console.log('set headers');
        if (Endeavour.state.session.isLoggedIn()) {
        console.log('set headers logged in');
            var SessionKey = Endeavour.state.session.get('Key');
            var UserID = Endeavour.state.session.get('UserID');
            if (SessionKey && UserID) {
                xhr.setRequestHeader('Endeavour-Session-Key', SessionKey);
                xhr.setRequestHeader('Endeavour-Auth-User-ID', UserID);
            }
        }
    }

});
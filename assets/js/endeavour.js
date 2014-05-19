$(function() {

    var Endeavour = window.Endeavour = new Backbone.Marionette.Application();

    Endeavour.serverURL = window.location.hostname.match(/endeavourapp\.com$/) ? 'https://api.endeavourapp.com' : 'http://api.endeavour.local';

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

    Endeavour.authedPost = function(options) {
        options.type = 'POST';
        options.beforeSend = Endeavour.ajaxSetHeaders;
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
        if (Endeavour.state.session.isLoggedIn()) {
            var SessionKey = Endeavour.state.session.get('Key');
            var UserID = Endeavour.state.session.get('UserID');
            if (SessionKey && UserID) {
                xhr.setRequestHeader('Endeavour-Session-Key', SessionKey);
                xhr.setRequestHeader('Endeavour-Auth-User-ID', UserID);
            }
        }
    };

    Endeavour.newDate = function(utc_date) {
        var d = utc_date.split(' ');
        var date = d[0].split('-');
        var time = d[1].split(':');
        var o = {
            yy: parseInt(date[0]),
            mm: parseInt(date[1])-1,
            dd: parseInt(date[2]),
            hh: parseInt(time[0]),
            ii: parseInt(time[1]),
            ss: parseInt(time[2]),
        }
        return new Date(Date.UTC(o.yy, o.mm, o.dd, o.hh, o.ii, o.ss));
    };

});
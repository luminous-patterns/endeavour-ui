$(function() {

    Endeavour.Model.InternalTimer = Endeavour.Model.Abstract.extend({

        defaults: {
            'runs':     0,
        },

        initialize: function() {

            this.timeout = null;
            this.running = false;
            this.runEvery = 30; // seconds

            Endeavour.subscribe('end:beat', this.setTimeout, this);

        },

        start: function() {
            if (this.running) return this;
            this.running = true;
            return this.setTimeout();
        },

        stop: function() {
            if (!this.running) return this;
            this.running = false;
            clearTimeout(this.timeout);
            return this;
        },

        setTimeout: function() {
            this.timeout = setTimeout($.proxy(this.execute, this), this.runEvery * 1000);
            return this;
        },

        execute: function() {
            this.set('runs', this.get('runs') + 1);
            Endeavour.publish('beat');
            Endeavour.publish('end:beat');
            return this;
        },

    });

});
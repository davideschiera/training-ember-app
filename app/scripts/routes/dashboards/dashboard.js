SampleApp.DashboardsDashboardRoute = Ember.Route.extend({
    ready: false,
    transition: null,

    beforeModel: function() {
        if (this.transition === null) {
            Ember.run.later(this, function() {
                this.ready = true;
                this.transition.retry();
            }, 2000);
        }
    },

    model: function() {
        return {
            name: 'My Dashboard',
            ready: this.ready
        };
    },

    afterModel: function(model, transition) {
        if (model.ready === false) {
            this.transition = transition;
            transition.abort();
        }
    },

    setupController: function(controller, model) {
        this._super(controller, model);
    }
});

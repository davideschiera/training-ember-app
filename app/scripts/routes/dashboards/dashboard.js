SampleApp.DashboardsDashboardRoute = Ember.Route.extend({
    model: function() {
        return {
            name: 'My Dashboard'
        };
    },

    setupController: function(controller, model) {
        this._super(controller, model);
    }
});

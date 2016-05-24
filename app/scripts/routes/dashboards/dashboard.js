SampleApp.DashboardsDashboardRoute = Ember.Route.extend({
    model: function(param) {
        return Ember.Object.create({
            id: param.id,
            name: 'My Dashboard'
        });
    },

    setupController: function(controller, model) {
        this._super(controller, model);
    },

    actions: {
        editName: function(name) {
            this.controller.set('model.name', name);
        }
    }
});

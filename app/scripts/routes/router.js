require('scripts/routes/dashboards');

SampleApp.Router.map(function() {
    this.route('dashboards', { path: 'dashboards' });

    //
    // Template file location: [foo/bar.hbs]
    // Route        : SampleApp.FooBarRoute = Ember.Route.extend()
    // Controller   : SampleApp.FooBarController = Ember.ObjectController.extend()
    // View         : SampleApp.FooBarView = Ember.View.extend()
    //
});

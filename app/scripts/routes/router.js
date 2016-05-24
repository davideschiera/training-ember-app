require('scripts/routes/dashboards');

SampleApp.Router.map(function() {
    this.resource('dashboards', { path: 'dashboards' }, function() {
        this.route('dashboard', { path: 'dashboard' });
    });

    //
    // Template file location: [foo/bar.hbs]
    // Route        : SampleApp.FooBarRoute = Ember.Route.extend()
    // Controller   : SampleApp.FooBarController = Ember.ObjectController.extend()
    // View         : SampleApp.FooBarView = Ember.View.extend()
    //
});

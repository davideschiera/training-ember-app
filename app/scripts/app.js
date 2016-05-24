SampleApp = Ember.Application.create({
    LOG_TRANSITIONS: true,
    LOG_TRANSITIONS_INTERNAL: true,
    // LOG_ACTIVE_GENERATION: true,
    // LOG_VIEW_LOOKUPS: true
});

SampleApp.DS = Ember.Namespace.create();

require('scripts/components/*');

require('scripts/routes/init');

//
// Init ember data
//
require('scripts/models/init');

SampleApp.ApplicationStore = SampleApp.DS.Store;

//
// Ember-Data global configuration
// http://emberjs.com/api/data/classes/DS.RESTAdapter.html#toc_endpoint-path-customization
//
DS.RESTAdapter.reopen({
    namespace: 'api'
});

//
// Set the reference of SampleApp.store as soon a possible
//
Ember.Application.initializer({
    name: 'app-ember-data-store',
    after: 'ember-data',

    initialize: function(container, application) {
        SampleApp.store = container.lookup('store:main');
    }
});

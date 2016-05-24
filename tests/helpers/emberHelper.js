console.log('=== BEGIN OF TESTS ===');
console.log($(document).width() + ' x ' + $(document).height());
console.log('======================');

SampleApp.rootElement = '#ember-testing';

var breakpointResolve;
var breakpointAutoResolve;

Ember.Test.registerAsyncHelper('pause', function(app, timeout) {
    timeout = (timeout === undefined ? 10*60*1000 : timeout);

    var breakpoint = new Ember.RSVP.Promise(function(resolve) {
        breakpointResolve = resolve;

        breakpointAutoResolve = Ember.run.later(function() {
            resume();
        }, timeout);
    }).then(function() {
        console.info('Execution resumed!');
    });

    console.info('To resume execution, run resume() or wait %@ minutes'.fmt((timeout / 60000).toFixed(1)));

    return wait(breakpoint);
});

Ember.Test.registerHelper('resume', function() {
    if (breakpointResolve) {
        breakpointResolve();
        breakpointResolve = undefined;

        if (breakpointAutoResolve) {
            Ember.run.cancel(breakpointAutoResolve);
            breakpointAutoResolve = undefined;
        }
    }
});

Ember.Test.registerAsyncHelper('clickElement', function(app, selector) {
    if (typeof selector === 'function') {
        return click(selector());
    } else {
        return click(selector);
    }
});

if (SampleApp.setupForTesting) // not available with production library
    SampleApp.setupForTesting();
if (SampleApp.injectTestHelpers) // not available with production library
    SampleApp.injectTestHelpers();

Ember.testing = false;
SampleApp.testing = true;
SampleApp.defaultRoute = 'explore.view.time.index';

function getController(id) {
    return SampleApp.__container__.lookup('controller:' + id);
}

function getRoute(id) {
    return SampleApp.__container__.lookup('route:' + id);
}

function getCurrentPath() {
    return SampleApp.__container__.lookup("controller:application").get("currentPath");
}

function getView(id) {
    return Ember.View.views[id];
}

function getStore() {
    return SampleApp.__container__.lookup('store:main');
}

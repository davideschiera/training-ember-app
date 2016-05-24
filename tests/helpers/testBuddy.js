(function() {

    window.TestBuddy = SampleApp.Testing.TestBuddy = {
        test:           QUnit.test,
        onlyTest:       QUnit.only,
        asyncTest:      QUnit.asyncTest,
        onlyAsyncTest:  function(testName, expected, callback) {
                            if (arguments.length === 2) {
                                return QUnit.only(testName, null, expected, true);
                            } else {
                                return QUnit.only(testName, expected, callback, true);
                            }
                        },
        testSkip:       function() { /* ignore */ },

        createAsyncContext: function() {
            var queue = [];

            return {
                andThen: function(callback) {
                    queue.push(callback);

                    if (queue.length === 1) {
                        queue[0]().then(next, terminate);
                    } else {
                        //
                        // Next callback will be called when previous promise is resolved
                        //
                    }

                    function next(result) {
                        queue.shift();

                        if (queue.length > 0) {
                            //
                            // Execute next callback
                            //
                            var promise = queue[0](result);

                            if (promise) {
                                promise.then(next, terminate);
                            }
                        }

                        return result;
                    }

                    function terminate(result) {
                        start();

                        ok(false, 'Unexpected error: %@'.fmt(result));

                        return result;
                    }
                },

                andFinally: function(callback) {
                    this.andThen(function(result) {
                        start();

                        callback(result);
                    });
                }
            };
        },

        //
        // Creates helper for component unit testing.
        //
        // Notes:
        // * For simplicity, the helper allows you to define the application
        // template and the model to use in it
        // * The same test module can contain both compoent-unit tests and normal
        // tests
        //
        // Example:
        //
        //      var componentUnit;
        //
        //      module('[Component: Block]', {
        //          setup: function() {
        //              // create helper
        //              componentUnit = TestBuddy.componentUnit();
        //          },
        //          teardown: function() {
        //              // cleanup environment
        //              componentUnit.teardown();
        //          }
        //      });
        //
        //      TestBuddy.test('Something', function() {
        //          // define template and model for it
        //          componentUnit.setup(
        //              'Hello, <strong>{{firstName}} {{lastName}}</strong>!',
        //              {
        //              firstName: 'pippo 2',
        //              lastName:  'pluto 2'
        //              },
        //              {
        //                  save: function() {
        //                      // save parameters, or run an assertion
        //                  }
        //              }
        //          );
        //          andThen(function() {
        //              // assertions...
        //          });
        //      });
        //
        componentUnit:  function() {
            var applicationTemplateBackup;
            var applicationRouteBackup;
            var applicationIndexRouteBackup;
            var isInitialized;

            return {
                setup: function(template, model, actions) {
                    //
                    // Replace current application template with an ad-hoc one
                    // defined inline in the HTML.
                    // To do so, first delete the current template.
                    //
                    applicationTemplateBackup = Ember.TEMPLATES.application;
                    delete Ember.TEMPLATES.application;

                    $('#ember-testing').html('<script type="text/x-handlebars">%@</script>'.fmt(template));

                    //
                    // Redefine application route to do nothing but returning the
                    // given model
                    //
                    applicationRouteBackup = SampleApp.ApplicationRoute;
                    SampleApp.ApplicationRoute = Ember.Route.extend({
                        model: function() {
                            return model;
                        },
                        actions: actions
                    });

                    //
                    // Replace application.index route with an empty one.
                    //
                    applicationIndexRouteBackup = SampleApp.IndexRoute;
                    SampleApp.IndexRoute = Ember.Route.extend();

                    isInitialized = true;

                    //
                    // Reset application to apply new template and routes
                    //
                    Ember.run(function() {
                        SampleApp.reset();
                    });

                    //
                    // Visit application route
                    //
                    visit('/');
                },
                teardown: function() {
                    if (isInitialized) {
                        Ember.TEMPLATES.application = applicationTemplateBackup;
                        SampleApp.ApplicationRoute = applicationRouteBackup;
                        SampleApp.IndexRoute = applicationIndexRouteBackup;
                    }
                }
            };
        }
    };

})();

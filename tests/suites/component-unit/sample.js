(function() {

    module('[Sample]', {
        setup: function() {
            // create helper
            componentUnit = TestBuddy.componentUnit();
        },
        teardown: function() {
            // cleanup environment
            componentUnit.teardown();
        }
    });

    TestBuddy.test('Sample', function() {
        // define template and model for it
        componentUnit.setup();

        andThen(function() {
            ok(false);
        });
    });

})();

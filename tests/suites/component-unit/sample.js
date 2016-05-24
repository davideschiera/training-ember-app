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

    TestBuddy.test('Verify data', function() {
        expect(1);

        // define template and model for it
        componentUnit.setup(
            // template
            '{{dashboard-data-panel data=data}}',

            // model
            {
                data: [ 'something', 'different' ]
            },

            // actions
            {}
        );

        andThen(function() {
            strictEqual(find('span').text(), 'something,different', 'Expected data');
        });
    });

    TestBuddy.onlyTest('Reload', function() {
        expect(1);

        var reloaded = false;

        // define template and model for it
        componentUnit.setup(
            // template
            '{{dashboard-data-panel data=data reload="testingReload"}}',

            // model
            {
                data: [ 'something', 'different' ]
            },

            // actions
            {
                testingReload: function() {
                    reloaded = true;
                }
            }
        );

        click('button');

        andThen(function() {
            strictEqual(reloaded, true, 'Expected reloaded');
        });
    });

})();

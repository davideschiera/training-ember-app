(function() {

    module('[Sample]', {
        setup: function() {
            Ember.run(function() {
                SampleApp.reset();
            });
        },
        teardown: function() {
        }
    });

    TestBuddy.test('Open dashboards', function() {
        expect(1);

        visit('/dashboards');

        andThen(function() {
            strictEqual($('ol > li:eq(0) > a').text(), '1 - Davide');
        });
    });

    TestBuddy.test('Click dashboard', function() {
        expect(1);

        visit('/dashboards');
        click('ol > li:eq(0) > a');

        andThen(function() {
            strictEqual($('h2:eq(1)').text(), '1 - My Dashboard');
        });
    });

    TestBuddy.test('Edit name', function() {
        expect(1);

        visit('/dashboards');
        click('ol > li:eq(0) > a');
        click('button:eq(0)');
        fillIn('input', 'Custom Name');
        click('button:eq(0)');

        andThen(function() {
            strictEqual($('h2:eq(1)').text(), '1 - Custom Name');
        });
    });

})();

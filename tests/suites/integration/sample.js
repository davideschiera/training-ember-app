(function() {

    module('[Sample]', {
        setup: function() {
            getUiDashboardsId = $.mockjax({
                url:            '/ui/dashboards',
                responseTime:   10,
                responseText:   {
                                    dashboards: dashboards
                                }
            });

            Ember.run(function() {
                SampleApp.reset();
            });
        },
        teardown: function() {
            $.mockjax.clear();
        }
    });

    var getUiDashboardsId;
    var dashboards = [
        {
            id: 1,
            name: 'Davide'
        },
        {
            id: 2,
            name: 'Claudio'
        },
        {
            id: 3,
            name: 'Andrea'
        },
        {
            id: 4,
            name: 'Dragan'
        },
        {
            id: 5,
            name: 'Fez'
        },
    ];

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

    TestBuddy.onlyTest('Load dashboards', function() {
        expect(1);

        visit('/dashboards');

        andThen(function() {
            strictEqual($('[data-context="dashboards"]').length, 1, 'Expected list');
        });
    });

    TestBuddy.test('Failed loading dashboards', function() {
        expect(1);

        $.mockjax.clear(getUiDashboardsId);
        $.mockjax({
            url:            '/ui/dashboards',
            responseTime:   10,
            status:         404,
            statusText:     'Not Found',
            responseText:   {
                              "errors" : [ {
                                "reason" : "Not found",
                                "message" : "Unknown UI setting: 'dashbo'."
                              } ]
                            }
        });

        visit('/dashboards');

        andThen(function() {
            strictEqual($('[data-output="error"]').text(), 'Failed! Unknown UI setting: \'dashbo\'.', 'expected error');
        });
    });

})();

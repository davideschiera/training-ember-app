require('scripts/controllers/dashboards');
require('scripts/views/dashboards');

require('scripts/routes/dashboards/dashboard');
require('scripts/controllers/dashboards/dashboard');

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

SampleApp.DashboardsRoute = Ember.Route.extend({
    model: function() {
        console.log('Loading model...');

        var model = {
            state:      'loading',
            dashboards: null
        };

        loadDashboards()
            .then(function(dashboards) {
                console.log('Resolve promise');

                Ember.run(function() {
                    Ember.set(model, 'state', 'loaded');
                    Ember.set(model, 'dashboards', dashboards);
                });
            });

        return model;
    },

    afterModel: function(model) {
        console.log('Model loaded!', model);
    }
});


function loadDashboards() {
    return new Ember.RSVP.Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve(dashboards);
        }, 1000);
    });
}


function foo() {
    function call1() {
        console.log('calling call1');

        var promise = new Ember.RSVP.Promise(function(resolve, reject) {
            console.log('executing call1');

            setTimeout(function() {
                console.log('completed call1');

                resolve({ value: 1});
            }, 1000);
        });

        console.log('called call1');

        return promise;
    }
    function call2() {
        console.log('call2');

        return new Ember.RSVP.Promise(function(resolve, reject) {
            setTimeout(function() {
                console.log('completed call2');

                reject({ value: 2});
            }, 500);
        });
    }
    function call3() {
        console.log('call3');

        return new Ember.RSVP.Promise(function(resolve, reject) {
            setTimeout(function() {
                console.log('completed call3');

                resolve({ value: 3});
            }, 1500);
        });
    }

    // return call1()
    //     .then(function() {
    //         return call2();
    //     })
    //     .then(function() {
    //         return call3();
    //     })
    //     .then(function(result) {
    //         console.log('everybody happy ' + result.value);
    //     });

    // return Ember.RSVP.Promise.all([call1(), call2(), call3()])
    //     .then(function(results) {
    //         console.log('everybody happier ' + results.map(function(result) { return result.value; }));
    //     }, function(error) {
    //         console.log('everybody sad ' + error.value);
    //     });

    // return call1()
    //     .then(function() { console.log('suceeded!'); })
    //     .catch(function() { console.log('failed'); })
    //     .finally(function() { console.log('whatever'); });

    return Ember.RSVP.allSettled([call1(), call2(), call3()])
        .then(function(results) {
            if (results.filter(function(result) { return result.state === 'rejected'; }).length === 0) {
                console.log('everybody happy ', results);
            } else {
                console.log('somebody sad ', results);
            }
        });
}
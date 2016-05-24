SampleApp.DashboardPanelComponent = Ember.Component.extend({
    init: function() {
        this._super.apply(this, arguments);

        this.stateProps = {
            loading:    true,
            data:       null,
            name:       null,
            editing:    false
        };

        this.loadData();
    },

    loadData: function() {
        Ember.run.later(this, processData, 1000);

        function processData() {
            Ember.run(this, function() {
                this.set('stateProps', _.extend({}, this.stateProps, {
                    loading:    false,
                    data:       'Lorem ipsum dolor sit amet.'
                }));
            });
        }
    },

    actions: {
        dataReload: function() {
            this.set('stateProps', _.extend({}, this.stateProps, {
                loading:    true,
                data:       null
            }));

            this.loadData();
        },

        edit: function() {
            this.set('stateProps', _.extend({}, this.stateProps, {
                name:       this.get('name'),
                editing:    true
            }));
        },

        save: function() {
            this.get('save')(this.get('stateProps.name'));

            this.set('stateProps', _.extend({}, this.stateProps, {
                name:       null,
                editing:    false
            }));
        }
    }
});
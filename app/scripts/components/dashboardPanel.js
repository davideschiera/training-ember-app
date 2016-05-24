SampleApp.DashboardPanelComponent = Ember.Component.extend({
    init: function() {
        this._super.apply(this, arguments);

        this.stateProps = {
            loading:    true,
            data:       null
        };

        this.loadData();
    },

    loadData: function() {
        setTimeout(processData.bind(this), 2000);

        function processData() {
            Ember.run(this, function() {
                this.set('stateProps.loading', false);
                this.set('stateProps.data', 'Lorem ipsum dolor sit amet.');
            });
        }
    }
});
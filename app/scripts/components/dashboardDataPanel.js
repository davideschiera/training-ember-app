SampleApp.DashboardDataPanelComponent = Ember.Component.extend({
    actions: {
        internalReload: function() {
            this.sendAction('reload');
        }
    }
});

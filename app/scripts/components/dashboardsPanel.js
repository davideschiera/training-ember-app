SampleApp.DashboardsPanelComponent = Ember.Component.extend({
    isLoading: Ember.computed.equal('loadingState', 'loading')
});

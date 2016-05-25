SampleApp.DashboardsPanelComponent = Ember.Component.extend({
    isLoading: Ember.computed.equal('loadingState', 'loading'),

    hasFailed: Ember.computed.equal('loadingState', 'failed'),

    hasData: Ember.computed('loadingState', function() {
        return this.get('loadingState') === 'loaded';
    })
});

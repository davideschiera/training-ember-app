SampleApp.DashboardModel = DS.Model.extend({
    name:       DS.attr(),
    createdOn:  DS.attr(),

    fullname: Ember.computed('id', 'name', function() {
        return this.get('id') + ' ' + this.get('name');
    })
});

SampleApp.DashboardsDashboardController = Ember.ObjectController.extend({
    init: function() {
        this._super.apply(this, arguments);

        this.editNameBound = this.editName.bind(this);
    },

    editName: function(name) {
        this.set('model.name', name);
    }
});

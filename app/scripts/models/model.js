require('scripts/adapters/restAdapter');

SampleApp.Model = DS.Model.extend({
    numericId: Ember.computed('id', function() {
        var id = this.get('id');

        if (Ember.typeOf(id) === 'number') {
            return id;
        } else {
            return parseInt(id, 10);
        }
    }),

    validate: function(error) {
        if (error) {
            return Ember.RSVP.Promise.reject(error);
        } else {
            return Ember.RSVP.Promise.resolve();
        }
    }
});

SampleApp.RESTSerializer = DS.RESTSerializer;

//
// Model to represent a single resource
//
SampleApp.SingleModel = SampleApp.Model.extend();
SampleApp.SingleModel.reopenClass({
    isSingleModel: true
});

SampleApp.RESTSingleModelAdapter = SampleApp.RESTAdapter.extend({
    buildURL: function(type, id, record) {
        //
        // resource ID will not be part of the URL
        //
        return this._super(type, undefined, record);
    }
});

SampleApp.RESTSingleModelSerializer = SampleApp.RESTSerializer.extend({
    normalizePayload: function(payload) {
        //
        // the payload contains a single object; assume predefined ID for the resource
        //
        var prop;
        for (prop in payload) {
            payload[prop].id = 'default';
        }

        return payload;
    },

    serialize: function(record, options) {
        var serialized = this._super(record, options);

        //
        // Remove ID since it's unnecessary for single-model resources
        //
        delete serialized.id;

        return serialized;
    }
});


Ember.OrderedSet.prototype.forEach = function(fn, self) {
    // allow mutation during iteration
    var list = this.toArray();

    for (var i = 0, j = list.length; i < j; i++) {
        fn.call(self, list[i], i);
    }
};

require('scripts/models/model');

//
// Got from ember data
//
// START
//
var get = Ember.get;
var set = Ember.set;
var once = Ember.run.once;
var isNone = Ember.isNone;
var forEach = Ember.EnumerableUtils.forEach;
var indexOf = Ember.EnumerableUtils.indexOf;
var copy = Ember.copy;

function coerceId(id) {
    return id == null ? null : id+'';
}
//
// END
//

SampleApp.DS.Store = DS.Store.extend({
    createRecord: function(typeName, inputProperties) {
        var model = this.modelFor(typeName);

        if (model.isSingleModel) {
            inputProperties.id = 'default';

            //
            // NOTE: Ref. https://github.com/emberjs/data/issues/1931 for more information
            //
            var record = this.getById(typeName, inputProperties.id);
            if (record && record.get('isLoaded') === false) {
                SampleApp.store.unloadRecord(record);
            }

            return this._super(typeName, inputProperties);
        } else {
            return this._super(typeName, inputProperties);
        }
    },

    find: function(type, id, preload) {
        if (id === undefined && preload === undefined) {
            var model = this.modelFor(type);

            if (model.isSingleModel) {
                //
                // if the model represents a single resource, the resource id is assumed to be fixed
                //
                return this._super(type, 'default');
            } else {
                return this._super(type);
            }
        } else if (preload === undefined) {
            return this._super(type, id);
        } else {
            return this._super(type, id, preload);
        }
    },

    all: function(type) {
        var content = this._super(type);
        var model = this.modelFor(type);

        if (model.isSingleModel) {
            //
            // if the model represents a single resource, return the only resource if available
            //
            if (content && content.get('length') === 1) {
                return content.objectAt(0);
            } else {
                return null;
            }
        } else {
            return content;
        }
    },

    //
    // Given a model string type and an object, build the record
    // honoring embedded relationships
    //
    createRecordAndRelations: function(typeName, inputProperties) {
        //
        // This part is taken straight from the library
        //
        // START
        var type = this.modelFor(typeName);
        var properties = copy(inputProperties);

        // If the passed properties do not include a primary key,
        // give the adapter an opportunity to generate one. Typically,
        // client-side ID generators will use something like uuid.js
        // to avoid conflicts.

        if (isNone(properties.id)) {
            properties.id = this._generateId(type);
        }

        // Coerce ID to a string
        properties.id = coerceId(properties.id);

        var record = this.buildRecord(type, properties.id);

        // Move the record out of its initial `empty` state into
        // the `loaded` state.
        record.loadedData();

        // Set the properties specified on the record.
        //record.setProperties(properties); #ADDED comment

        //return record; #ADDED comment

        //
        // END
        //

        var scope = {
            properties: properties,
            store: this,
            record: record
        };

        //
        // Honor relationships
        //
        type.eachRelationship(function(name, meta) {
            if (this.properties[name] !== undefined) {
                var typeKey = meta.type.typeKey;

                if (meta.kind === 'hasMany' && Ember.isArray(this.properties[name])) {
                    //
                    // we are in an hasMany relation and we have an
                    // array of objects
                    //
                    var embeddedRecords = this.properties[name].map(function(embeddedProperties) {
                        return this.store.getOrCreate(typeKey, embeddedProperties);
                    }, this);

                    this.record.get(name).addObjects(embeddedRecords);

                } else if (meta.kind === 'belongsTo') {
                    //
                    // We have a belongsTo relation and we have only
                    // one relation
                    //
                    var embeddedRecord = this.store.getOrCreate(typeKey, this.properties[name]);

                    this.record.set(name, embeddedRecord);
                }

                delete this.properties[name];
            }
        }, scope);

        record.setProperties(properties);

        return record;
    },

    //
    // get or create a model by his id in obj, if not found
    // create a new record with the values in obj for its
    // fields. If properties is an instance of typeKey model it will
    // be returned as is.
    //
    // if called with obj = null, null will be returned
    //
    getOrCreate: function(typeKey, obj) {
        var record = null;
        var model = this.modelFor(typeKey);
        var properties;

        if (obj === null) {
            return null;
        }

        if (model.detectInstance(obj)) {
            return obj;
        }

        if (obj.id) {
            record = this.getById(typeKey, obj.id);
        }

        if (record === null) {

            if (Ember.typeOf(obj.serialize) === 'function') {
                properties = obj.serialize();
            } else {
                properties = obj;
            }

            record = this.createRecordAndRelations(typeKey, properties);
        }

        return record;
    },

    loadFromJson: function(typeName, json, isNew) {
        var model = this.modelFor(typeName);
        var record;
        var payload;
        var root;

        if (model.isSingleModel) {
            //
            // Detect this.clearRelationships() bug
            //
            if (Ember.View.detectInstance(json) === true) {
                throw new Error('You are creating a model from a view object. aborting');
            }

            json.id = 'default';

            root = typeName;
        } else {
            //
            // Detect this.clearRelationships() bug
            //
            if (Ember.View.detectInstance(json) === true) {
                throw new Error('You are creating a model from a view object. aborting');
            }

            if (json.id === undefined) {
                json.id = Ember.generateGuid(json, typeName);
            }

            root = Ember.Inflector.inflector.pluralize(typeName);
        }

        payload = {};
        payload[root] = json;

        SampleApp.store.pushPayload(typeName, payload);

        record = SampleApp.store.getById(typeName, json.id);

        if (isNew) {
            delete record.id;
            record.transitionTo('created.uncommitted');
        }

        return record;
    },

    prefetch: function(type, id) {
        var prefetchId = (id !== undefined ? type + '.' + id : type);

        if (prefetch[prefetchId] === undefined) {
            prefetch[prefetchId] = this.find(type, id).then(function(record) {
                return Ember.RSVP.Promise.resolve(record);
            }, function(error) {
                prefetch[prefetchId] = undefined;
                return Ember.RSVP.Promise.reject(error);
            });
        }

        return prefetch[prefetchId];
    },

    clearPrefetch: function(type, id) {
        var prefetchId = (id !== undefined ? type + '.' + id : type);

        prefetch[prefetchId] = undefined;        
    },

    destroy: function() { 
        this._super.apply(this, arguments);

        //
        // reset prefetch cache
        //
        prefetch = {};
    },

    didSaveRecord: function(record, data) {
        if (record.constructor.keepClientPropsOnSave) {
            record.constructor.keepClientPropsOnSave(record, data);
        }

        this._super.apply(this, arguments);
    },

    recordWasError: function(record, reason) {
        record.adapterDidError(reason);
    }
});

var prefetch = {};

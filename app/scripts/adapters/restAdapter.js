//
// Apply id encoding in url https://github.com/emberjs/data/commit/3681fcf463204bfc0acf307cbe8ff0aa4e95efb9
//
var get = Ember.get;

SampleApp.RESTAdapter = DS.RESTAdapter.extend({
    buildURL: function(type, id, record) {
        var url = [],
            host = get(this, 'host'),
            prefix = this.urlPrefix();

        if (type) { url.push(this.pathForType(type)); }

        //We might get passed in an array of ids from findMany
        //in which case we don't want to modify the url, as the
        //ids will be passed in through a query param
        if (id && !Ember.isArray(id)) { url.push(encodeURIComponent(id)); }

        if (prefix) { url.unshift(prefix); }

        url = url.join('/');
        if (!host && url) { url = '/' + url; }

        return url;
    }
});

SampleApp.RESTAdapter.reopen({
    host: '',

    ajax: function(url, type, hash) {
        if (SampleApp.Settings.supportCORS) {
            hash = hash || {}; // hash may be undefined
            hash.xhrFields = {
                withCredentials: true
            };
        }
        
        return this._super(url, type, hash);
    }
});

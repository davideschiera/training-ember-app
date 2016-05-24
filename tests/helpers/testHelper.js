var registeredMockjaxRequests = {};

function configureStub(url, parameters) {
    var defaultOptions = {
        type:         'GET',
        contentType:  'text/json',
        responseTime: 0
    };
    parameters = $.extend({}, defaultOptions, parameters);

    if (Ember.typeOf(url) === 'string' && /^\/?api/.test(url)) {
        if (SampleApp.Globals.supportCORS) {
            if (url.search('/') === 0) {
                url = url;
            } else {
                url = '/' + url;
            }
        } else {
            if (url.search('/') !== 0) {
                url = '/' + url;
            }
        }
    }

    var options = {
        type:         parameters.type,
        url:          url,
        contentType:  parameters.contentType,
        status:       parameters.status,
        responseTime: parameters.responseTime,
        responseText: parameters.response,
        response:     parameters.callback
    };

    var id = options.type + ':' + options.url;

    var mockjaxId = registeredMockjaxRequests[id];
    if (mockjaxId !== undefined) {
        $.mockjax.clear(mockjaxId);
    }

    registeredMockjaxRequests[id] = $.mockjax(options);
}

function cleanupRegisteredMockjaxes() {
    registeredMockjaxRequests = {};
    $.mockjax.clear();
}

function cleanupStubs() {
    //
    // This does $.mockjax.clear(); internally
    //
    cleanupRegisteredMockjaxes();
}

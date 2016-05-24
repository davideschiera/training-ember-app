(function() {

    function getResponse(data) {
        var response;
        switch (data.format.type) {
            case 'table':
            case 'data':
                response = data;
                response.data = [];
                var t, tz;
                var i, iz;
                var k, kz;
                var d;
                var metricList = Object.keys(data.metrics);
                var keyList = [];
                var valueList = [];
                for (i = 0, iz = metricList.length; i < iz; i++) {
                    metric = metricList[i];
                    if (metric.indexOf('k') === 0) {
                        keyList.push(metric);
                    } else {
                        valueList.push(metric);
                    }
                }

                var text = ['Bacon', 'ipsum', 'dolor', 'amet', 'corned', 'beef', 'ut', 'ut', 'ad', 'andouille', 'Porchetta', 'picanha', 'reprehenderit', 'nostrud', 'shankle', 'salami', 'spare', 'ribs', 'pancetta', 'excepteur', 'frankfurter', 'proident'];
                var index;

                var sampling;
                data.group.by.forEach(function(g) {
                    sampling = sampling || g.value;
                });

                if (sampling) {
                    for (t = data.time.from, tz = data.time.to; t < tz; t = t + sampling) {
                        if (keyList.length > 1) {
                            for (k = 0; k < 3; k++) {
                                d = {
                                    k0: t + sampling
                                };
                                response.data.push(d);

                                for (i = 1; i < keyList.length; i++) {
                                    index = +(Math.random() * (text.length - 1)).toFixed(0);
                                    d[keyList[i]] = text[index];
                                }

                                for (i = 0; i < valueList.length; i++) {
                                    d[valueList[i]] = 50 + Math.random() * 20;
                                }
                            }
                        } else {
                            d = {
                                k0: t + sampling
                            };
                            response.data.push(d);

                            for (i = 0; i < valueList.length; i++) {
                                d[valueList[i]] = 50 + Math.random() * 20;
                            }
                        }
                    }
                } else {
                    for (k = 0; k < 3; k++) {
                        d = {};
                        response.data.push(d);

                        for (i = 0; i < keyList.length; i++) {
                            index = +(Math.random() * (text.length - 1)).toFixed(0);
                            d[keyList[i]] = text[index];
                        }

                        for (i = 0; i < valueList.length; i++) {
                            d[valueList[i]] = 50 + Math.random() * 20;
                        }
                    }
                }

                if (data.sort) {
                    response.data.sort(getSorter(data.sort));
                }

                break;

            case 'map':
            case 'awsMap':
                response = Ember.copy(this.get('map'));
                break;
        }

        response.time = data.time || response.time;

        return response;
    }

    function getStaticResponse(request, parameters, keyCumulative, metricCumulative) {
        var response = request;
        response.data = [];

        var text = parameters.keys || ['Bacon', 'ipsum', 'dolor', 'amet', 'corned', 'beef', 'ut', 'ut', 'ad', 'andouille', 'Porchetta', 'picanha', 'reprehenderit', 'nostrud', 'shankle', 'salami', 'spare', 'ribs', 'pancetta', 'excepteur', 'frankfurter', 'proident'];
        var nodeNames = parameters.nodeNames;
        var i;

        var keyList = [];
        var valueList = [];
        var propertyNames = Object.keys(request.metrics);
        propertyNames.forEach(function(propertyName) {
            if ([undefined, 'concat'].contains(request.group.aggregations[propertyName])) {
                keyList.push(propertyName);
            } else {
                valueList.push(propertyName);
            }
        });

        var isTimeSeries = propertyNames.filter(function(p) { return request.metrics[p] === 'timestamp'; }).length === 1;
        var getIndex;
        var nestedRowCount;
        var maxMetricCumulative = 100;
        var minMetricCumulative = 0;
        var maxKeyCumulative = Number.MAX_VALUE;
        var minKeyCumulative = 0;

        if (isTimeSeries) {
            if (keyList.length === 1) {
                nestedRowCount = 1;
            } else {
                nestedRowCount = parameters.timeSeriesRowCount || parameters.rowCount || 1;
            }

            maxKeyCumulative = nestedRowCount - 1;

            getIndex = indexGetter(nestedRowCount - 1);
        } else {
            getIndex = indexGetter(text.length - 1);
        }

        function getMetricValue(metric, isKey, timeAggregation, groupAggregation, isFirst) {
            var value;

            if (isKey) {
                if (metric === 'host.mac') {
                    value = '00:0c:29:ef:b0:' + (keyCumulative++);
                } else if (metric === 'host.hostName') {
                    value = 'name:node-' + (keyCumulative++);
                } else if (isFirst) {
                    if (nodeNames) {
                        value = nodeNames[keyCumulative++];
                    } else {
                        value = 'name:node-' + (keyCumulative++);
                    }
                } else if (metric === 'agent.id') {
                    value = 666;
                } else {
                    value = text[getIndex()];
                }

                if (timeAggregation === 'distinct' && groupAggregation === 'distinct') {
                    value = [ value ];
                }

                if (keyCumulative >= maxKeyCumulative) {
                    keyCumulative = minKeyCumulative;
                }
            } else {
                if (timeAggregation === 'distinct' && groupAggregation === 'count') {
                    value = 42;
                } else {
                    if (metricCumulative < maxMetricCumulative) {
                        metricCumulative++;
                    } else {
                        metricCumulative = minMetricCumulative;
                    }
                    value = metricCumulative;
                }
            }

            return value;
        }

        var k, d;
        if (isTimeSeries) {
            var from = request.time.from;
            var to = request.time.to;
            var sampling = request.group.by[0].value;

            for (var t = from; t < to; t = t + sampling) {
                for (k = 0; k < nestedRowCount; k++) {
                    d = {};
                    response.data.push(d);

                    for (i = 0; i < keyList.length; i++) {
                        if (request.metrics[keyList[i]] === 'timestamp') {
                            d[keyList[i]] = t + sampling;
                        } else {
                            d[keyList[i]] = getMetricValue(request.metrics[keyList[i]], true, request.group.aggregations[keyList[i]], request.group.groupAggregations[keyList[i]], (i === 0));
                        }
                    }

                    for (i = 0; i < valueList.length; i++) {
                        d[valueList[i]] = getMetricValue(request.metrics[valueList[i]], false, request.group.aggregations[valueList[i]], request.group.groupAggregations[valueList[i]]);
                    }
                }
            }
        } else {
            for (k = 0; k < parameters.rowCount; k++) {
                d = {};
                response.data.push(d);

                for (i = 0; i < keyList.length; i++) {
                    d[keyList[i]] = getMetricValue(request.metrics[keyList[i]], true, request.group.aggregations[keyList[i]], request.group.groupAggregations[keyList[i]], (i === 0));
                }

                for (i = 0; i < valueList.length; i++) {
                    d[valueList[i]] = getMetricValue(request.metrics[valueList[i]], false, request.group.aggregations[valueList[i]], request.group.groupAggregations[valueList[i]]);
                }
            }
        }

        if (request.sort) {
            response.data.sort(getSorter(request.sort));
        }

        return response;

        function indexGetter(max) {
            var index = 0;

            return function() {
                index++;

                if (index > max) {
                    index = 0;
                }

                return index;
            };
        }
    }

    function getSorter(sortList) {
        var metric = Object.keys(sortList[0])[0];
        if (sortList[0][metric] === 'asc') {
            return function(a, b) {
                var da = a[metric];
                var db = b[metric];

                if (da === null && db !== null) {
                    return -1;
                } else if (da !== null && db === null) {
                    return 1;
                } else if (da < db) {
                    return -1;
                } else if (da === db) {
                    return 0;
                } else {
                    return 1;
                }
            };
        } else {
            return function(a, b) {
                var da = a[metric];
                var db = b[metric];

                if (da === null && db !== null) {
                    return 1;
                } else if (da !== null && db === null) {
                    return -1;
                } else if (da < db) {
                    return 1;
                } else if (da === db) {
                    return 0;
                } else {
                    return -1;
                }
            };
        }
    }

    SampleApp.Testing.RequestStubs.DataFactory = Ember.Object.extend({
        map: Ember.computed(function() {
            var map = generateBaseMapOverviewReal();
            delete map.time;

            return map;
        }),

        getData: function(data) {
            return getResponse.call(this, data);
        },

        post: function(response, callback, filterCallback) {
            var me = this;
            if (arguments.length >= 1) {
                if (Ember.typeOf(response) === 'function' || response === null) {
                    filterCallback = callback;
                    callback = response;
                    response = undefined;
                }
            }

            return new Ember.RSVP.Promise(function(resolve, reject) {
                function responseCallback(request) {
                    var data = JSON.parse(request.data);
                    var result;
                    if (data.requests) {
                        result = {
                            request:    data,
                            response:   { responses: data.requests.map(function(request) { return request; }).map(buildResponse) }
                        };
                    } else {
                        result = {
                            request:    data,
                            response:   buildResponse(data)
                        };
                    }

                    this.responseText = result.response;

                    resolve(result);

                    if (callback) {
                        callback(result);
                    }

                    function buildResponse(data) {
                        var response;
                        if (response) {
                            response = Ember.copy(response);
                            response.time = data.time;
                        } else if (filterCallback) {
                            response = filterCallback.apply(me, [ data ]);
                        } else {
                            response = getResponse.apply(me, [ data ]);
                        }

                        return response;
                    }
                }

                configureStub('/api/data/batch', {
                    type:     'POST',
                    callback: responseCallback
                });

                configureStub(/api\/data\?format=([\w]+)/, {
                    type:     'POST',
                    callback: responseCallback
                });
            });
        }
    });

    SampleApp.Testing.RequestStubs.DataFactory.reopenClass({
        getStaticData: function(request, parameters, keyCumulative, metricCumulative) {
            return getStaticResponse(request, parameters, keyCumulative || 0, metricCumulative || 0);
        },

        configureDataAndGrouping: function(parameters, getData, callback, filterCallback) {
            var configuration = _.extend({
                groupId:        'groupId',
                groupMetrics:   [ 'host.mac', 'container.id' ],
                rowCount:       10,
                time:           {
                                    from:   1000000,
                                    to:     2000000
                                },
                skipGroupingApi: false
            }, parameters);

            if (configuration.skipGroupingApi !== true) {
                //
                // Grouping configuration
                //
                var groupConfigurations = [
                    {
                        id:     configuration.groupId,
                        groups: [
                                    {
                                        filters:    [],
                                        groupBy:    configuration.groupMetrics.map(function(metric) {
                                                        return {
                                                            metric: metric
                                                        };
                                                    })
                                    }
                                ]
                    }
                ];

                configureStub('/api/groupConfigurations/', {
                    response: { groupConfigurations: groupConfigurations }
                });
            }

            //
            // Data configuration
            //
            SampleApp.Testing.RequestStubs.DataFactory.create().post(function(result) {
                dataRequest = result.request;
            }, function(request) {
                if (callback) {
                    callback(request);
                }

                var response = request;
                if (getData) {
                    response.data = getData(request);
                }

                if (Ember.isNone(getData) || response.data === undefined) {
                    if (request.format.type === 'map') {
                        response = configuration.legacyMap;
                        response.time = request.time;
                    } else {
                        response = SampleApp.Testing.RequestStubs.DataFactory.getStaticData(request, configuration);
                    }
                }

                if (filterCallback) {
                    response = filterCallback(request, response);
                }

                return response;
            });
        }
    });

    SampleApp.Testing.RequestStubs.Data = SampleApp.Testing.RequestStubs.DataFactory.create();

})();

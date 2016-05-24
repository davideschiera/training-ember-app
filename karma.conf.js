/*jshint undef:false */

// Karma configuration
module.exports = function(config) {

  var junitReporterOutputFile = (config.testModule || 'default') + '.xml';

  config.set({

    // Base path that will be used to resolve files and exclude.
    basePath : '',

    // Testing framework to be used, default is `jasmine`.
    frameworks : [
      'qunit'
    ],

    // Test results reporter to use.
    // Possible values: 'dots', 'progress', 'junit'
    reporters: ['progress', 'junit'],

    // the default configuration
    junitReporter: {
      outputDir:        'build-result',             // results will be saved as $outputDir/$browserName.xml
      outputFile:       junitReporterOutputFile,    // if included, results will be saved as $outputDir/$browserName/$outputFile
      suite:            '',                         // suite will become the package name attribute in xml testsuite element
      useBrowserName:   false                       // add browser name to report and classes names
    },

    // Web server port.
    port : 9876,

    // Cli runner port.
    runnerPort : 9100,


    // Enable / disable colors in the output (reporters and logs).
    colors : true,


    // Level of logging. Possible values are:
    //
    // * LOG_DISABLE
    // * LOG_ERROR
    // * LOG_WARN
    // * LOG_INFO
    // * LOG_DEBUG
    logLevel : config.LOG_INFO,

    // Enable / disable watching files and executing tests whenever any of them
    // changes.
    autoWatch : false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers : ['Chrome'],


    // If the browser does not capture in the given timeout [ms], then kill it.
    captureTimeout : 120000,

    // How long does Karma wait for a message from a browser before disconnecting it (in ms).
    browserNoActivityTimeout: 120000,


    // Continuous Integration mode.
    // If it's `true`, then it captures browsers, runs the tests and exits.
    singleRun : true,

    customLaunchers: {
        PhantomJSDebug : {
            base: 'PhantomJS',
            options: {
                windowName: 'my-window',
                settings: {
                    webSecurityEnabled: false
                },
            },
            flags: ['--load-images=true'],
            debug: true
        },

        PhantomJSFixedViewport: {
            base: 'PhantomJS',
            options: {
                viewportSize: {
                    width: 1280,
                    height: 720
                },
                onCallback: function(data){
                    if (data.type === 'render' && typeof data.fname === 'string') {
                        page.render(data.fname);
                    }
                }
            }
        }
    }
  });
};

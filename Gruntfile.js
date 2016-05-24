/*jshint multistr: true */
// Generated on 2014-03-11 using generator-ember 0.8.3
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    var isBackgroundEnabled = grunt.option('background') !== false; // defaults to true

    var gitCommit = 'n.a';
    var versionMajorNumber = '2';
    var versionBuildNumber = '42';
    var buildDate = 'n.a';

    if (process.env.GIT_COMMIT) {
        gitCommit = process.env.GIT_COMMIT.toString();
    }

    if (process.env.BUILD_NUMBER) {
        versionBuildNumber = process.env.BUILD_NUMBER.toString();
    }

    var supportCORS = false;
    var destDir = '';
    var isOnPremise = process.env.ON_PREMISE || 'false';

    //
    // fix browser paths for Karma on Windows machines
    //
    if (!process.env.CHROME_BIN) {
        if (process.env.OS === 'Windows_NT') {
            process.env.CHROME_BIN = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
        }

        if (process.platform === 'linux') {
            if (grunt.file.exists('/opt/google/chrome/google-chrome')) {
                process.env.CHROME_BIN = '/opt/google/chrome/google-chrome';
            } else {
                process.env.CHROME_BIN = '/usr/bin/chromium-browser';
            }
        }
    }

    var cmp = grunt.file.readJSON('components.json');
    var componentsDevJs, componentsProductionJs, componentsCss;

    function makeJsTag(path) {
        return '<script defer src="' + path + '"></script>';
    }

    function makeCssTag(path) {
        return '<link rel="stylesheet" href="' + path + '">';
    }

    function filesForTests(paths) {
        return paths.map(function(path) {
            return {
                pattern: 'app/' + path,
                served: false
            };
        });
    }

    componentsDevJs = cmp.dev.map(makeJsTag).join('\n        ');
    componentsProductionJs = cmp.production.map(makeJsTag).join('\n        ');
    componentsCss = cmp.css.map(makeCssTag).join('\n        ');

    var allTestspaths = [
        'tests/suites/unit/*.js',
        'tests/suites/component-unit/*.js',
        'tests/suites/integration/*.js'
    ];

    var allRemoteTestPaths = [
    ];

    var karmaFiles = []
        .concat(filesForTests(cmp.dev))
        .concat(filesForTests(cmp.css))
        .concat([{
                pattern: 'app/bower_components/jquery-mockjax/dist/jquery.mockjax.js'
            }, {
                pattern: 'dist/scripts/*.js',
                served: false
            }, {
                pattern: 'dist/styles/**/*.css',
                served: false
            },

            {
                pattern: 'dist/media/**',
                included: false,
                served: false
            }, {
                pattern: 'dist/images/**',
                included: false,
                served: false
            }, {
                pattern: 'dist/fonts/**',
                included: false,
                served: false
            },

            {
                pattern: 'tests/setup.js',
                served: false
            }, {
                pattern: 'tests/helpers/emberHelper.js',
                served: false
            }, {
                pattern: 'tests/helpers/testHelper.js',
                served: false
            }, {
                pattern: 'tests/helpers/testBuddy.js',
                served: false
            }
        ]);

    var testFiles = [];
    var remoteTestFiles = [];

    var testModule = grunt.option('testModule');
    var testPath = grunt.option('test');
    if (testPath) {
        testFiles.push({
            pattern: testPath,
            served: false
        });
    } else {
        allTestspaths.forEach(function(path) {
            testFiles.push({
                pattern: path,
                served: false
            });
        });
        allRemoteTestPaths.forEach(function(path) {
            remoteTestFiles.push({
                pattern: path,
                served: false
            });
        });
    }

    var allTestFiles = karmaFiles.concat(testFiles);
    var allRemoteTestFiles = karmaFiles.concat(remoteTestFiles);
    var benchmarkTestFiles = karmaFiles.concat([{
        pattern: 'tests/suites/benchmark/*.js',
        served: false
    }]);

    function setKarmaProxy(port) {
        var proxies = {
            '/base/app/': 'http://localhost:' + port + '/app/',
            '/base/dist/': 'http://localhost:' + port + '/dist/',
            '/base/tests/': 'http://localhost:' + port + '/tests/',
            '/images/': 'http://localhost:' + port + '/dist/images/',
            '/fonts/': 'http://localhost:' + port + '/dist/fonts/',
            '/components/': 'http://localhost:' + port + '/dist/components/',
            '/data/': 'http://localhost:' + port + '/dist/data/'
        };

        grunt.config('karma.options.proxies', proxies);
    }

    grunt.event.once('connect.base.listening', function(host, actualPort) {
        setKarmaProxy(actualPort);
    });

    var allComponentsDevFiles = cmp.dev.concat(cmp.css.concat(cmp.media));
    var allComponentsProductionFiles = cmp.production.concat(cmp.css.concat(cmp.media));

    var lessMap = grunt.option('less-map');
    if (lessMap !== undefined) {
        lessMap = true;
    } else {
        lessMap = false;
    }

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        destDir: destDir,
        dist: 'dist',
        components: cmp,
        componentsCss: componentsCss,
        componentsDevJs: componentsDevJs,
        componentsProductionJs: componentsProductionJs,
        componentsDevFiles: cmp.dev,
        backend: grunt.option('backend') || 'localhost',
        lessMap: lessMap
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            options: {
                livereload:    true,
                interrupt:     true
            },
            grunt: {
                files: ['Gruntfile.js']
            },
            replace: {
                files: [
                    '<%= yeoman.app %>/index.html',
                ],
                tasks: ['replace:dev', 'copy:app']
            },
            emberTemplates: {
                files: '<%= yeoman.app %>/templates/**/*.hbs',
                tasks: ['emberTemplates', 'copy:app']
            },
            neuter: {
                files: ['<%= yeoman.app %>/scripts/**/*.js'],
                tasks: ['neuter', 'copy:app']
            },
            jshint: {
                files: [
                    'Gruntfile.js',
                    '<%= yeoman.app %>/scripts/**/*.js',
                ],
                tasks: ['newer:jshint:dev']
            },
            jshintTests: {
                files: [
                    'tests/*.js',
                    'tests/helpers/*.js',
                    'tests/suites/**/*.js'
                ],
                tasks: ['newer:jshint:tests']
            },
            copyMedia: {
                files: [
                    '<%= yeoman.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= yeoman.app %>/media/**/*.{png,jpg,jpeg,gif,webp,svg}'
                ],
                tasks: ['newer:copy:media']
            },
            copyFonts: {
                files: [
                    '<%= yeoman.app %>/fonts/*'
                ],
                tasks: ['newer:copy:fonts']
            },
            copyComponents: {
                files: [
                    '<%= yeoman.app %>/components/**/*.js'
                ],
                tasks: ['newer:copy:componentsDev']
            },
            copyData: {
                files: [
                    '<%= yeoman.app %>/data/**',
                ],
                tasks: ['newer:copy:data']
            },
            less: {
                files: [
                    '<%= yeoman.app %>/styles/**/*.less'
                ],
                tasks: ['less:dev', 'postcss', 'copy:app']

            }
        },
        clean: {
            options: {
                force: true //needed to clean outside working dir
            },
            deploy: ['<%= yeoman.destDir %>/**/*'],
            app: ['<%= yeoman.dist %>/**/*', '.tmp/**/*']
        },
        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            dev: {
                options: {
                    jshintrc: '.jshintrc-dev'
                },
                src: [
                    'Gruntfile.js',
                    '<%= yeoman.app %>/scripts/**/*.js'

                ]
            },
            production: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: [
                    'Gruntfile.js',
                    '<%= yeoman.app %>/scripts/**/*.js'
                ]
            },
            tests: {
                options: {
                    jshintrc: 'tests/.jshintrc'
                },
                src: [
                    'tests/*.js',
                    'tests/helpers/*.js',
                    'tests/suites/**/*.js'
                ]
            }
        },
        concat: {
            options: {
                sourceMap: true
            }
        },
        uglify: {
            options: {
                sourceMap: true,
                sourceMapIncludeSources: true,
                sourceMapIn: function(uglifySource) {
                    return uglifySource + '.map';
                }
            }
        },
        filerev: {
            app: {
                src: [
                    '<%= yeoman.dist %>/scripts/{,*/}*.js',
                    '<%= yeoman.dist %>/styles/{,*/}*.css',
                    '<%= yeoman.dist %>/bower_components/**/*.js',
                    '<%= yeoman.dist %>/bower_components/**/*.css',
                    '<%= yeoman.dist %>/components/**/*.js',
                    '<%= yeoman.dist %>/components/**/*.css',
                ]
            }
        },
        useminPrepare: {
            html: '.tmp/index.html',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },
        usemin: {
            html: ['<%= yeoman.dist %>/index.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                assetsDirs: ['<%= yeoman.dist %>']
            }
        },
        imagemin: {
            default: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        svgmin: {
            default: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        cssmin: {
            options: {
                // TODO: disable `zeroUnits` optimization once clean-css 3.2 is released
                //    and then simplify the fix for https://github.com/twbs/bootstrap/issues/14837 accordingly
                compatibility: 'ie8',
                keepSpecialComments: '*',
                sourceMap: true,
                advanced: false
            },
            default: {
                files: {
                    '<%= yeoman.dist %>/styles/main.css': [
                        '.tmp/styles/{,*/}*.css',
                        '<%= yeoman.app %>/styles/{,*/}*.css'
                    ]
                }
            }
        },
        htmlmin: {
            default: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: [
                        '*.html',
                        '!index.html',
                        '!uiComponents.html',
                    ],
                    dest: '<%= yeoman.dist %>'
                }, {
                    expand: true,
                    cwd: '.tmp/',
                    src: 'index.html',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        replace: {
            dev: {
                options: {
                    variables: {
                        componentsJs: '<%= yeoman.componentsDevJs %>',
                        componentsCss: '<%= yeoman.componentsCss %>',

                        devMode: 'true',

                        livereload: '//localhost:35729/livereload.js'
                    }
                },
                files: [{
                    src: '<%= yeoman.app %>/index.html',
                    dest: '.tmp/index.html'
                }]
            },

            staging: {
                options: {
                    variables: {
                        componentsJs: '<%= yeoman.componentsProductionJs %>',
                        componentsCss: '<%= yeoman.componentsCss %>',

                        devMode: 'true',

                        livereload: ''
                    }
                },
                files: [{
                    src: '<%= yeoman.app %>/index.html',
                    dest: '.tmp/index.html'
                }]
            },

            production: {
                options: {
                    variables: {
                        componentsJs: '<%= yeoman.componentsProductionJs %>',
                        componentsCss: '<%= yeoman.componentsCss %>',

                        devMode: 'false',

                        livereload: ''
                    }
                },
                files: [{
                    src: '<%= yeoman.app %>/index.html',
                    dest: '.tmp/index.html'
                }]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            app: {
                files: [{
                    expand: true,
                    cwd: '.tmp/',
                    dest: '<%= yeoman.dist %>',
                    src: '**'
                }]
            },
            vanillaApp: {
                files: [{
                    expand: true,
                    flatten: true,
                    cwd: '.tmp/scripts',
                    src: '**',
                    dest: '<%= yeoman.dist %>/scripts/sources'
                }]
            },
            concatApp: {
                files: [{
                    expand: true,
                    flatten: true,
                    cwd: '.tmp/concat/scripts',
                    src: 'main.min.js',
                    dest: '<%= yeoman.dist %>/scripts/sources'
                }]
            },
            deploy: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    dest: '<%= yeoman.destDir %>',
                    src: '**'
                }]
            },
            fonts: {
                files: [{
                    expand: true,
                    flatten: true,
                    filter: 'isFile',
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>/fonts/',
                    src: [
                        'fonts/**'
                    ]
                }]
            },
            media: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: ['media/**', 'images/**']
                }]
            },
            componentsDev: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: allComponentsDevFiles
                }]
            },
            componentsProduction: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: allComponentsProductionFiles
                }]
            },
            data: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: ['data/**', '!data/versions/latest.json']
                }]
            },
            default: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,txt}'
                    ]
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.html',
                        '!index.html',
                        '!uiComponents.html',
                    ]
                }]
            }
        },
        concurrent: {
            dev: [
                'emberTemplates',
                'less:dev',
                'jshint:dev',
                'jshint:tests',
                'copy:media',
                'copy:fonts',
                'copy:componentsDev',
                'copy:default',
                'copy:data'
            ],
            production: [
                'emberTemplates',
                'less:production',
                'jshint:production',
                'jshint:tests',
                'imagemin',
                'svgmin',
                'htmlmin',
                'copy:media',
                'copy:fonts',
                'copy:componentsProduction',
                'copy:default',
                'copy:data'
            ]
        },
        karma: {
            kui: {
                configFile: 'karma.conf.js',
                background: isBackgroundEnabled,
                singleRun: false,
                testModule: testModule,
                options: {
                    files: allTestFiles
                }
            },
            kci: {
                configFile: 'karma.conf.js',
                browsers: ['PhantomJSFixedViewport'],
                autoWatch: false,
                testModule: testModule,
                options: {
                    files: allTestFiles
                }
            },
            debug: {
                configFile: 'karma.conf.js',
                browsers: ['PhantomJSDebug'],
                autoWatch: false,
                testModule: testModule,
                options: {
                    files: allTestFiles
                }
            }
        },
        connect: {
            options: {
                middleware: function(connect, options) {
                    if (!Array.isArray(options.base)) {
                        options.base = [options.base];
                    }

                    // Setup the proxy
                    var middlewares = [require('grunt-connect-proxy/lib/utils').proxyRequest];

                    // Serve static files.
                    options.base.forEach(function(base) {
                        middlewares.push(connect.static(base));
                    });

                    // Make directory browse-able.
                    var directory = options.directory || options.base[options.base.length - 1];
                    middlewares.push(connect.directory(directory));

                    return middlewares;
                }
            },
            base: {
                options: {
                    port: 0,
                    base: '.'
                }
            }
        },
        emberTemplates: {
            options: {
                templateBasePath: '<%= yeoman.app %>/templates/'
            },
            default: {
                files: {
                    '.tmp/scripts/compiled-templates.js': '<%= yeoman.app %>/templates/**/*.hbs'
                }
            }
        },
        neuter: {
            app: {
                options: {
                    filepathTransform: function(filepath) {
                        return yeomanConfig.app + '/' + filepath;
                    }
                },
                src: '<%= yeoman.app %>/scripts/app.js',
                dest: '.tmp/scripts/combined-scripts.js'
            }
        },
        less: {
            production: {
                options: {
                    cleancss: true,
                    paths: ['<%= yeoman.app %>/bower_components/bootstrap/less']
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/styles',
                    src: 'main.less',
                    dest: '.tmp/styles',
                    ext: '.css'
                }]
            },

            dev: {
                options: {
                    paths: ['<%= yeoman.app %>/bower_components/bootstrap/less'],
                    sourceMap: '<%= yeoman.lessMap %>',
                    sourceMapFilename: '.tmp/styles/main.css.map',
                    sourceMapURL: 'main.css.map',
                    outputSourceFiles: '<%= yeoman.lessMap %>'
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/styles',
                    src: 'main.less',
                    dest: '.tmp/styles',
                    ext: '.css'
                }]
            }
        },
        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer')({ browsers: 'last 4 versions' })
                ]
            },
            default: {
                src: '.tmp/styles/main.css'
            }
        }
    });

    grunt.registerTask('build:dev', [
        'replace:dev',
        'concurrent:dev',
        'postcss',
        'neuter:app',
        'copy:app'
    ]);

    grunt.registerTask('build:staging', [
        'replace:staging',
        'useminPrepare',
        'concurrent:production',
        'postcss',
        'neuter:app',
        'concat:generated',
        'cssmin:generated',
        'copy:vanillaApp',
        'uglify:generated',
        'filerev',
        'usemin',
        'copy:componentsDev',
        'copy:concatApp'
    ]);

    grunt.registerTask('build:production', [
        'replace:production',
        'useminPrepare',
        'concurrent:production',
        'postcss',
        'neuter:app',
        'concat:generated',
        'cssmin:generated',
        'copy:vanillaApp',
        'uglify:generated',
        'filerev',
        'usemin',
        'copy:componentsDev',
        'copy:concatApp'
    ]);

    grunt.registerTask('dev', [
        'build:dev',
        'watch'
    ]);

    grunt.registerTask('deploy', [
        'clean:deploy',
        'copy:deploy'
    ]);

    grunt.registerTask('karma:ci', [
        'connect:base',
        'karma:kci'
    ]);

    grunt.registerTask('test', [
        'build:dev',
        'karma:ci'
    ]);

    grunt.registerTask('debug-test', [
        'build:dev',
        'connect:base',
        'karma:debug'
    ]);

    grunt.registerTask('test-karma', [
        'build:dev',
        'connect:base',
        'karma:kui',
        'watch'
    ]);
};

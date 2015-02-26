// Generated on 2014-03-04 using generator-webapp 0.4.7
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        yeoman: {
            // Configurable paths
            app: 'app',
            statics: 'public/assets',
            dist: 'public/dist'
        },

        clean: {
            dist: '<%= yeoman.dist %>',
            views: '<%= yeoman.app %>/online_views'
        },


        // 压缩css任务
        cssmin: {
            css: {
                files: {
                    '<%= yeoman.dist %>/styles/index.min.css' : [
                        '<%= yeoman.statics %>/styles/bootstrap.min.css',
                        '<%= yeoman.statics %>/styles/font-awesome.min.css',
                        '<%= yeoman.statics %>/styles/animate.css',
                        '<%= yeoman.statics %>/styles/simple-line-icons.css',
                        '<%= yeoman.statics %>/styles/font.css',
                        '<%= yeoman.statics %>/styles/app.css',
                        '<%= yeoman.statics %>/styles/chosen.css',
                        '<%= yeoman.statics %>/styles/bootstrap-datetimepicker.min.css',
                        '<%= yeoman.statics %>/styles/login.css',
                        '<%= yeoman.statics %>/styles/style.css'
                    ]
                }
            }
        },


        // The following *-min tasks produce minified files in the dist folder
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.statics %>/images/',
                    src: '{,*/}*.{gif,jpeg,jpg,png}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },

        ejsmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/online_views/',
                    src: '{,*/}*.html',
                    dest: '<%= yeoman.app %>/online_views/'
                }]
            }
        },

        requirejs: {
            compile: {
                options: {
                    "baseUrl": "<%= yeoman.statics %>/scripts",
                    "paths": {
                        "jquery": "jquery/jquery",
                        "validform" : "component/Validform_v5.3.2",
                        "pageinator" : "component/bootstrap-paginator"

                    },
                    "shim": {
                        "validform" : ["jquery"]
                    },
                    "removeCombined": true,
                    "preserveLicenseComments": false,
                    "cssImportIgnore": null,
                    "optimizeCss": "standard",
                    "name": "index",
                    "out": "<%= yeoman.dist %>/scripts/index.min.js"
                }
            }
        },

        concat: {
            requirejs: {
                src: ['<%= yeoman.statics %>/require.min.js', '<%= yeoman.dist %>/scripts/index.min.js'],
                dest: '<%= yeoman.dist %>/scripts/index.min.js'
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.statics %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        'fonts/{,*/}*.*',
                        'vendor/*.js'
                    ]
                }]
            },
            html: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/views',
                    dest: '<%= yeoman.app %>/online_views',
                    src: [
                        '{,*/}*.html'
                    ]
                }]
            }
        },

        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,*/}*.js',
                        '<%= yeoman.dist %>/styles/{,*/}*.css',
                        '<%= yeoman.dist %>/images/{,*/}*.{gif,jpeg,jpg,png,webp}'
                    ]
                }
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            options: {
                dest: '<%= yeoman.dist %>'
            },
            html: '<%= yeoman.app %>/online_views/{,*/}*.html'
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            options: {
                assetsDirs: [
                    '<%= yeoman.dist %>',
                    '<%= yeoman.dist %>/images',
                    '<%= yeoman.dist %>/styles'
                ]
            },
            html: ['<%= yeoman.app %>/online_views/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css']
        }

    });

    grunt.registerTask('default', [
        'clean',
        'useminPrepare',
        'copy',
        'concat',
        'cssmin',
        'requirejs',
        'concat',
        'imagemin',
        'rev',
        'usemin',
        'ejsmin'
    ]);
};

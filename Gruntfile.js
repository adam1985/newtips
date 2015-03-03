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

        pkg: grunt.file.readJSON('package.json'),

        // Project settings
        yeoman: {
            // Configurable paths
            app: './app',
            dist: 'dist',
            tmp: '.tmp'
        },

        clean: {
            dist: '<%= yeoman.dist %>',
            tmp: '<%= yeoman.tmp %>'
        },

        tmod: {
            template: {
                src: '<%= yeoman.app %>/tpl/*.html',
                dest: '../scripts/tpl'
            }
        },

        watch: {
            template: {
                files: '<%= tmod.template.src %>',
                tasks: ['tmod'],
                options: {
                    spawn: false
                }
            }
        },

        // 压缩css任务
        cssmin: {
            css: {
                files: {
                    '<%= yeoman.dist %>/styles/layout.css' : [
                        '<%= yeoman.app %>/styles/reset.css',
                        '<%= yeoman.app %>/styles/layout.css'
                    ]
                }
            }
        },


        // The following *-min tasks produce minified files in the dist folder
        imagemin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/images/',
                        src: '{,*/}*.{gif,jpeg,jpg,png}',
                        dest: '<%= yeoman.dist %>/images/'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/img/',
                        src: '{,*/}*.{gif,jpeg,jpg,png}',
                        dest: '<%= yeoman.dist %>/img/'
                    }
                ]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeCommentsFromCDATA: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: '{,*/}*.html',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },

        requirejs: {
            compile: {
                options: {
                    "baseUrl": "<%= yeoman.app %>/scripts",
                    "paths": {
                        "jquery": "jquery/jquery"
                    },
                    "removeCombined": true,
                    "preserveLicenseComments": false,
                    "cssImportIgnore": null,
                    "optimizeCss": "standard",
                    "name": "index",
                    "out": "<%= yeoman.dist %>/scripts/index.js"
                }
            }
        },

        concat: {
            requirejs: {
                src: ['<%= yeoman.app %>/scripts/require.min.js', '<%= yeoman.dist %>/scripts/index.js'],
                dest: '<%= yeoman.dist %>/scripts/index.js'
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        'vendor/DD_belatedPNG_0.0.8a-min.js'
                    ]
                }]
            },
            html: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '{,*/}*.html'
                    ]
                }]
            },
            tmp: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    dest: '<%= yeoman.tmp %>/assets',
                    src: [
                        'images/*.*',
                        'img/*.*',
                        'styles/*.*',
                        'scripts/*.*'
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
            html: '<%= yeoman.app %>/{,*/}*.html'
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
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css']
        }

    });

    grunt.registerTask('default', [
        'clean',
        'useminPrepare',
        'cssmin',
        'requirejs',
        'concat',
        'imagemin',
        'copy',
        'rev',
        'usemin',
        'htmlmin',
        'clean:tmp'
    ]);
};

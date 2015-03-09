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
            distmp: '.distmp',
            tmp: '.tmp'
        },

        clean: {
            dist: '<%= yeoman.dist %>',
            tmp: '<%= yeoman.tmp %>',
            distmp: '<%= yeoman.distmp %>'
        },

        tmod: {
            template: {
                src: "<%= yeoman.app %>/tpl/*.html",
                dest: '<%= yeoman.app %>/scripts/tpl/template.js',
                options: {
                    "output": '../',
                    "base": '<%= yeoman.app %>',
                    "charset": "utf-8",
                    "syntax": "simple",
                    "helpers": null,
                    "escape": true,
                    "compress": true,
                    "type": "amd",
                    "runtime": "template.js",
                    "combo": true,
                    "minify": true,
                    "cache": false
                }
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
            options: {
                compatibility : 'ie7', //设置兼容模式
                noAdvanced : true //取消高级特性
            },
            css: {
                files: {
                    '<%= yeoman.tmp %>/styles/layout.css' : [
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
                        dest: '<%= yeoman.tmp %>/images/'
                    }
                ]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: ['{,*/}*.html', '!adtips.html'],
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
                    "out": "<%= yeoman.tmp %>/scripts/index.js"
                }
            }
        },

        concat: {
            requirejs: {
                src: ['<%= yeoman.app %>/scripts/require.min.js', '<%= yeoman.tmp %>/scripts/index.js'],
                dest: '<%= yeoman.tmp %>/scripts/index.js'
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
                        '*.html'
                    ]
                }]
            },
            tmp: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.tmp %>',
                    dest: '<%= yeoman.distmp %>',
                    src: [
                        'images/{,*/}*.{gif,jpeg,jpg,png,webp}',
                        'styles/*.css',
                        'scripts/*.js'
                    ]
                }]
            },
            distmp:{
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.distmp %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        'images/{,*/}*.{gif,jpeg,jpg,png,webp}',
                        'styles/*.css',
                        'scripts/*.js'
                    ]
                }]
            }
        },

        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.distmp %>/scripts/{,*/}*.js',
                        '<%= yeoman.distmp %>/styles/{,*/}*.css',
                        '<%= yeoman.distmp %>/images/{,*/}*.{gif,jpeg,jpg,png,webp}'
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
                    '<%= yeoman.dist %>/styles',
                    '<%= yeoman.dist %>/scripts'
                ],
                patterns: {
                    js: [[/(images\/[\w-]+\.png)/g, 'replace image in js']]
                }

            },
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            js: ['<%= yeoman.dist %>/scripts/{,*/}*.js']
        }

    });

    grunt.registerTask('default', [
        'clean:tmp',
        'clean:distmp',
        'useminPrepare',
        'cssmin',
        'requirejs',
        'concat',
        'imagemin',
        'copy:dist',
        'copy:html',
        'copy:tmp',
        'rev',
        'copy:distmp',
        'usemin',
        'htmlmin',
        'clean:tmp',
        'clean:distmp'
    ]);
};

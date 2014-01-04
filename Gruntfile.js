"use strict";
var path = require("path");
var cssPrepareStep = require("./grunt_utils/modules/cssPrepareStep");

module.exports = function(grunt) {
    /**
     * Feel free to configure app, copy:assets, copy:dev, copy:prd, copy:qa
     * targets. Only edit the others if you know what you are doing.
     */
    grunt.initConfig({
        "app": {
            src: "src",
            dist: "dist",
            bower: "bower_components",
            staging: ".tmp"
        },
        "copy": {
            assets: {
                files: [{
                        expand: true,
                        cwd: "<%= app.src %>",
                        filter: "isFile",
                        src: ["assets/**", "images/**", "fonts/**"],
                        dest: "<%= app.dist %>"
                    }, {
                        expand: true,
                        cwd: "<%= app.bower %>/bootstrap/dist",
                        filter: "isFile",
                        src: ["fonts/**"],
                        dest: "<%= app.dist %>"
                    }
                ]
            },
            dev: {
                files: [{
                        expand: true,
                        cwd: "<%= app.src %>/build/config-dev",
                        filter: "isFile",
                        src: ["**"],
                        dest: "<%= app.src %>/config"
                    }
                ]
            },
            prd: {
                files: [{
                        expand: true,
                        cwd: "<%= app.src %>/build/config-prd",
                        filter: "isFile",
                        src: ["**"],
                        dest: "<%= app.src %>/config"
                    }
                ]
            },
            qa: {
                files: [{
                        expand: true,
                        cwd: "<%= app.src %>/build/config-qa",
                        filter: "isFile",
                        src: ["**"],
                        dest: "<%= app.src %>/config"
                    }
                ]
            },
            html: {
                files: [{
                        expand: true,
                        cwd: "<%= app.src %>",
                        src: ["**/*.html"],
                        dest: "<%= app.dist %>"
                    }
                ]
            }
        },
        "useminPrepare": {
            html: "<%= app.src %>/**/*.html",
            options: {
                dest: "<%= app.dist %>",
                staging: "<%= app.staging %>",
                flow: {
                    steps: {
                        "js": ["uglifyjs"],
                        "css": [cssPrepareStep, "cssmin"]
                    },
                    post: {}
                }
            }
        },
        "usemin": {
            html: ["<%= app.dist %>/**/*.html"],
            options: {
                assetsDirs: ["<%= app.dist %>"]
            }
        },
        "uglify": {
            options: {
                preserveComments: "some"
            }
        },
        "cssmin": {
            options: {
                keepSpecialComments: "*"
            }
        },
        "htmlrefs": {
            cmp: {
                src: ["<%= app.dist %>/**/*.html"],
            }
        },
        "clean": {
            cmpPostBuild: ["<%= app.staging %>"],
            clean: ["<%= app.dist %>", "<%= app.src %>/config"]
        }
    });

    grunt.loadTasks("grunt_utils/tasks");

    grunt.loadNpmTasks("grunt-usemin");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-sass");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-htmlrefs");
    grunt.loadNpmTasks("grunt-contrib-clean");

    grunt.registerTask("dev", [
        "copy:dev"]);

    grunt.registerTask("cmp", [
        "copy:html",
        "copy:assets",
        "useminPrepare",
        "cssPrepare:generated",
        "copy:generated",
        "less:generated",
        "sass:generated",
        "uglify",
        "cssmin",
        "usemin",
        "htmlrefs:cmp",
        "clean:cmpPostBuild"]);

    grunt.registerTask("prd", [
        "copy:prd",
        "cmp"]);

    grunt.registerTask("qa", [
        "copy:qa",
        "cmp"]);

    grunt.registerTask("default", ["dev"]);
}

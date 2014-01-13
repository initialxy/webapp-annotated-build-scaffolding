"use strict";
var cssPrepareStep = require("./grunt_utils/modules/cssPrepareStep");
var sourceMapNameGen = require("./grunt_utils/modules/sourceMapNameGen");
var sourceMapURLGen = require("./grunt_utils/modules/sourceMapURLGen");

module.exports = function(grunt) {
    /**
     * Feel free to configure app, copy:assets, copy:dev, copy:qa, copy:prd
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
        "useminPreparePrepare": {
            html: "<%= app.src %>/**/*.html",
            options: {
                src: "<%= app.src %>",
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
        "uglifyFilesToTarget": {
            genSourceMap: {}
        },
        "uglify": {
            options: {
                preserveComments: "some"
            },
            genSourceMap: {
                options: {
                    // Due to the way uglify works, source path is pretty messed
                    // up. Please keep that in mind.
                    sourceMap: sourceMapNameGen,
                    sourceMappingURL: sourceMapURLGen
                }
            }
        },
        "cssmin": {
            options: {
                keepSpecialComments: "*"
            }
        },
        "sourceCopyPrepare": {
            jsSourceMap: {
                options: {
                    srcTask: "uglify",
                    srcTaskTarget: "genSourceMap"
                }
            }
        },
        "htmlrefs": {
            build: {
                src: ["<%= app.dist %>/**/*.html"]
            }
        },
        "clean": {
            postBuild: ["<%= app.staging %>"],
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

    grunt.registerTask("prebuild", [
        "copy:html",
        "copy:assets",
        "htmlrefs:build",
        "useminPreparePrepare",
        "useminPrepare"]);

    grunt.registerTask("cssGen", [
        "cssPrepare:generated",
        "copy:generated",
        "less:generated",
        "sass:generated"]);

    grunt.registerTask("min", [
        "uglify:generated",
        "cssmin:generated"]);

    // Too bad there's no source map gen for CSS with grunt-contrib-cssmin.
    grunt.registerTask("minGenSourceMap", [
        "uglifyFilesToTarget:genSourceMap",
        "uglify:genSourceMap",
        "cssmin:generated",
        "sourceCopyPrepare:jsSourceMap",
        "copy:jsSourceMap"]);

    grunt.registerTask("finalize", [
        "usemin",
        "clean:postBuild"]);

    grunt.registerTask("build", [
        "prebuild",
        "cssGen",
        "min",
        "finalize"
    ]);

    grunt.registerTask("buildGenSourceMap", [
        "prebuild",
        "cssGen",
        "minGenSourceMap",
        "finalize"
    ]);

    /****************** Actual tasks you should use to build ******************/

    grunt.registerTask("dev", [
        "copy:dev"]);

    grunt.registerTask("prd", [
        "copy:prd",
        "build"]);

    grunt.registerTask("qa", [
        "copy:qa",
        "buildGenSourceMap"]);

    grunt.registerTask("default", ["dev"]);
}

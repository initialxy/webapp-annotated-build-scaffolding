"use strict";
var path = require("path");

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
                staging: "<%= app.staging %>"
            }
        },
        "usemin": {
            html: ["<%= app.dist %>/**/*.html"],
            options: {
                assetsDirs: ["<%= app.dist %>"]
            }
        },
        "postUseminPrepare": {
            paths: ["<%= app.src %>/css"]
        },
        "postConcat": {
            uglifyExclude: {
                files: ["<%= app.dist %>/js/libs.js"]
            },
            cssminExclude: {
                files: ["<%= app.dist %>/css/libs.css"]
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

    grunt.loadNpmTasks("grunt-usemin");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-sass");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-htmlrefs");
    grunt.loadNpmTasks("grunt-contrib-clean");

    /**
     * Relocate src files of given ext from concatFiles to stagging folder.
     * Overwrite its original path in concatFiles with the new path. Return
     * list of files with src and dest with src being the original path and dest
     * being the new path. Will mutate concatFiles.
     */
    function relocateConcat(
            /* [dest: "", src: []] */   concatFiles,
            /* // */                    extRegex) {
        var result = [];
        var appConfig = grunt.config("app");

        for (var i = 0; i < concatFiles.length; i++) {
            for (var j = 0; j < concatFiles[i].src.length; j++) {
                if (extRegex.test(concatFiles[i].src[j])) {
                    var newPath = path.normalize(concatFiles[i].src[j])
                            .split(path.sep);
                    if (newPath.length > 0) {
                        newPath[0] = appConfig.staging;
                    }

                    newPath = path.join.apply(null, newPath);

                    var file = {
                        src: [concatFiles[i].src[j]],
                        dest: newPath
                    };

                    result.push(file);

                    concatFiles[i].src[j] = newPath;
                }
            }
        }

        return result;
    }

    /**
     * Compile LESS before concat.
     */
    grunt.registerTask("postUseminPrepare",
            "Task to be run before less and concat.",
            function() {
        grunt.task.requires("useminPrepare");

        var config = grunt.config("postUseminPrepare");
        var concatConfig = grunt.config("concat");
        var files = concatConfig
                && concatConfig.generated
                && concatConfig.generated.files
                || [];

        var lessExtRegex = /.*\.less/;
        var sassExtRegex = /.*\.sass/;

        var lessConfig = {
            cmp: {
                files: relocateConcat(files, lessExtRegex)
            }
        };

        var sassConfig = {
            cmp: {
                files: relocateConcat(files, sassExtRegex)
            }
        };

        if (config.paths) {
            lessConfig.cmp.options = {
                paths: config.paths
            };

            sassConfig.cmp.options = {
                loadPath: config.paths
            };
        }

        grunt.config("less", lessConfig);
        grunt.config("sass", sassConfig);
        grunt.config("concat", concatConfig);

        grunt.log.writeln("less config is now: ");
        grunt.log.writeln(JSON.stringify(lessConfig, null, 4));

        grunt.log.writeln("sass config is now: ");
        grunt.log.writeln(JSON.stringify(sassConfig, null, 4));

        grunt.log.writeln("concat config is now: ");
        grunt.log.writeln(JSON.stringify(concatConfig, null, 4));
    });

    /**
     * Remove files listed in exclude from from based on from[].dest. Copy the
     * removed files from src to dest instead. Will mutate exclude.
     */
    function excludeFilesForCopy(
            /* [{src: [], dest: ""}] */ from,
            /* [""]*/                   exclude) {
        for (var i = 0; i < from.length; i++) {
            for (var j = 0; j < exclude.length; j++) {
                if (grunt.file.arePathsEquivalent(exclude[j], from[i].dest)) {
                    // Instead of uglify, simply copy file.
                    grunt.file.copy(from[i].src, from[i].dest);

                    // Remove this file from uglify.
                    from.splice(i, 1);
                    i--;
                }
            }
        }
    }

    /**
     * The purpose of this task is to exclude files from uglify and cssmin.
     * Excluded files will be copied instead. This could be useful when you are
     * dealing with concatenated library files, which is already minified and
     * copyright statements need to be preserved.
     */
    grunt.registerTask("postConcat",
            "Task to be run following concat.",
            function() {
        grunt.task.requires("useminPrepare");
        grunt.task.requires("concat");

        var uglifyConfig = grunt.config("uglify");
        var cssminConfig = grunt.config("cssmin");
        var config = grunt.config("postConcat");
        var uglifyFiles = uglifyConfig
                && uglifyConfig.generated
                && uglifyConfig.generated.files
                || [];
        var cssminFiles = cssminConfig
                && cssminConfig.generated
                && cssminConfig.generated.files
                || [];
        var uglifyExcludeFiles = config
                && config.uglifyExclude
                && config.uglifyExclude.files
                || [];
        var cssminExcludeFiles = config
                && config.cssminExclude
                && config.cssminExclude.files
                || [];

        excludeFilesForCopy(uglifyFiles, uglifyExcludeFiles);

        if (uglifyConfig) {
            grunt.config("uglify", uglifyConfig);

            grunt.log.writeln("uglify config is now: ");
            grunt.log.writeln(JSON.stringify(uglifyConfig, null, 4));
        }

        if (cssminConfig) {
            grunt.config("cssmin", cssminConfig);

            grunt.log.writeln("cssmin config is now: ");
            grunt.log.writeln(JSON.stringify(cssminConfig, null, 4));
        }
    });

    grunt.registerTask("dev", [
        "copy:dev"]);

    grunt.registerTask("cmp", [
        "copy:html",
        "copy:assets",
        "useminPrepare",
        "postUseminPrepare",
        "less:cmp",
        "sass:cmp",
        "concat",
        "postConcat",
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

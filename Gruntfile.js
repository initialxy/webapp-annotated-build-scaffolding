var path = require("path");

module.exports = function(grunt) {
    grunt.initConfig({
        "app": {
            src: "src",
            dist: "dist",
            bower: "bower_components",
            staging: ".tmp"
        },
        "copy": {
            cmp: {
                files: [{
                        expand: true,
                        cwd: "<%= app.src %>",
                        src: ["**/*.html"],
                        dest: "<%= app.dist %>"
                    }, {
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
        "preLessConcat": {
            paths: ["<%= app.src %>/css"]
        },
        "preUglify": {
            exclude: {
                files: ["<%= app.dist %>/js/libs.js"]
            }
        },
        "preCssmin": {
            exclude: {
                files: ["<%= app.dist %>/css/libs.css"]
            }
        },
        "htmlrefs": {
            dist: {
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
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-htmlrefs");
    grunt.loadNpmTasks("grunt-contrib-clean");

    /**
     * Compile LESS before concat.
     */
    grunt.registerTask("preLessConcat",
            "Task to be run before less and concat.",
            function() {
        grunt.task.requires("useminPrepare");

        var config = grunt.config("preLessConcat");
        var appConfig = grunt.config("app");
        var concatConfig = grunt.config("concat");
        var files = concatConfig
                && concatConfig.generated
                && concatConfig.generated.files
                || [];

        var lessExtRegex = /.*\.less/;

        var lessConfig = {
            cmp: {
                files: []
            }
        };

        if (config.paths) {
            lessConfig.cmp.options = {
                paths: config.paths
            };
        }

        for (var i = 0; i < files.length; i++) {
            for (var j = 0; j < files[i].src.length; j++) {
                if (lessExtRegex.test(files[i].src[j])) {
                    var compiledFile = path.normalize(files[i].src[j])
                            .split(path.sep);
                    if (compiledFile.length > 0) {
                        compiledFile[0] = appConfig.staging;
                    }

                    compiledFile = path.join.apply(null, compiledFile);

                    var file = {
                        src: [files[i].src[j]],
                        dest: compiledFile
                    };
                    lessConfig.cmp.files.push(file);

                    files[i].src[j] = compiledFile;
                }
            }
        }

        grunt.config("less", lessConfig);
        grunt.config("concat", concatConfig);

        grunt.log.writeln("less config is now: ");
        grunt.log.writeln(JSON.stringify(lessConfig, null, 4));

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
     * Convenience wrapper to perform excludeFilesForCopy on configs.
     */
    function modifyConfigForExclude(
            /* "" */    from,
            /* "" */    exclude) {
        var fromConfig = grunt.config(from);
        var excludeConfig = grunt.config(exclude);
        var fromFiles = fromConfig
                && fromConfig.generated
                && fromConfig.generated.files
                || [];
        var excludeFiles = excludeConfig
                && excludeConfig.exclude
                && excludeConfig.exclude.files
                || [];

        excludeFilesForCopy(fromFiles, excludeFiles);

        if (fromConfig) {
            grunt.config(from, fromConfig);

            grunt.log.writeln(from + " config is now: ");
            grunt.log.writeln(JSON.stringify(fromConfig, null, 4));
        }
    }

    /**
     * The purpose of this task is to exclude files from uglify. Excluded files
     * will be copied instead. This could be useful when you are dealing with
     * concatenated library files, which is already minified and copyright
     * statements need to be preserved.
     */
    grunt.registerTask("preUglify",
            "Task to be run before uglify.",
            function() {
        grunt.task.requires("useminPrepare");

        modifyConfigForExclude("uglify", "preUglify");
    });

    /**
     * The purpose of this task is to exclude files from cssmin. Excluded files
     * will be copied instead. This could be useful when you are dealing with
     * concatenated library files, which is already minified and copyright
     * statements need to be preserved.
     */
    grunt.registerTask("preCssmin",
            "Task to be run before cssmin.",
            function() {
        grunt.task.requires("useminPrepare");

        modifyConfigForExclude("cssmin", "preCssmin");
    });

    grunt.registerTask("dev", [
        "copy:dev"]);

    grunt.registerTask("cmp", [
        "copy:cmp",
        "useminPrepare",
        "preLessConcat",
        "less:cmp",
        "concat",
        "preUglify",
        "uglify",
        "preCssmin",
        "cssmin",
        "usemin",
        "htmlrefs",
        "clean:cmpPostBuild"]);

    grunt.registerTask("prd", [
        "copy:prd",
        "cmp"]);

    grunt.registerTask("qa", [
        "copy:qa",
        "cmp"]);

    grunt.registerTask("default", ["dev"]);
}

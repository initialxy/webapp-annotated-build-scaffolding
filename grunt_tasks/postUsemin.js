"use strict";
var path = require("path");

module.exports = function(grunt) {
    /**
     * Relocate src files of given ext from concatFiles to staging folder.
     * Overwrite its original path in concatFiles with the new path. Return
     * list of files with src and dest with src being the original path and dest
     * being the new path. Will mutate concatFiles.
     */
    function relocateConcat(
            /* [dest: "", src: []] */   concatFiles,
            /* // */                    extRegex,
            /* "" */                    staging) {
        var result = [];

        for (var i = 0; i < concatFiles.length; i++) {
            for (var j = 0; j < concatFiles[i].src.length; j++) {
                if (extRegex.test(concatFiles[i].src[j])) {
                    var newPath = path.normalize(concatFiles[i].src[j])
                            .split(path.sep);
                    if (newPath.length > 0) {
                        newPath[0] = staging;
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
                files: relocateConcat(files, lessExtRegex, config.staging)
            }
        };

        var sassConfig = {
            cmp: {
                files: relocateConcat(files, sassExtRegex, config.staging)
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
}

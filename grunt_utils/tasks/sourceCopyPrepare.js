"use strict";
var path = require("path");

/**
 * Prepare copy task to copy source files for source map to link.
 */
module.exports = function(grunt) {
    grunt.registerMultiTask("sourceCopyPrepare",
            "Prepare copy task to copy source files for source map to link",
            function() {
        var config = this.data;
        var options = this.options();
        var srcConfig = grunt.config(options.srcTask);
        var copyConfig = grunt.config("copy") || {};
        var files = null;

        if (srcConfig) {
            if (options.srcTaskTarget) {
                files = srcConfig[options.srcTaskTarget]
                        && srcConfig[options.srcTaskTarget].files
            } else {
                files = srcConfig.files;
            }
        }

        if (files && files.length > 0) {
            var copyFiles = [];

            if (this.target) {
                if (!copyConfig[this.target]) {
                    copyConfig[this.target] = {};
                }

                copyConfig[this.target].files = copyFiles;
            } else {
                copyConfig.files = copyFiles;
            }

            files.forEach(function(f) {
                if (f.dest && f.src && f.src.length > 0) {
                    var destDir = path.dirname(f.dest);

                    f.src.forEach(function(s) {
                        copyFiles.push({
                            dest: path.join(destDir, s),
                            src: [s]
                        });
                    });
                }
            });

            grunt.config("copy", copyConfig);

            grunt.log.writeln("copy config is now:");
            grunt.log.writeln(JSON.stringify(copyConfig, null, 4));
        }
    });
}

"use strict";
var fs = require("fs");

/**
 * Replace special types before usemin.
 */
module.exports = function(grunt) {
    grunt.registerMultiTask("replaceUseminType",
            "Replace special types before usemin.",
            function() {
        grunt.task.requires("useminPrepare");

        var config = this.data;
        var options = this.options();

        if (options && options.types && options.types.length > 0) {
            // Process from type into a regexp.
            options.types.forEach(function(t) {
                t.from = new RegExp("\\<\\!\\-\\-\\s*build\\:(" + t.from + ")\\s+", "g");
            });

            // Get all files to be processed.
            var u = {};
            var useminConfig = grunt.config("usemin");
            Object.keys(useminConfig).forEach(function(k) {
                if (useminConfig.hasOwnProperty(k) && k != "options") {
                    var expanded = null;

                    if (useminConfig[k]) {
                        if (typeof useminConfig[k] === "string"
                                || useminConfig[k] instanceof Array) {
                            expanded = grunt.file.expand(useminConfig[k]);
                        } else if (useminConfig[k].src) {
                            expanded = grunt.file.expand(useminConfig[k].src);
                        }
                    }

                    if (expanded) {
                        expanded.forEach(function(f) {
                            u[f] = 1;
                        });
                    }
                }
            });

            // Now replace contents of each of the input files.
            Object.keys(u).forEach(function(f) {
                if (u.hasOwnProperty(f)) {
                    var content = fs.readFileSync(f, "utf8");
                    var isReplaced = false;

                    options.types.forEach(function(t) {
                        content = content.replace(t.from, function(m) {
                            isReplaced = true;
                            return "<!-- build:" + t.to + " ";
                        });
                    });

                    if (isReplaced) {
                        fs.writeFileSync(f, content, "utf8");
                    }
                }
            });
        }
    });
}


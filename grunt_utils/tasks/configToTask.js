"use strict";

/**
 * Copies configs from one task to another.
 */
module.exports = function(grunt) {
    grunt.registerMultiTask("configToTask",
            "Copy config from one task to another",
            function() {
        var options = this.options();

        if (options && options.from && options.to) {
            var fromConfig = grunt.config(options.from);
            grunt.config(options.to, fromConfig);

            grunt.log.writeln(options.to + " config is now:");
            grunt.log.writeln(JSON.stringify(fromConfig, null, 4));
        }
    });
}

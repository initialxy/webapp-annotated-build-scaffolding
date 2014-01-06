"use strict";

/**
 * Copies files config from uglify:generated target to another target. This is
 * needed because usemin always generates files to generated target, but you may
 * need to use these files for other target configurations.
 */
module.exports = function(grunt) {
    grunt.registerMultiTask("uglifyFilesToTarget",
            "Copy files config from uglify:generated target to another target.",
            function() {
        grunt.task.requires("useminPrepare");

        if (this.target && this.target != "generated") {
            var uglifyConfig = grunt.config("uglify");

            if (uglifyConfig && uglifyConfig.generated
                    && uglifyConfig.generated.files) {
                if (!uglifyConfig[this.target]) {
                    uglifyConfig[this.target] = {};
                }

                if (!uglifyConfig[this.target].files) {
                    uglifyConfig[this.target].files = [];
                }

                uglifyConfig[this.target].files
                        = uglifyConfig[this.target].files
                        .concat(uglifyConfig.generated.files);

                grunt.config("uglify", uglifyConfig);

                grunt.log.writeln("uglify config is now:");
                grunt.log.writeln(JSON.stringify(uglifyConfig, null, 4));
            }
        }
    });
}

"use strict";

/**
 * This task is almost unnecessary. It is a simple wrapper around browserify,
 * which by itself is mostly functional coming out of useminPrepare. The only
 * thing we need to do here is to add a custom build type replacement to 
 * replaceUseminType when we actually have files to be processed by browserify.
 */
module.exports = function(grunt) {
    grunt.registerMultiTask("browserifyPrepare",
            "Creates browserify task configs.",
            function() {
        grunt.task.requires("useminPrepare");

        var config = this.data || {};
        var options = this.options() || {};
        var browserifyConfigs = null;

        var files = config.files;

        if (files && files.length > 0) {
            browserifyConfigs = {};
            browserifyConfigs[this.target] = {};
            browserifyConfigs[this.target].files = files;
            browserifyConfigs[this.target].options = options;
        }

        if (browserifyConfigs) {
            grunt.loadNpmTasks('grunt-browserify');

            grunt.config("browserify", browserifyConfigs);
            grunt.log.writeln("browserify configs is now:");
            grunt.log.writeln(JSON.stringify(browserifyConfigs, null, 4));

            // Set amd type to be replaced.
            var replaceUseminTypeConfig = grunt.config("replaceUseminType") || {};
            if (!replaceUseminTypeConfig.generated) {
                replaceUseminTypeConfig.generated = {};
            }

            if (!replaceUseminTypeConfig.generated.options) {
                replaceUseminTypeConfig.generated.options = {};
            }

            if (!replaceUseminTypeConfig.generated.options.types) {
                replaceUseminTypeConfig.generated.options.types = [];
            }

            replaceUseminTypeConfig.generated.options.types.push({
                from: "commonjs",
                to: "js"
            });

            grunt.config("replaceUseminType", replaceUseminTypeConfig);
            grunt.log.writeln("replaceUseminType configs is now:");
            grunt.log.writeln(JSON.stringify(replaceUseminTypeConfig, null, 4));

            grunt.task.run("browserify:" + this.target);
        }
    });
}


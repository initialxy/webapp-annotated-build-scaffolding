"use strict";
var supportedCssPreprocessors = require("../modules/supportedCssPreprocessors");

var defaultTask = "copy";

function findTaskForFile( /* {dest: "", src: [""]} */ f) {
    for (var i = 0; i < f.src.length; i++) {
        for (var j = 0; j < supportedCssPreprocessors.length; j++) {
            var support = supportedCssPreprocessors[j];
            // Perform an endsWith search. Too bad node doesn't have
            // string.prototype.endsWith.
            var extIndex = f.src[i].lastIndexOf("." + support.ext);
            if (extIndex > -1
                    && extIndex + 1 + support.ext.length == f.src[i].length) {
                return support.task;
            }
        }
    }

    return defaultTask;
}

/**
 * Generate CSS files by compiling given LESS and SASS files. Copy raw CSS
 * files. This task should be followed by less:generated, sass:generated and
 * copy:generated tasks in any order.
 */
module.exports = function(grunt) {
    grunt.registerMultiTask("cssPrepare",
            "Task to be run before less and concat.",
            function() {
        grunt.task.requires("useminPrepare");

        var config = this.data;
        var targetConfigs = {};
        var targetTasks = [defaultTask];

        // Initialize all of the target configs that we are going to modify.
        supportedCssPreprocessors.forEach(function(s) {
            targetTasks.push(s.task);
        });

        targetTasks.forEach(function(t) {
            targetConfigs[t] = grunt.config(t) || {generated: {}};
            if (!targetConfigs[t].generated) {
                targetConfigs[t].generated = {};
            }

            if (!targetConfigs[t].generated.files) {
                targetConfigs[t].generated.files = [];
            }
        });

        // Copy supported CSS preprocessor files to its preprocessor task
        // config, otherwise copy to copy task config
        config.files.forEach(function(f) {
            targetConfigs[findTaskForFile(f)].generated.files.push(f);
        });

        Object.keys(targetConfigs).forEach(function(k) {
            if (targetConfigs.hasOwnProperty(k)) {
                grunt.config(k, targetConfigs[k]);

                grunt.log.writeln(k + " config is now:");
                grunt.log.writeln(JSON.stringify(targetConfigs[k], null, 4));
            }
        });
    });
}

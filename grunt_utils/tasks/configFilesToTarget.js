"use strict";

/**
 * Copies files config from generated target of options.tasks to another target
 * that was run against. This is needed because usemin always generates files to
 * generated target, but you may need to use these files for other target
 * configurations.
 */
module.exports = function(grunt) {
    grunt.registerMultiTask("configFilesToTarget",
            "Copy files config from generated target of options.tasks to "
            + "another target that was run against.",
            function() {
        grunt.task.requires("useminPrepare");

        var options = this.options();
        var target = this.target;

        if (target && target != "generated" && options && options.tasks) {
            options.tasks.forEach(function(t) {
                var taskConfig = grunt.config(t);

                if (taskConfig && taskConfig.generated
                        && taskConfig.generated.files) {
                    if (!taskConfig[target]) {
                        taskConfig[target] = {};
                    }

                    if (!taskConfig[target].files) {
                        taskConfig[target].files = [];
                    }

                    taskConfig[target].files
                            = taskConfig[target].files
                            .concat(taskConfig.generated.files);

                    grunt.config(t, taskConfig);

                    grunt.log.writeln(t + " config is now:");
                    grunt.log.writeln(JSON.stringify(taskConfig, null, 4));
                } 
            });
        }
    });
}

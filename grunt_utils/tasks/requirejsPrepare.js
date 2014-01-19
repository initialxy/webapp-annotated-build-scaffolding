"use strict";
var path = require("path");
var fs = require("fs");
var removeExt = require("../modules/removeExt");

function parseBaseUrl(/* "" */ path) {
    var data = fs.readFileSync(path, "utf8");

    var m = data && /(^|\s)require\.config\s*\(\s*\{([\s\S]*?)\}\s*\)/.exec(data);
    m = m && /(^|\s)baseUrl\s*\:\s*['"]([^'"]*?)['"]/.exec(m[2]);
    return m && m[2];
}

/**
 * Generates requirejs config. This task will conditionally run requirejs task
 * only when necessary.
 */
module.exports = function(grunt) {
    grunt.registerMultiTask("requirejsPrepare",
            "Creates requirejs task configs.",
            function() {
        grunt.task.requires("useminPrepare");

        var config = this.data || {};
        var targetConfigs = null;

        var files = config.files;

        if (files) {
            files.forEach(function(f) {
                if (f.dest && f.src && f.src.length > 1) {
                    var inDir = f.src[0];
                    var requirejsConfig = f.src[1];
                    var requirejsMain = f.src.length > 2 ? f.src[2] : f.src[1];

                    // Read and parse requirejsConfig to find baseUrl.
                    var baseUrl = inDir && parseBaseUrl(requirejsConfig);

                    if (baseUrl) {
                        baseUrl = path.join(inDir, baseUrl);
                    } else {
                        baseUrl = path.dirname(requirejsMain);
                    }

                    var target = "target-" + requirejsMain.replace(
                            new RegExp(path.sep.replace(/[\\\/]/g, "\\$&"), "g"),
                            "-");
                    
                    if (!targetConfigs) {
                        targetConfigs = {};
                    }

                    targetConfigs[target] = {};
                    targetConfigs[target].options = {};
                    targetConfigs[target].options.baseUrl = baseUrl;
                    targetConfigs[target].options.mainConfigFile = requirejsConfig;
                    targetConfigs[target].options.name = removeExt(
                            path.relative(baseUrl, requirejsMain), ".js", "");
                    targetConfigs[target].options.out = f.dest;
                    targetConfigs[target].options.optimize = "none";
                }
            });
        }

        if (targetConfigs) {
            grunt.config("requirejs", targetConfigs);
            grunt.log.writeln("requirejs configs is now:");
            grunt.log.writeln(JSON.stringify(targetConfigs, null, 4));

            grunt.task.run("requirejs");
        }
    });
}


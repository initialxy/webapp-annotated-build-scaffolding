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
        var options = this.options() || {};
        var requirejsConfigs = null;

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

                    var target = "target-" + requirejsMain;
                    
                    if (!requirejsConfigs) {
                        requirejsConfigs = {};
                    }

                    if (!options.baseUrl) {
                        options.baseUrl = baseUrl;
                    }
                    if (!options.mainConfigFile) {
                        options.mainConfigFile = requirejsConfig;
                    }
                    if (!options.name) {
                        options.name = removeExt(
                                path.relative(baseUrl, requirejsMain));
                    }
                    if (!options.out) {
                        options.out = f.dest;
                    }

                    requirejsConfigs[target] = {};
                    requirejsConfigs[target].options = options;
                }
            });
        }

        if (requirejsConfigs) {
            grunt.loadNpmTasks('grunt-contrib-requirejs');

            grunt.config("requirejs", requirejsConfigs);
            grunt.log.writeln("requirejs configs is now:");
            grunt.log.writeln(JSON.stringify(requirejsConfigs, null, 4));

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

            replaceUseminTypeConfig.generated.options.types.push({from: "amd", to: "js"});

            grunt.config("replaceUseminType", replaceUseminTypeConfig);
            grunt.log.writeln("replaceUseminType configs is now:");
            grunt.log.writeln(JSON.stringify(replaceUseminTypeConfig, null, 4));

            grunt.task.run("requirejs");
        }
    });
}


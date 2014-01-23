"use strict";
var path = require("path");
var fs = require("fs");
var removeExt = require("../modules/removeExt");

/**
 * Parse baseUrl out of config file.
 */
function parseBaseUrl(/* "" */ path) {
    var data = fs.readFileSync(path, "utf8");

    var m = data && /(^|\s)require\.config\s*\(\s*\{([\s\S]*?)\}\s*\)/.exec(data);
    m = m && /(^|\s)baseUrl\s*\:\s*['"]([^'"]*?)['"]/.exec(m[2]);
    return m && m[2];
}

/**
 * Quick and dirty way to perform a deep copy.
 */
function clone(a) {
   return JSON.parse(JSON.stringify(a));
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

                    requirejsConfigs[target] = {};
                    // Make sure we perform a deep copy of options, because
                    // there could be multiple AMD blocks and we don't want
                    // previous run to carry data to the next one.
                    requirejsConfigs[target].options = clone(options);
                    var optionsClone = requirejsConfigs[target].options;

                    if (!optionsClone.baseUrl) {
                        optionsClone.baseUrl = baseUrl;
                    }
                    if (!optionsClone.mainConfigFile) {
                        optionsClone.mainConfigFile = requirejsConfig;
                    }
                    if (!optionsClone.name) {
                        optionsClone.name = removeExt(
                                path.relative(baseUrl, requirejsMain));
                    }
                    if (!optionsClone.out) {
                        optionsClone.out = f.dest;
                    }

                    if (optionsClone.paths) {
                        Object.keys(optionsClone.paths).forEach(function(k) {
                            if(optionsClone.paths.hasOwnProperty(k)) {
                                optionsClone.paths[k] = path.relative(
                                        optionsClone.baseUrl,
                                        optionsClone.paths[k]);
                            }
                        });
                    }
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

            replaceUseminTypeConfig.generated.options.types.push({
                from: "amd",
                to: "js"
            });

            grunt.config("replaceUseminType", replaceUseminTypeConfig);
            grunt.log.writeln("replaceUseminType configs is now:");
            grunt.log.writeln(JSON.stringify(replaceUseminTypeConfig, null, 4));

            grunt.task.run("requirejs");
        }
    });
}


"use strict";
var path = require("path");

exports.name = "requirejsPrepare";

/**
 * This is a usemin step to help prepare for requirejsPrepare task. This step
 * MUST be the first step, as it needs to know where the source HTML file is
 * located by using context.inDir.
 */
exports.createConfig = function(context, block) {
    var result = {files: []};

    context.outFiles = [];
    context.inFiles.forEach(function(f) {
        if (result.files.length == 0) {
            // inDir is always recorded at first.
            result.files.push({
                dest: path.join(context.outDir, block.dest),
                src: [context.inDir]
            });
        }

        result.files[0].src.push(path.join(context.inDir, f));
    });

    context.outFiles.push(block.dest);

    return result;
}

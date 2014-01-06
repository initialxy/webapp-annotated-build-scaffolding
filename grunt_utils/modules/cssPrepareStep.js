"use strict";
var path = require("path");
var changeExt = require("./changeExt");

exports.name = "cssPrepare";

/**
 * This is a usemin step to help separate CSS preprocessor generated files.
 */
exports.createConfig = function(context, block) {
    var result = {files: []};

    context.outFiles = [];
    context.inFiles.forEach(function(f) {
        var outFile = changeExt(f, "css");
        result.files.push({
            dest: path.join(context.outDir, outFile),
            src: [path.join(context.inDir, f)]
        });
        context.outFiles.push(outFile);
    });

    return result;
}

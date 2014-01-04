"use strict";
var path = require("path");

exports.name = "cssPrepare";

function changeExt(path, ext) {
    var result = path;
    var lastDotIndex = result.lastIndexOf(".");

    if (lastDotIndex > -1) {
        result = result.substring(0, lastDotIndex + 1) + ext;
    }

    return result;
}

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

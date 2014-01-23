"use strict";
var path = require("path");

exports.name = "browserifyPrepare";

/**
 * This is a browserifyPrepare config generation step.
 */
exports.createConfig = function(context, block) {
    var result = {files: []};
    var file = {
        dest: path.join(context.outDir, block.dest),
        src: []
    };

    context.inFiles.forEach(function(f) {
        file.src.push(path.join(context.inDir, f));
    });

    context.outFiles = [block.dest];
    return {files: [file]};
}

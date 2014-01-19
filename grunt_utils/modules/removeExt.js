"use strict";

module.exports = function(path) {
    var result = path;
    var lastDotIndex = result.lastIndexOf(".");

    if (lastDotIndex > -1) {
        result = result.substring(0, lastDotIndex);
    }

    return result;
}

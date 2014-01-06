"use strict";
var path = require("path");
var changeExt = require("./changeExt");

module.exports = function(f) {
    var lastSepIndex = f.lastIndexOf(path.sep);
    if(lastSepIndex > -1) {
        f = f.substring(lastSepIndex + 1, f.length);
    }
    return changeExt(f, "map");
}

"use strict";
var changeExt = require("./changeExt");

module.exports = function(f) {
    return changeExt(f, "map");
}

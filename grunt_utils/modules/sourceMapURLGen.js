/*!
 * grunt-webapp-less-scaffolding
 * https://github.com/initialxy/grunt-webapp-less-scaffolding
 *
 * Copyright (c) 2013 Xingchen Yu (initialxy -at- gmail.com)
 * Licensed under the MIT license.
 */

var path = require("path");
var changeExt = require("./changeExt");

module.exports = function(f) {
    var lastSepIndex = f.lastIndexOf(path.sep);
    if(lastSepIndex > -1) {
        f = f.substring(lastSepIndex + 1, f.length);
    }
    return changeExt(f, "map");
}

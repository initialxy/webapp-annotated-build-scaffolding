/*!
 * grunt-webapp-less-scaffolding
 * https://github.com/initialxy/grunt-webapp-less-scaffolding
 *
 * Copyright (c) 2013 Xingchen Yu (initialxy -at- gmail.com)
 * Licensed under the MIT license.
 */

var changeExt = require("./changeExt");

module.exports = function(f) {
    return changeExt(f, "map");
}

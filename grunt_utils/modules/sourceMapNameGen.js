/*!
 * usemin-cssgen-scaffolding
 * https://github.com/initialxy/usemin-cssgen-scaffolding
 *
 * Copyright (c) 2013 Xingchen Yu (initialxy -at- gmail.com)
 * Licensed under the MIT license.
 */

var changeExt = require("./changeExt");

module.exports = function(f) {
    return changeExt(f, "map");
}

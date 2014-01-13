"use strict";

module.exports = function(str, oldSuffix, newSuffix) {
    // Sure we can use regex, but in this case, lastIndexOf + substring is
    // probably faster.
    var result = str;
    var lastIndex = str.lastIndexOf(oldSuffix);
    if (lastIndex + oldSuffix.length == str.length) {
        result = str.substring(0, lastIndex) + newSuffix;
    }
    return result;
}

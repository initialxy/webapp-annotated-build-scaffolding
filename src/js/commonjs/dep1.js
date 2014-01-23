var dep2 = require("./other/dep2");

exports.print = function() {
	console.log("dep1");
	dep2.print();
}
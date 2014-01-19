define(["other/dep2"], function(dep2) {
    return {
        print: function() {
            console.log("dep1");

            dep2.print();
        }
    };
});

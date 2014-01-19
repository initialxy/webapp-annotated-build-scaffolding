require.config({
    baseUrl: "js/amd",
    paths: {
        "other": "other"
    }
});

require(["dep1"], function(dep1) {
    console.log("main");
    dep1.print();
});

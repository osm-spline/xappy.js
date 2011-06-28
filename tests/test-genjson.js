var samples = require('./samples');

var config = {
    "planetDate" : "201101010101",
    "copyright" : "2011 OpenStreetMap contributors",
    "generator": "xappy.js v0.2",
    "version": 0.6
};

var jsongenerator = require('../lib/genjson').JSONGenerator;
var jsonGen = new jsongenerator(config, config.uri);

module.exports = {
    'createNode': function(test) {
        var toTestNode = jsonGen.create('node', samples.nodes().n1);
        var expectedJsonNode = samples.nodes().n1json;
        test.equal(toTestNode, expectedJsonNode, "\nA: "+toTestNode + "\nB: " + expectedJsonNode);
        test.finish();
    },
    'createWay': function(test) {
        var toTestWay = jsonGen.create('way', samples.ways().w1);
        var expectedJsonWay = samples.ways().w1json;
        test.equal(toTestWay, expectedJsonWay, "\nA: "+toTestWay + "\nB: " + expectedJsonWay);
        test.finish();
    },
    'createRelation': function(test) {
        var toTestRelation = jsonGen.create('relation', samples.relations().r1);
        var expectedJsonRelation = samples.relations().r1json;
        test.equal(toTestRelation, expectedJsonRelation, "\nA: "+toTestRelation + "\nB: " + expectedJsonRelation);
        test.finish();
    },
    'createHeader': function(test) {
        var toTestHeader = jsonGen.createHeader();
        var expectedJsonHeader = samples.headers().h1json;
        test.equal(toTestHeader, expectedJsonHeader, "\nA: "+toTestHeader + "\nB: " + expectedJsonHeader);
        test.finish();
    },
    'createFooter': function(test) {
        var toTestFooter = jsonGen.createFooter();
        var expectedJsonFooter = "]}";
        test.equal(toTestFooter, expectedJsonFooter, "\nA: "+toTestFooter + "\nB: " + expectedJsonFooter);
        test.finish();
    }
};

if (module == require.main) {
    async_testing = require('async_testing');
    return async_testing.run(__filename, process.ARGV);
}

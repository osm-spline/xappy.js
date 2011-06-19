var samples = require('./samples');

var config = {
    "uri" : "XXX",
    "planetDate" : "XXX",
    "copyright" : "XXX",
    "instance" : "XXX"
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
    }
};

if (module == require.main) {
    async_testing = require('async_testing');
    return async_testing.run(__filename, process.ARGV);
}

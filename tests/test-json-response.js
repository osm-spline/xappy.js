//example data---------------------------

var samples = require('./samples');

var jsonGen = require('../lib/jsonGenerator');

module.exports = {

    'createNode': function(test) {
        var toTestNode = jsonGen.createJson(samples.nodes().n1);
        var expectedJsonNode = samples.nodes().n1json;
        test.equal(toTestNode, expectedJsonNode, "\nA: "+toTestNode + "\nB: " + expectedJsonNode);
        test.finish();
    },
    'createWay': function(test) {
        var toTestWay = jsonGen.createJson(samples.ways().w1);
        var expectedJsonWay = samples.ways().w1json;
        test.equal(toTestWay, expectedJsonWay, "\nA: "+toTestWay + "\nB: " + expectedJsonWay);
        test.finish();
    },
    'createRelation': function(test) {
        var toTestRelation = jsonGen.createJson(samples.relations().r1);
        var expectedJsonRelation = samples.relations().r1json;
        test.equal(toTestRelation, expectedJsonRelation, "\nA: "+toTestRelation + "\nB: " + expectedJsonRelation);
        test.finish();
    },


};


if (module == require.main) {
    async_testing = require('async_testing');
    return async_testing.run(__filename, process.ARGV);
}

// vim:set ts=4 sw=4 expandtab foldmethod=marker: autofold

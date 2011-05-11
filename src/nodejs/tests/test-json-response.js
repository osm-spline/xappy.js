//example data---------------------------

var myTimestamp = new Date().getTime();
var SAMPLE_NODE = {
    id : 135678,
    lat : 48.2111685091189,
    lon : 16.3035366605548,
    version : 1,
    timestamp : myTimestamp,
    tags : [{k : 'amenity', v : 'hospital'}]
};

var SAMPLE_WAY = {
    id : 496969,
    nodes : [1,2],
    version : 2,
    tags : [{k : 'jk', v : 'bla'}]
};

var SAMPLE_RELATION = {
    id : 4905,
    members : [ {
        type : 'node',
        reference : 123,
        role : 'bla'
    },
    {
        type : 'way',
        reference : 34,
        role : 'blup'
    }],
    timestamp : myTimestamp,
};
//------------------------------------------

var jsonGen = require('../jsonGenerator.js');

var toTestNode = jsonGen.createNode(SAMPLE_NODE);
var toTestWay = jsonGen.createNode(SAMPLE_WAY);
var toTestRelation = jsonGen.createNode(SAMPLE_RELATION);

module.exports = {

    'createNode': function(test) {
        test.ok(true);
        var expectedJsonNode = '{"id":135678,"lat":48.2111685091189,"lon":16.3035366605548,"version":1,"timestamp":'+myTimestamp+',"tags":[{"k":"amenity","v":"hospital"}]}';
        test.equal(toTestNode, expectedJsonNode, "\nA: "+toTestNode + "\nB: " + expectedJsonNode);
        test.finish();
    },
    'createWay': function(test) {
        test.ok(true);
        var expectedJsonWay = '{"id":496969,"nodes":[1,2],"version":2,"tags":[{"k":"jk","v":"bla"}]}';
        test.equal(toTestWay, expectedJsonWay, "\nA: "+toTestWay + "\nB: " + expectedJsonWay);
        test.finish();
    },
    'createRelation': function(test) {
        test.ok(true);
        var expectedJsonRelation = '{"id":4905,"members":[{"type":"node","reference":123,"role":"bla"},{"type":"way","reference":34,"role":"blup"}],"timestamp":'+myTimestamp+'}';
        test.equal(toTestRelation, expectedJsonRelation, "\nA: "+toTestRelation + "\nB: " + expectedJsonRelation);
        test.finish();
    },


};


if (module == require.main) {
    async_testing = require('async_testing');
    return async_testing.run(__filename, process.ARGV);
}

// vim:set ts=4 sw=4 expandtab foldmethod=marker: autofold

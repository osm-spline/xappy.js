//example data---------------------------

var SAMPLE_NODE = {
    id : 135678,
    lat : 48.2111685091189,
    lon : 16.3035366605548,
    version : 1,
    timestamp : new Date(),
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
    }
    ],
        timestamp : new Date()
};
//------------------------------------------

var testfunc = require('../jsonGenerator.js');

var toTestNode = testfunc.createNode(SAMPLE_NODE);
var toTestWay = SAMPLE_WAY;
var toTestRelation = SAMPLE_RELATION;

module.exports = {

    // is-it-a-valid-object tests

    'testnode': function(test) {
        test.ok(true);
        var expectedJsonNode = '{"id": 135678, "lat": 48.2111685091189, "lon" : 16.3035366605548, "version": 1, "timestamp": '+new Date()+', "tags": {"k" : "amenity", "v" : "hospital"}}';

        test.equal(toTestNode, expectedJsonNode, toTestNode + " != " + expectedJsonNode);
        //necessary attributes
        //test.deepEqual(typeof toTestNode.id, "number", "Node id is not a number!");
        test.finish();
    },


};


if (module == require.main) {
    async_testing = require('async_testing');
    return async_testing.run(__filename, process.ARGV);
}

// vim:set ts=4 sw=4 expandtab foldmethod=marker: autofold

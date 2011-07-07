//example data---------------------------

var SAMPLE_NODE = {
    id : 1339485,
    lat : 8.2111685091189,
    lon : 19.3035366605548,
    version : 1,
    timestamp : new Date(),
    tags : [{key : 'amenity', value : 'hospital'}]
};

var SAMPLE_WAY = {
    id : 496969,
    nodes : [1,2],
    version : 2,
    tags : [{key : 'jk', value : 'bla'}]
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

//Datei data_structure_prototypes.js does not exist yet
//var test = require('../data_structure_prototypes.js');
//var test = "foo";
//TODO function does not exist yet
var toTestNode = SAMPLE_NODE;
var toTestWay = SAMPLE_WAY;
var toTestRelation = SAMPLE_RELATION;

var datStrTest = require('./helper-data-structures');

module.exports = {
	'test-node' : function (test){
		datStrTest.testnode(test,toTestNode);
		test.finish();
	},

    'test-way' : function (test){
        datStrTest.testway(test,toTestWay);
        test.finish();
    },

    'test-relation' : function (test){
        datStrTest.testrelation(test,toTestRelation);
        test.finish();
    }
};

//module.exports.test = function(test)

if (module == require.main){
    coverage_testing = require('async_testing');
    return coverage_testing.run(__filename, process.ARGV);
}

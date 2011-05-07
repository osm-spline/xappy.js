
var knownDatatypes = {
    node : {
        members : {
            id : 'number',
            lat : 'number',
            lon : 'number'
        },
        attributes : {
            version : 'number',
            uid : 'number',
            user : 'string',
            changesetId : 'number',
            timestamp : 'Date',
            tags : [{k : 'string', v : 'string'}]
        }
    },

    way : {
        members : {
            id : 'number',
            nodes : ['number']
        },
        attributes : {
            version : 'number',
            uid : 'number',
            user : 'string',
            changesetId : 'number',
            timestamp : 'Date',
            tags : [{k : 'string', v : 'string'}]
        }
    },

    relation : {
        members : {
            id : 'number',
            members : [{
                type : ['node', 'way', 'relation'],
                reference : 'number',
                role : 'string'
            }]
        },
        attributes : {
            version : 'number',
            uid : 'number',
            user : 'string',
            changesetId : 'number',
            timestamp : 'Date',
            tags : [{k : 'string', v : 'string'}]
        }
    }
};

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

//Datei data_structure_prototypes.js does not exist yet
//var test = require('../data_structure_prototypes.js');
var test = "foo";
//TODO function does not exist yet
var toTestNode = SAMPLE_NODE;
var toTestWay = SAMPLE_WAY;
var toTestRelation = SAMPLE_RELATION;
//var expectedTagFormat = {k:"string" , v:"string"};

//module.exports.test = function(test)

var underscore = require('underscore');

module.exports = {

   // is-it-a-valid-object tests

 'testnode': function(test) {
    // test.ok(true);
    //var simpleNodeString = "/node";
    //var expected = { object: "node" };

    //necessary attributes
    test.deepEqual(typeof toTestNode.id, "number", "Node id is not a number!");
    test.deepEqual(typeof toTestNode.lat, "number", "Node latitude is not a number!");
    // assert.deepEqual(typeof toTestNode.lat, "number");
    test.deepEqual(typeof toTestNode.lon, "number", "Node longtitude is not a number!");

    //optional attributes
    if(typeof toTestNode.version != "undefined"){
        test.deepEqual(typeof toTestNode.version, "number", "Node version is not a number!");
    }
    if(typeof toTestNode.uid != "undefined"){
        test.deepEqual(typeof toTestNode.uid, "number", "Node uid is not a number!");
    }
    if(typeof toTestNode.user != "undefined"){
        test.deepEqual(typeof toTestNode.user, "string", "Node user is not a string!");
    }
    if(typeof toTestNode.changesetId != "undefined"){
        test.deepEqual(typeof toTestNode.changesetId, "number", "Node changesetId is not a number!");
    }
    if(typeof toTestNode.timestamp != "undefined"){
        test.notDeepEqual(toTestNode.timestamp.getDate(), "undefined", "Node timestamp is not a Date!");
    }
    if(typeof toTestNode.tags != "undefined"){

        if (typeof toTestNode.tags[0] != "undefined"){
            for (var x=0; x<toTestNode.tags.length; x++){
                test.deepEqual(typeof toTestNode.tags[x].k, "string", "Node tag key is not a string!");
                test.deepEqual(typeof toTestNode.tags[x].v, "string", "Node tag value is not a string!");
                test.notDeepEqual(toTestNode.tags[x].k, "", "Node tag key is empty!");
                test.notDeepEqual(toTestNode.tags[x].v, "", "Node tag value is empty!");
            }
        }
    }
    test.finish();
 },

    'testway': function(test) {
        //necessary attributes
        test.deepEqual(typeof toTestWay.id, "number", "Way id is not a number!");
        //nodes: [ <bigint> ],
        //api says, way has least 2 and most 2000 nodes
        test.notDeepEqual(typeof toTestWay.nodes, "undefined", "Way has no nodes!");
        test.notDeepEqual(typeof toTestWay.nodes[0], "undefined", "Way has no nodes!");
        test.notDeepEqual(typeof toTestWay.nodes[1], "undefined", "Way has only one node!");
        test.deepEqual(typeof toTestWay.nodes[1999], "undefined", "Way has more than 2000 nodes!");
        for (var x=0; x<toTestWay.nodes.length; x++){
            test.deepEqual(typeof toTestWay.nodes[x], "number", "A node id in the way is not a number!");
        }

        //optional attributes
        if(typeof toTestWay.version != "undefined"){
            test.deepEqual(typeof toTestWay.version, "number", "Way version is not a number!");
        }
        if(typeof toTestWay.uid != "undefined"){
            test.deepEqual(typeof toTestWay.uid, "number", "Way uid is not a number!");
        }
        if(typeof toTestWay.user != "undefined"){
            test.deepEqual(typeof toTestWay.user, "string", "Way user is not a string!");
        }
        if(typeof toTestWay.changesetId != "undefined"){
            test.deepEqual(typeof toTestWay.changesetId, "number", "Way changesetId is not a number!");
        }
        if(typeof toTestWay.timestamp != "undefined"){
            test.notDeepEqual(toTestWay.timestamp.getDate(), "undefined", "Way timestamp is not a Date!");
        }
        if(typeof toTestWay.tags != "undefined"){
            if(typeof toTestWay.tags[0] != "undefined"){
                for (var x=0; x<toTestWay.tags.length; x++){
                    test.deepEqual(typeof toTestWay.tags[x].k, "string", "Way tags key is not a string!");
                    test.deepEqual(typeof toTestWay.tags[x].v, "string", "Way tags value is not a string!");
                    test.notDeepEqual(toTestWay.tags[x].k, "", "Way tags key is empty!");
                    test.notDeepEqual(toTestWay.tags[x].v, "", "Way tags value is empty!");
                }
            }
        }

        test.finish();
    },

    'testrelation': function(test){
        //necessary attributes
        test.deepEqual(typeof toTestRelation.id, "number", "Relation id is not a number!");
        test.notDeepEqual(typeof toTestRelation.members, "undefined", "Relation has no members!");
        test.notDeepEqual(typeof toTestRelation.members[0], "undefined", "Relation has no members!");
        for (var i=0; i<toTestRelation.members.length; i++){
            test.ok(underscore.include(["node","way","relation"],toTestRelation.members[i].type), "Relation type is neither node, nor way, nor relation!");
           //test.deepEqual(toTestRelation.members[i].type, "node" || "way" || "relation");
            test.deepEqual(typeof toTestRelation.members[i].reference, "number", "Relation member reference is not a number!");
            test.deepEqual(typeof toTestRelation.members[i].role, "string", "Relation member role is not a string!");
            test.notDeepEqual(toTestRelation.members[i].role, "", "Relation member role is empty!");
        }

/*  members: [ {
      type: "node" | "way" | "relation",
      reference: <bigint>,
      role: <string>
    } ]
*/

        //optional attributes
        if(typeof toTestRelation.version != "undefined"){
            test.deepEqual(typeof toTestRelation.version, "number", "Relation version is not a number!");
        }
        if(typeof toTestRelation.uid != "undefined"){
            test.deepEqual(typeof toTestRelation.uid, "number", "Relation uid is not a number!");
        }
        if(typeof toTestRelation.user != "undefined"){
            test.deepEqual(typeof toTestRelation.user, "string", "Relation user is not a string!");
        }
        if(typeof toTestRelation.changesetId != "undefined"){
            test.deepEqual(typeof toTestRelation.changesetId, "number", "Relation changesetId is not a number!");
        }
        if(typeof toTestRelation.timestamp != "undefined"){
            test.notDeepEqual(toTestRelation.timestamp.getDate(), "undefined", "Relation timestamp is not a Date!");
        }
//        test.notDeepEqual(toTestNode.timestamp.getDate(), "undefined", "Node timestamp is not a Date!");
 
        if(typeof toTestRelation.tags != "undefined"){
            if(typeof toTestRelation.tags[0] != "undefined"){
                for (var x=0; x<toTestRelation.tags.length; x++){
                test.deepEqual(typeof toTestRelation.tags[x].k, "string", "Relation tags key is not a string!");
                test.deepEqual(typeof toTestRelation.tags[x].v, "string", "Relation tags value is not a string!");
                test.notDeepEqual(toTestRelation.tags[x].k, "", "Relation tags key is empty!");
                test.notDeepEqual(toTestRelation.tags[x].v, "", "Relation tags value is empty!");
                }
            }
        }
    test.finish();
    }

};


if (module == require.main) {
  async_testing = require('async_testing');
  return async_testing.run(__filename, process.ARGV);
}

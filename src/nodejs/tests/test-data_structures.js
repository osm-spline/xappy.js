//var assert = require('assert');

//Datei data_structure_prototypes.js does not exist yet
//var test = require('../data_structure_prototypes.js');
var test = "foo";
//TODO function does not exist yet
var toTestNode = test.node;
var toTestWay = test.way;
var toTestRelation = test.relation;
//var expectedTagFormat = {k:"string" , v:"string"};

//module.exports.test = function(test)

module.exports = {
 
   // is-it-a-valid-object tests

 'testnode': function(test) {
    // test.ok(true);
    //var simpleNodeString = "/node";
    //var expected = { object: "node" };

    //necessary attributes
    test.deepEqual(typeof toTestNode.id, "number");
    test.deepEqual(typeof toTestNode.lat, "number");
    // assert.deepEqual(typeof toTestNode.lat, "number");
    test.deepEqual(typeof toTestNode.lon, "number");

    //optional attributes
    if(typeof toTestNode.version != "undefined"){
        test.deepEqual(typeof toTestNode.version, "number");
    }
    if(typeof toTestNode.uid != "undefined"){
        test.deepEqual(typeof toTestNode.uid, "number");
    }
    if(typeof toTestNode.changesetId != "undefined"){
        test.deepEqual(typeof toTestNode.changesetId, "number");
    }
    if(typeof toTestNode.tags != "undefined"){
        
        if (typeof toTestNode.tags[0] != "undefined"){
            for (var x=0; x<toTestNode.tags.length; x++){
                test.deepEqual(typeof toTestNode.tags[x].k, "string");
                test.deepEqual(typeof toTestNode.tags[x].v, "string");
                test.notDeepEqual(toTestNode.tags[x].k, "");
                test.notDeepEqual(toTestNode.tags[x].v, "");
            }
        }
    }
    test.finish();
 },

    'testway': function(test) {
        //necessary attributes
        test.deepEqual(typeof toTestWay.id, "number");
        //nodes: [ <bigint> ],
        //api says, way has least 2 and most 2000 nodes
        test.notDeepEqual(typeof toTestWay.nodes, "undefined");
        test.notDeepEqual(typeof toTestWay.nodes[0], "undefined");
        test.notDeepEqual(typeof toTestWay.nodes[1], "undefined");
        test.deepEqual(typeof toTestWay.nodes[1999], "undefined");
        for (var x=0; x<toTestWay.nodes.length; x++){
            test.deepEqual(typeof toTestWay.nodes[x], "number");
        }

        //optional attributes
        if(typeof toTestWay.version != "undefined"){
            test.deepEqual(typeof toTestWay.version, "number");
        }
        if(typeof toTestWay.uid != "undefined"){
            test.deepEqual(typeof toTestWay.uid, "number");
        }
        if(typeof toTestWay.changesetId != "undefined"){
            test.deepEqual(typeof toTestWay.changesetId, "number");
        }
        if(typeof toTestWay.tags != "undefined"){
            if(typeof toTestWay.tags[0] != "undefined"){
                for (var x=0; x<toTestWay.tags.length; x++){
                test.deepEqual(typeof toTestWay.tags[x].k, "string");
                test.deepEqual(typeof toTestWay.tags[x].v, "string");
                test.notDeepEqual(toTestWay.tags[x].k, "");
                test.notDeepEqual(toTestWay.tags[x].v, "");
                }
            }
        }

        test.finish();
    },

    'testrelation': function(test){
        //necessary attributes
        test.deepEqual(typeof toTestRelation.id, "number");
        test.notDeepEqual(typeof toTestRelation.members, "undefined");
        test.notDeepEqual(typeof toTestRelation.members[0], "undefined");
        for (var i=0; i<toTestRelation.members.length; i++){
            //test.ok(underscore.include(["node","way","relation"],toTestRealtion.members[i].type));
            test.deepEqual(toTestRelation.members[i].type, "node" || "way" || "relation");
            test.deepEqual(typeof toTestRelation.members[i].reference, "number");
            test.deepEqual(typeof toTestRelation.members[i].role, "string");
            test.notDeepEqual(toTestRelation.members[i].role, "");
        }

/*  members: [ { 
      type: "node" | "way" | "relation",
      reference: <bigint>,
      role: <string>
    } ]
*/

        //optional attributes
        if(typeof toTestRelation.version != "undefined"){
            test.deepEqual(typeof toTestRelation.version, "number");
        }
        if(typeof toTestRelation.uid != "undefined"){
            test.deepEqual(typeof toTestRelation.uid, "number");
        }
        if(typeof toTestRelation.changesetId != "undefined"){
            test.deepEqual(typeof toTestRelation.changesetId, "number");
        }
        if(typeof toTestRelation.tags != "undefined"){
            if(typeof toTestRelation.tags[0] != "undefined"){
                for (var x=0; x<toTestRelation.tags.length; x++){
                test.deepEqual(typeof toTestRelation.tags[x].k, "string");
                test.deepEqual(typeof toTestRelation.tags[x].v, "string");
                test.notDeepEqual(toTestRelation.tags[x].k, "");
                test.notDeepEqual(toTestRelation.tags[x].v, "");
                }
            }
        }
    test.finish();
    }

}


if (module == require.main) {
  async_testing = require('async_testing');
  return async_testing.run(__filename, process.ARGV);
}

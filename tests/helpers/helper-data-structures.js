
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
            changeset : 'number',
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
            changeset : 'number',
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
            changeset : 'number',
            timestamp : 'Date',
            tags : [{k : 'string', v : 'string'}]
        }
    }
};

//-----------------------------------------------------------------------------------

var _ = require('underscore')._;


    //tests that could be called by other modules
module.exports = {

   // is-it-a-valid-object tests

 'testnode': function(test,toTestNode) {

    //necessary attributes
    test.deepEqual(typeof toTestNode.id, "number", "Node id is not a number!");
    test.ok(toTestNode.id >= 1, "Invalid node id");
    test.strictEqual(toTestNode.id, Math.round(toTestNode.id),"Node.id not an integer");

    test.deepEqual(typeof toTestNode.lat, "number", "Node latitude is not a number!");
    test.ok(toTestNode.lat >= -90, "Invalid node lat");
    test.ok(toTestNode.lat <= 90, "Invalid node lat");

    test.deepEqual(typeof toTestNode.lon, "number", "Node longtitude is not a number!");
    test.ok(toTestNode.lon >= -180, "Invalid node longtitude");
    test.ok(toTestNode.lon <= 180, "Invalid node longtitude");

    //optional attributes
    if(typeof toTestNode.version != "undefined"){
        test.deepEqual(typeof toTestNode.version, "number", "Node version is not a number!");
        test.ok(toTestNode.version >= 1, "Invalid node version");
        test.strictEqual(toTestNode.version, Math.round(toTestNode.version),"Node.version not an integer");

    }
    if(typeof toTestNode.uid != "undefined"){
        test.deepEqual(typeof toTestNode.uid, "number", "Node uid is not a number!");
        test.ok(toTestNode.uid >= 1, "Invalid node uid");
        test.strictEqual(toTestNode.uid, Math.round(toTestNode.uid),"Node.uid not an integer");

    }
    if(typeof toTestNode.user != "undefined"){
        test.deepEqual(typeof toTestNode.user, "string", "Node user is not a string!");
        test.notDeepEqual(toTestNode.user, "", "Node user is empty");
    }
    if(typeof toTestNode.changeset != "undefined"){
        test.deepEqual(typeof toTestNode.changeset, "number", "Node changeset is not a number!");
        test.ok(toTestNode.changeset >= 1, "Invalid node changeset");
        test.strictEqual(toTestNode.changeset, Math.round(toTestNode.changeset),"Node.changeset not an integer");

 }
    if(typeof toTestNode.timestamp != "undefined"){
        test.notDeepEqual(toTestNode.timestamp.getDate(), "undefined", "Node timestamp is not a Date!");
    }
    if(typeof toTestNode.tags != "undefined"){

        if (typeof toTestNode.tags[0] != "undefined"){
            for (var x=0; x<toTestNode.tags.length; x++){
                test.deepEqual(typeof toTestNode.tags[x].key, "string", "Node tag key is not a string!");
                test.deepEqual(typeof toTestNode.tags[x].value, "string", "Node tag value is not a string!");
                test.notDeepEqual(toTestNode.tags[x].key, "", "Node tag key is empty!");
                test.notDeepEqual(toTestNode.tags[x].value, "", "Node tag value is empty!");
            }
        }
    }
    //test.finish();
 },

    'testway': function(test,toTestWay) {
        //necessary attributes
        test.deepEqual(typeof toTestWay.id, "number", "Way id is not a number!");
        test.ok(toTestWay.id >= 1, "Invalid way id");
        test.strictEqual(toTestWay.id, Math.round(toTestWay.id),"Way.id not an integer");

        //api says, way has least 2 and most 2000 nodes
        test.notDeepEqual(typeof toTestWay.nodes, "undefined", "Way has no nodes!");
        test.notDeepEqual(typeof toTestWay.nodes[0], "undefined", "Way has no nodes!");
        test.notDeepEqual(typeof toTestWay.nodes[1], "undefined", "Way has only one node!");
        test.deepEqual(typeof toTestWay.nodes[2000], "undefined", "Way has more than 2000 nodes!");
        for (var x=0; x<toTestWay.nodes.length; x++){
            test.deepEqual(typeof toTestWay.nodes[x], "number", "A node id in the way is not a number!");
            test.ok(toTestWay.nodes[x]>=1, "A node id in the way is negative");
            test.strictEqual(toTestWay.nodes[x], Math.round(toTestWay.nodes[x]),"Node id in a way not an integer");
        }

        //optional attributes
        if(typeof toTestWay.version != "undefined"){
            test.deepEqual(typeof toTestWay.version, "number", "Way version is not a number!");
            test.ok(toTestWay.version >= 1, "Invalid way version");
            test.strictEqual(toTestWay.version, Math.round(toTestWay.version),"Way.version not an integer");
        }

        if(typeof toTestWay.uid != "undefined"){
            test.deepEqual(typeof toTestWay.uid, "number", "Way uid is not a number!");
            test.ok(toTestWay.uid >= 1, "Invalid way uid");
            test.strictEqual(toTestWay.uid, Math.round(toTestWay.uid),"Way.uid not an integer");
        }

        if(typeof toTestWay.user != "undefined"){
            test.deepEqual(typeof toTestWay.user, "string", "Way user is not a string!");
            test.notDeepEqual(toTestWay.user, "", "Way user is empty");
        }

        if(typeof toTestWay.changeset != "undefined"){
            test.deepEqual(typeof toTestWay.changeset, "number", "Way changeset is not a number!");
            test.ok(toTestWay.changeset >= 1, "Invalid way changeset");
            test.strictEqual(toTestWay.changeset, Math.round(toTestWay.changeset),"Way.changeset not an integer");
        }

        if(typeof toTestWay.timestamp != "undefined"){
            test.notDeepEqual(toTestWay.timestamp.getDate(), "undefined", "Way timestamp is not a Date!");
        }

        if(typeof toTestWay.tags != "undefined"){
            if(typeof toTestWay.tags[0] != "undefined"){
                for (x=0; x<toTestWay.tags.length; x++){
                    test.deepEqual(typeof toTestWay.tags[x].key, "string", "Way tags key is not a string!");
                    test.deepEqual(typeof toTestWay.tags[x].value, "string", "Way tags value is not a string!");
                    test.notDeepEqual(toTestWay.tags[x].key, "", "Way tags key is empty!");
                    test.notDeepEqual(toTestWay.tags[x].value, "", "Way tags value is empty!");
                }
            }
        }

        //test.finish();
    },

    'testrelation': function(test,toTestRelation){
        //necessary attributes
        test.deepEqual(typeof toTestRelation.id, "number", "Relation id is not a number!");
        test.ok(toTestRelation.id >= 1, "Test relation id is negative");
        test.strictEqual(toTestRelation.id, Math.round(toTestRelation.id),"Relation.id not an integer");

        test.notDeepEqual(typeof toTestRelation.members, "undefined", "Relation has no members!");
        test.notDeepEqual(typeof toTestRelation.members[0], "undefined", "Relation has no members!");
        for (var i=0; i<toTestRelation.members.length; i++){
            test.ok(_.include(["node","way","relation"],toTestRelation.members[i].type), "Relation type is neither node, nor way, nor relation!");
           //test.deepEqual(toTestRelation.members[i].type, "node" || "way" || "relation");
            test.deepEqual(typeof toTestRelation.members[i].reference, "number", "Relation member reference is not a number!");
            test.ok(toTestRelation.members[i].reference >=1, "Reference of a relation member is negative");
            test.strictEqual(toTestRelation.members[i].reference, Math.round(toTestRelation.members[i].reference),"Relation member reference not an integer");

            test.deepEqual(typeof toTestRelation.members[i].role, "string", "Relation member role is not a string!");
            //test.notDeepEqual(toTestRelation.members[i].role, "", "Relation member role is empty!");
        }

        //optional attributes
        if(typeof toTestRelation.version != "undefined"){
            test.deepEqual(typeof toTestRelation.version, "number", "Relation version is not a number!");
            test.ok(toTestRelation.version >= 1, "Test relation version is negative");
            test.strictEqual(toTestRelation.version, Math.round(toTestRelation.version),"Relation.version not an integer");
        }

        if(typeof toTestRelation.uid != "undefined"){
            test.deepEqual(typeof toTestRelation.uid, "number", "Relation uid is not a number!");
            test.ok(toTestRelation.uid >= 1, "Test relation uid is negative");
            test.strictEqual(toTestRelation.uid, Math.round(toTestRelation.uid),"Relation.uid not an integer");
        }

        if(typeof toTestRelation.user != "undefined"){
            test.deepEqual(typeof toTestRelation.user, "string", "Relation user is not a string!");
            test.notDeepEqual(toTestRelation.user, "", "Relation user is empty");
        }

        if(typeof toTestRelation.changeset != "undefined"){
            test.deepEqual(typeof toTestRelation.changeset, "number", "Relation changeset is not a number!");
            test.ok(toTestRelation.changeset >= 1, "Test relation changeset is negative");
            test.strictEqual(toTestRelation.changeset, Math.round(toTestRelation.changeset),"Relation.changeset not an integer");
        }

        if(typeof toTestRelation.timestamp != "undefined"){
            test.notDeepEqual(toTestRelation.timestamp.getDate(), "undefined", "Relation timestamp is not a Date!");
        }

        if(typeof toTestRelation.tags != "undefined"){
            if(typeof toTestRelation.tags[0] != "undefined"){
                for (var x=0; x<toTestRelation.tags.length; x++){
                test.deepEqual(typeof toTestRelation.tags[x].key, "string", "Relation tags key is not a string!");
                test.deepEqual(typeof toTestRelation.tags[x].value, "string", "Relation tags value is not a string!");
                test.notDeepEqual(toTestRelation.tags[x].key, "", "Relation tags key is empty!");
                test.notDeepEqual(toTestRelation.tags[x].value, "", "Relation tags value is empty!");
                }
            }
        }
    //test.finish();
    }

};


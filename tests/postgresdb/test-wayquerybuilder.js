var wayQueryBuilder = require('../../lib/postgresdb/wayquerybuilder');
console.log(wayQueryBuilder);
var sampleObjects = require('../helpers/helper-samplexapirequestobjects');

module.exports = {
    'way': function(test) {
        var expected = {
             node : {
                name : '',
                //text : "SELECT nodes.id, nodes.version, nodes.user_id, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) AS tags, users.name AS user_name, X(nodes.geom) AS lat, Y(nodes.geom) AS lon FROM nodes, users, (SELECT DISTINCT node_id FROM way_nodes) AS nodesOfWays WHERE nodesOfWays.node_id = nodes.id AND users.id = nodes.user_id;",
                text : 'SELECT nodes.id, nodes.version, nodes.user_id, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) AS tags, X(nodes.geom) AS lat, Y(nodes.geom) AS lon, users.name AS user_name FROM nodes, users, (SELECT DISTINCT way_nodes.node_id FROM ways, way_nodes WHERE ways.id = way_nodes.way_id) AS nodesOfWays WHERE nodes.user_id = users.id AND nodesOfWays.node_id = nodes.id;',
                values : [],
                binary : true
             },
             way : {
                name : '',
                text : 'SELECT ways.id, ways.version, ways.user_id, ways.tstamp, ways.changeset_id, hstore_to_array(ways.tags) AS tags, way.nodes, users.name AS user_name FROM ways, users WHERE ways.user_id = users.id;',
                values : [],
                binary : true
             }
        };
        var input = wayQueryBuilder.createQueryPlan(sampleObjects['way']);
        test.deepEqual(input, expected, '\texpected: ' + JSON.stringify(expected) + '\n\treturned: '+ JSON.stringify(input));
        test.finish();
    },

    'way[bbox=left,bottom,right,top]': function(test) {
        var expected = {
            node : {
                name : '',
                text : 'SELECT nodes.id, nodes.version, nodes.user_id, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) AS tags, X(nodes.geom) AS lat, Y(nodes.geom) AS lon, users.name AS user_name FROM nodes, users, (SELECT DISTINCT way_nodes.node_id FROM ways, way_nodes WHERE ways.id = way_nodes.way_id AND (ST_Crosses(st_setsrid(ways.geom,4326),st_setsrid(st_makebox2d(st_setsrid(st_makepoint($1, $2),4326),st_setsrid(st_makepoint($3, $4),4326)),4326))) AS nodesOfWays WHERE nodes.user_id = users.id AND nodesOfWays.node_id = nodes.id;',
                values : [11, 53, 12, 54],
                binary : true
            },
            way : {
                name : '',
                text : 'SELECT ways.id, ways.version, ways.user_id, ways.tstamp, ways.changeset_id, hstore_to_array(ways.tags) AS tags, way.nodes, users.name AS user_name FROM ways, users WHERE ways.user_id = users.id AND (ST_Crosses(st_setsrid(ways.geom,4326),st_setsrid(st_makebox2d(st_setsrid(st_makepoint($1,$2),4326),st_setsrid(st_makepoint($3,$4),4326)),4326));',
                values : [11,53,12,54],
                binary : true
            }
        };
        var input = wayQueryBuilder.createQueryPlan(sampleObjects['way[bbox=11,53,12,54]']);
        console.log(sampleObjects['way[bbox=11,53,12,54]']);
        test.deepEqual(input, expected, '\texpected: ' + JSON.stringify(expected) + '\n\treturned: '+ JSON.stringify(input));
        test.finish();
    }/*,
    'way[tag=key:value]': function(test) {
                //select all nodes whích are in the bbox
                //queryBuilder should return an array of sql requests
                var myQueryObject = {
                    object : 'way',
                    tag : {
                        key : ['amenity'],
                        value : ['pub']
                    }
                };

                var expected = {
                        node : {
                                name : '',
                                text : "SELECT * FROM ways WHERE (ways.tags @> hstore($1,$2));",
                                values : ['amenity','pub'],
                              binary : true
                        }
                };
                var input = new QueryBuilder().createQueryPlan(myQueryObject);
                test.deepEqual(input, expected, 'queryPlan with on query for all nodes');
                test.finish();
        },

    'way[tag=key,key:value,value]': function(test) {
                //select all nodes whích are in the bbox
                //queryBuilder should return an array of sql requests
                var myQueryObject = {
                        object : 'way',
                        tag : {
                            key : ['amenity','test'],
                            value : ['pub','val']
                    }
                };

                var expected = {
                        node : {
                                name : '',
                                text : "SELECT * FROM ways WHERE (ways.tags @> hstore($1,$3) OR ways.tags @> hstore($1,$4) OR ways.tags @> hstore($2,$3) OR ways.tags @> hstore($2,$4));",
                                values : ['amenity','test','pub','val'],
                              binary : true
                        }
                };
                var input = new QueryBuilder().createQueryPlan(myQueryObject);
                test.deepEqual(input, expected, 'queryPlan with on query for all nodes');
                test.finish();
        },

    'way[2tag,bbox]': function(test) {
                //select all nodes whích are in the bbox
                //queryBuilder should return an array of sql requests
                var myQueryObject = {
                        object : 'way',
                        bbox : { left : 13,
                 bottom : 52,
                 right : 15,
                 top : 54
                },
            tag : {
                key : ['amenity','test'],
                value : ['pub','val']
            }
                };

                var expected = {
                        node : {
                                name : '',
                                text : "SELECT * FROM ways WHERE (ST_Crosses(st_setsrid(ways.geom,4326), st_setsrid(st_makebox2d(st_setsrid(st_makepoint($1, $2),4326)),st_srid(st_makepoint($3, $4),4326)),4326))) AND (ways.tags @> hstore($5,$7) OR ways.tags @> hstore($5,$8) OR ways.tags @> hstore($6,$7) OR ways.tags @> hstore($6,$8));",
                                values : [13,52,15,54,'amenity','test','pub','val'],
                              binary : true
                        }
                };
                var input = new QueryBuilder().createQueryPlan(myQueryObject);
                test.deepEqual(input, expected, 'queryPlan with on query for all nodes');
                test.finish();
        }
*/




};

//make this test standalone
if (module == require.main) {
    require('async_testing').run(__filename, process.ARGV);
}

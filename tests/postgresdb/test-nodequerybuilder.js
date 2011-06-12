//make this test standalone
if (module == require.main) {
	require('async_testing').run(__filename, process.ARGV);
}

var nodeQueryBuilder = require('../../lib/postgresdb/nodequerybuilder');
var sampleObjects = require('../helpers/helper-samplexapirequestobjects');

module.exports = {
	'node': function(test) {
		//select everything from nodes and retrieve user_name from users table
		//queryBuilder should return an array of sql requests
		var expected = {
			node : {
				name : '',
				text : 'SELECT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) AS tags, X(nodes.geom) AS lat, Y(nodes.geom) AS lon FROM nodes, users WHERE nodes.user_id = users.id;',
				values : [],
				binary : true
			}
		};
        var input = nodeQueryBuilder.createQueryPlan(sampleObjects['node']);
		test.deepEqual(input, expected, 'queryPlan with on query for all nodes');
		test.finish();
	},

	'node[amenity=pub]': function(test) {
        var expected = {
            node : {
                name : '',
                text : "SELECT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) AS tags, X(nodes.geom) AS lat, Y(nodes.geom) AS lon FROM nodes, users WHERE (nodes.tags @> hstore($1,$2));",
                values : ['amenity','pub'],
                binary : true
            }
        };
        var input = nodeQueryBuilder.createQueryPlan(sampleObjects['node[amenity=pub]']);
        test.deepEqual(input, expected, '\texpected: ' + JSON.stringify(expected) + '\n\treturned: '+ JSON.stringify(input));
        test.finish();
    },

	'node[name|name:de=Cologne|Koeln]': function(test) {
        var expected = {
            node : {
                name : '',
                text : "SELECT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) AS tags, X(nodes.geom) AS lat, Y(nodes.geom) AS lon FROM nodes, users WHERE (nodes.tags @> hstore($1,$3) OR nodes.tags @> hstore($1,$4) OR nodes.tags @> hstore($2,$3) OR nodes.tags @> hstore($2,$4));",
                values : ['name','name:de','Cologne','Koeln'],
                binary : true
            }
        };
        var input = nodeQueryBuilder.createQueryPlan(sampleObjects['node[name|name:de=Cologne|Koeln]']);
        test.deepEqual(input, expected, '\texpected: ' + JSON.stringify(expected) + '\n\treturned: '+ JSON.stringify(input));
        test.finish();
    },

    'node[bbox=13,52,14,53]': function(test) {
        var expected = {
            node : {
                name : '',
                text :"SELECT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) AS tags, X(nodes.geom) AS lat, Y(nodes.geom) AS lon FROM nodes, users WHERE (ST_intersects(nodes.geom,4236), st_setsrid(st_makebox2d(st_setsrid(st_makepoint($1, $2),4326)),st_srid(st_makepoint($3, $4),4326)),4326)));",
                values : [13, 52, 14, 53],
                binary : true
            }
        };
        var input = nodeQueryBuilder.createQueryPlan(sampleObjects['node[bbox=13,52,14,53]']);
        test.deepEqual(input, expected, '\texpected: ' + JSON.stringify(expected) + '\n\treturned: '+ JSON.stringify(input));
        test.finish();
    },

	'node[bbox=13,52,14,53][name|name:de=Berlin|Berlin]': function(test) {
        var expected = {
            node : {
                name : '',
                text : "SELECT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) AS tags, X(nodes.geom) AS lat, Y(nodes.geom) AS lon FROM nodes, users WHERE (ST_intersects(nodes.geom,4236), st_setsrid(st_makebox2d(st_setsrid(st_makepoint($1, $2),4326)),st_srid(st_makepoint($3, $4),4326)),4326))) AND (nodes.tags @> hstore($5,$7) OR nodes.tags @> hstore($5,$8) OR nodes.tags @> hstore($6,$7) OR nodes.tags @> hstore($6,$8));",
                values : [13,52,14,53,'name','name:de','Berlin','Berlin'],
                binary : true
            }
        };
        var input = nodeQueryBuilder.createQueryPlan(sampleObjects['node[bbox=13,52,14,53][name|name:de=Berlin|Berlin]']);
        test.deepEqual(input, expected, '\texpected: ' + JSON.stringify(expected) + '\n\treturned: '+ JSON.stringify(input));
        test.finish();
    },

    //child predicate tests

    '//api/0.6/node[way]': function(test) {
		//select all nodes whích are on at least one way
		//queryBuilder should return an array of sql requests
		var expected = {
			node : {
				name : '',
				text :"SELECT DISTINCT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(tags), X(geom) AS lat, Y(geom) AS lon FROM nodes, way_nodes, users WHERE nodes.id = way_nodes.node_id AND nodes.user_id = users.id;" ,
				values : [],
                binary : true
			}
		};
        var input = nodeQueryBuilder.createQueryPlan(sampleObjects['node[way]']);
        test.deepEqual(input, expected, '\texpected: ' + JSON.stringify(expected) + '\n\treturned: '+ JSON.stringify(input));
		test.finish();
	},

	'node[not(way)]': function(test) {
		//select all nodes whích are NOT on a way
		//queryBuilder should return an array of sql requests
		var expected = {
			node : {
				name : '',
				text : 'SELECT DISTINCT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(tags), X(geom) AS lat, Y(geom) AS lon FROM (nodes JOIN users  ON (nodes.user_id = users.id)) LEFT OUTER JOIN way_nodes ON (nodes.id = way_nodes.node_id);',
				values : [],
                binary : true
			}
		};
        var input = nodeQueryBuilder.createQueryPlan(sampleObjects['node[not(way)]']);
        test.deepEqual(input, expected, '\texpected: ' + JSON.stringify(expected) + '\n\treturned: '+ JSON.stringify(input));
		test.finish();
	},

	'node[tag]': function(test) {
		//select all nodes whích have a tag
		//queryBuilder should return an array of sql requests
		//TODO: fix SQL
		var expected = {
			node : {
				name : '',
				text : 'SELECT DISTINCT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(tags), X(geom) AS lat, Y(geom) AS lon FROM nodes, users WHERE nodes.user_id = users.id AND NOT avals("nodes.tags"=>null) = array[null];',
				values : [],
                binary : true
			}
		};
        var input = nodeQueryBuilder.createQueryPlan(sampleObjects['node[tag]']);
        test.deepEqual(input, expected, '\texpected: ' + JSON.stringify(expected) + '\n\treturned: '+ JSON.stringify(input));
		test.finish();
	}
};

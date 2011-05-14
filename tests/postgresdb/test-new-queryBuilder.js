//make this test standalone
if (module == require.main) {
	require('async_testing').run(__filename, process.ARGV);
}

// does not exist yet
var QueryBuilder = require('../../lib/postgresdb/querybuilder').QueryBuilder;

module.exports = {
	//api/0.6/node
	'//api/0.6/node': function(test) {
		//select everything from nodes and retrieve user_name from users table
		//queryBuilder should return an array of sql requests
		var myQueryObject = {
			object : 'node'
		};
		var expected = {
			node : {
				name : '',
				text : 'SELECT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) AS tags, X(nodes.geom) AS lat, Y(nodes.geom) AS lon FROM nodes, users WHERE nodes.user_id = users.id;',
				values : []
			}
		};
		var input = new QueryBuilder().createQueryPlan(myQueryObject);
		test.deepEqual(input, expected, 'queryPlan with on query for all nodes');
		test.finish();
	},
	
	'//api/0.6/node[way]': function(test) {
		//select all nodes whích are on at least one way
		//queryBuilder should return an array of sql requests
		var myQueryObject = {
			object : 'node',
			predicate: 'way'
		};
		var expected = {
			node : {
				name : '',
				text : 'SELECT DISTINCT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(tags), X(geom) AS lat, Y(geom) AS lon FROM nodes, way_nodes, users WHERE nodes.id = way_nodes.node_id AND nodes.user_id = users.id;',
				values : []
			}
		};
		var input = new QueryBuilder().createQueryPlan(myQueryObject);
		test.deepEqual(input, expected, 'queryPlan with on query for all nodes');
		test.finish();
	},
	
	'//api/0.6/node(not[way])': function(test) {
		//select all nodes whích are NOT on a way
		//queryBuilder should return an array of sql requests
		var myQueryObject = {
			object : 'node',
			predicate: 'not[way]'
		};
		var expected = {
			node : {
				name : '',
				text : 'SELECT DISTINCT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(tags), X(geom) AS lat, Y(geom) AS lon FROM (nodes JOIN users  ON (nodes.user_id = users.id)) LEFT OUTER JOIN way_nodes ON (nodes.id = way_nodes.node_id);',
				values : []
			}
		};
		var input = new QueryBuilder().createQueryPlan(myQueryObject);
		test.deepEqual(input, expected, 'queryPlan with on query for all nodes');
		test.finish();
	},
	
	'//api/0.6/node[tag]': function(test) {
		//select all nodes whích have a tag
		//queryBuilder should return an array of sql requests
		//TODO: fix SQL
		var myQueryObject = {
			object : 'node',
			predicate: 'tag'
		};
		var expected = {
			node : {
				name : '',
				text : 'SELECT DISTINCT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(tags), X(geom) AS lat, Y(geom) AS lon FROM nodes, users WHERE nodes.user_id = users.id AND NOT avals("nodes.tags"=>null) = array[null];',
				values : []
			}
		};
		var input = new QueryBuilder().createQueryPlan(myQueryObject);
		test.deepEqual(input, expected, 'queryPlan with on query for all nodes');
		test.finish();
	},
	
	'//api/0.6/node(not[tag])': function(test) {
		//select all nodes whích don't have a tag
		//queryBuilder should return an array of sql requests
		//TODO: fix SQL
		var myQueryObject = {
			object : 'node',
			predicate: 'not[tag]'
		};
		var expected = {
			node : {
				name : '',
				text : 'SELECT DISTINCT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(tags), X(geom) AS lat, Y(geom) AS lon FROM nodes, users WHERE nodes.user_id = users.id AND avals("nodes.tags"=>null) = array[null];',
				values : ['tag']
			}
		};
		var input = new QueryBuilder().createQueryPlan(myQueryObject);
		test.deepEqual(input, expected, 'queryPlan with on query for all nodes');
		test.finish();
	},

};

//make this test standalone
if (module == require.main) {
	require('async_testing').run(__filename, process.ARGV);
}

// does not exist yet
//var QueryBuilder = require('../../postgresdb/querybuilder').QueryBuilder;

module.exports = {
	//api/0.6/node
	'//api/0.6/node': function(test) {
		//selecht everything from nodes and retrieve user_name from users table
		//queryBuilder should return an array of sql requests
		var myQueryObject = {
			object : 'node'
		};
		var expected = {
			nodes : {
				name : '',
				text : 'SELECT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) AS tags, X(nodes.geom) AS lat, Y(nodes.geom) AS lon FROM nodes, users WHERE nodes.user_id = users.id;',
				values : []
			}
		};
		var input = new QueryBuilder().createQueryPlan(myQueryObject);
		test.deepEqual(input, expected, 'queryPlan with on query for all nodes');
		test.finish();
	}

};

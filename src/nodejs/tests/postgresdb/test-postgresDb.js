//make this test standalone
if (module == require.main) {
	require('async_testing').run(__filename, process.ARGV);
}

// does not exist yet
//var PostgresDb = require('../../postgresdb/postgresdb').PostgresDb;

module.exports = {
	//api/0.6/node
	'//api/0.6/node': function(test) {
		//selecht everything from nodes and retrieve user_name from users table
		//queryBuilder should return an array of sql requests
		var myQueryObject = {
			object : 'node'
		};
		new PostgresDb(connectionString).executeRequest(myQueryObject,function(eventEmitter){});
		//test.deepEqual(input, expected, 'queryPlan with on query for all nodes');
		test.finish();
	}

};

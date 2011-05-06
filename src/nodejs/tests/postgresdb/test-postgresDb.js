//make this test standalone
if (module == require.main) {
	require('async_testing').run(__filename, process.ARGV);
}

// does not exist yet
var PostgresDb = require('../../postgresdb/postgresdb').PostgresDb;
var events = require('events');
module.exports = {
	//api/0.6/node
	'test emitter functionality of query': function(test) {
		//selecht everything from nodes and retrieve user_name from users table
		//queryBuilder should return an array of sql requests
		test.numAssertions = 1;
		var myQueryObject = {
			object : 'node'
		};
		var backend = {
				connect : function(connectionString, callback) {
							var client = new events.EventEmitter();
							client.query = function(query) {
								var queryEventEmitter = new events.EventEmitter();
								setTimeout(function() {
									queryEventEmitter.emit('row', {});
								},100);
								return queryEventEmitter;
							};
							callback(null, client);
						  }

		};
		var blub = new PostgresDb('',backend);
		blub.executeRequest(myQueryObject,function(error, ev){
			console.log(ev);
			ev.on('node', function(node) {
				console.log(node);
				test.ok(true);
				test.finish();
			});
		});
		//test.deepEqual(input, expected, 'queryPlan with on query for all nodes');
	}

};

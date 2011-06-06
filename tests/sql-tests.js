//make this test standalone
if (module == require.main) {
	require('async_testing').run(__filename, process.ARGV);
}

var SqlQuery = require(__dirname + '/sqlquery').SqlQuery;

module.exports = {
	//api/0.6/node
	'//api/0.6/node': function(test) {
		var xapiRequestObject = {
			object : 'node'
		};
		var expected = {
			node : {
				id: 1
			}
			/*
			//TODO
			//id, version, user, user_id, tstamp, changeset_id, tags, latitude, longitude
			node : {
				{1, 1, sladda, 291857, 2011-05-26T16:47:48+00:00, {'amenity': 'hospital', 'name': 'Wilhelminenspital'}, 51.415, 9.427},
				{2, 1, sladda, 291857, 2011-05-26T16:47:48+00:00, {}, 53.6, 7.2},
				{3, 1, sladda, 291857, 2011-05-26T16:47:48+00:00, {'amenity': 'hotel', 'name': 'HomeSweetHome'}, 47.999, 7.8526},
				{4, 1, sladda, 291857, 2011-05-26T16:47:48+00:00, {'amenity': 'hotel', 'name': 'WalthersTruckStop'}, 47.999, 7.8526},
				{5, 1, sladda, 291857, 2011-05-26T16:47:48+00:00, {'amenity': 'bar', 'name': 'Lucies'}, 49.7, 13.4},
				{6, 1, sladda, 291857, 2011-05-26T16:47:48+00:00, {'building': 'emblem', 'name': 'brandenburgerTor'}, 53.33, 11.52},
				{7, 1, sladda, 291857, 2011-05-26T16:47:48+00:00, {'amenity': 'hospital', 'name': 'HeisseSchwestern'}, 48.13, 11.7}
			},
			
			way : {
				{}
			},
			
			relation : {
				{}
			}
			*/
		};
		
		var input = new SqlQuery().createQuery(xapiRequestObject);
		console.log('INPUT: ' + input);
		console.log('EXPECTED: ' + expected['node']['id']);
		test.deepEqual(input, expected, 'xapiRequestObject for all nodes');
		test.finish();
	},
	
};
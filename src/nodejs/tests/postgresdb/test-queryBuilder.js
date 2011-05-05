//make this test standalone
if (module == require.main) {
	require('async_testing').run(__filename, process.ARGV);
}

var QueryBuilder = require('../../postgresdb/querybuilder').QueryBuilder;

module.exports = {
	//api/0.6/node
	'select nodes': function(test) {
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
		var input = new QueryBuilder().createQueries(myQueryObject);
		test.equal(input, expected);
		test.finish();
	},
	//api/0.6/ways
	'select ways': function(test) {

		var myQueryObject = {
			object : 'way'
		};
		var expected = {
			ways : {
					   name : '',
					   text : 'SELECT ways.id, ways.version, ways.user_id, name AS user_name, ways.tstamp, ways.changeset_id, hstore_to_array(ways.tags), ways.nodes FROM ways, users WHERE ways.user_id = users.id;',
					   values : []
				   },
			nodes : {
						name : '',
						text : 'SELECT DISTINCT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(tags), X(geom) AS lat, Y(geom) AS lon FROM nodes, way_nodes, users WHERE nodes.id = way_nodes.node_id AND nodes.user_id = users.id;',
						values : []
					}
		};

		var input = new QueryBuilder().createQueries(myQueryObject);
		test.equal(input, expected);
		test.finish();
	},
	//api/0.6/relation
	'select relation': function(test) {
	    var myQueryObject = {
			object : 'relation'
		};
		var expected = {
			// select the node from every relation
			//	SELECT * FROM nodes JOIN (SELECT DISTINCT * FROM relation_members WHERE member_type = 'N') AS relation_nodes ON relation_nodes.member_id = nodes.id;
			// select the nodes from every way in the relation
			// SELECT nodes.id, nodes.version, nodes.user_id, nodes.tstamp, nodes.changeset_id, hstore_to_array(tags) AS tags, X(geom) AS lat, Y(geom) AS lon FROM nodes JOIN (SELECT * FROM way_nodes JOIN (SELECT DISTINCT relation_members.member_id FROM relation_members WHERE member_type = 'W') AS foo ON foo.member_id = way_nodes.way_id) as bar ON node_id = nodes.id;
			// in theory just UNION both
			//TODO add user_name
			nodes : {
						name : '',
						text : 'SELECT nodes.id, nodes.version, nodes.user_id, nodes.tstamp, nodes.changeset_id, hstore_to_array(tags) AS tags, X(geom) AS lat, Y(geom) AS lon FROM nodes JOIN (SELECT DISTINCT * FROM relation_members WHERE member_type = \'N\') AS relation_nodes ON relation_nodes.member_id = nodes.id' +
				'UNION' +
				'SELECT nodes.id, nodes.version, nodes.user_id, nodes.tstamp, nodes.changeset_id, hstore_to_array(tags) AS tags, X(geom) AS lat, Y(geom) AS lon FROM nodes JOIN (SELECT * FROM way_nodes JOIN     (SELECT DISTINCT relation_members.member_id FROM relation_members WHERE member_type = \'W\') AS foo ON foo.member_id = way_nodes.way_id) as bar ON node_id = nodes.id;',
						values : []
					},
			//select all members of relations that are ways and join with ways table
			ways : {
					   name : '',
					   text : 'SELECT ways.*, name AS user_name FROM (SELECT ways.id, ways.version, ways.user_id, ways.tstamp, ways.changeset_id, hstore_to_array(ways.tags), ways.nodes FROM ways JOIN (SELECT DISTINCT * FROM relation_members WHERE member_type = \'W\') AS relation_ways ON relation_ways.member_id = id) AS ways, users WHERE ways.user_id = users.id;',
					   values : []
				   },
			//returns a list of members
			relations : {
							name : '',
							text : 'SELECT relations.id, relations.version, relations.user_id, relations.tstamp, relations.changeset_id, hstore_to_array(tags), relation_members.member_id, relation_members.member_type, relation_members.member_role FROM relations, relation_members WHERE relations.id = relation_members.relation_id;',
							values : []
						}
		};
		var input = new QueryBuilder().createQueries(myQueryObject);
		test.equal(input, expected);
		test.finish();
	},
	//api/0.6/*
	'select all': function(test) {
		var myQueryObject = {
			object : '*'
		};
		var expected = {
			nodes : {
						name : '',
						text : 'SELECT nodes.id, nodes.version, nods.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(tags) AS tags, X(geom) AS lat, Y(geom) AS lon FROM nodes, users WHERE nodes.user_id = users.id;',
						values : []
					},

			ways : {
					   name : '',
					   text : 'SELECT ways.id, ways.version, ways.user_id, users.name AS user_name, ways.tstamp, ways.changeset_id, hstore_to_array(ways.tags), ways.nodes FROM ways, users WHERE ways.user_id = users.id;',
					   values : []
				   },
			//TODO add user_name
			relations: {
						   name : '',
						   text : 'SELECT relations.id, relations.version, relations.user_id, users.id AS user_name, relations.tstamp, relations.changeset_id, hstore_to_array(tags) FROM relations, users WHERE relations.user_id',
						   values : []
					   }
		};
		var input = new QueryBuilder().createQueries(myQueryObject);
		test.equal(input, expected);
		test.finish();
	},

	'create bbox' : function(test) {
		var float_str = '([-]?(0|[1,2,3,4,5,6,7,8,9]\\d*)(\\.\\d+)?)';
		var expected = '^(geom && st_setsrid\\(st_makebox2d\\(st_setsrid\\(st_makepoint\\(\\$\\d+,\\$\\d+\\),4326\\),st_setsrid\\(st_makepoint\\(\\$\\d+,\\$\\d+\\),4326\\)\\),4326\\))$';
		//var input = 'geom && st_setsrid(st_makebox2d(st_setsrid(st_makepoint($0,$1),4326),st_setsrid(st_makepoint($3,$4),4326)),4326)';
		//console.log(input.match(expected));
		var myQueryObject = {
			object : 'node',
			bbox : {
				left : 10.0,
				bottom : 10.0,
				right: 12.0,
				top : 12
			}
		};

		var input = new QueryBuilder().createBbox(myQueryObject);
		test.ok(input.match(expected));
		test.finish();
	},
	'create tags with one tag' : function(test) {
		var myQueryObject = {
			object : 'node',
			tags : [{k:'name', v:'U3'}] //FIXME
		};
		var expected = '(nodes.tags @> hstore(\'name\',\'U3\'))';
		var input = new QueryBuilder().createTags('nodes',myQueryObject.tags);
		test.equal(input, expected);
		test.finish();

	},

	'create tags with multiple tags' : function(test) {
		var myQueryObject = {
			object : 'node',
			tags : [{k:'name', v:'U3'}, {k:'name',v:'U4'}] //FIXME
		};
		var expected = '(nodes.tags @> hstore(\'name\',\'U3\') OR nodes.tags @> hstore(\'name\',\'U4\'))';
		var input = new QueryBuilder().createTags('nodes', myQueryObject.tags);
		test.equal(input,expected);
		test.finish();
	},
	//api/0.6/node[name=U3|U4]
	'create queries for nodes with tags' : function(test) {
		var myQueryObject = {
			object : 'node',
			tags : [{k:'name', v:'U3'}, {k:'name',v:'U4'}] //FIXME
		};
		//FIXME expected should be a queryPlan object with pgQueries
		var expected = {
			nodes : {
						name : '',
						text : 'SELECT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags), X(geom) AS lat, Y(geom) AS lon FROM nodes, users WHERE nodes.user_id = users.id AND (nodes.tags @> hstore(\'name\',\'U3\') OR nodes.tags @> hstore(\'name\',\'U4\'));',
						values : ['name','U3','name','U4']
					}
		};
		var input = new QueryBuilder().createQueries(myQueryObject);
		test.equal(input, expected);
		test.finish();
	},
	//api/0.6/node[10.0,10.0,12.0,12]
	'create queries for nodes with bbox' : function(test) {
		var myQueryObject = {
			object : 'node',
			bbox : {
				left : 10.0,
				bottom : 10.0,
				right: 12.0,
				top : 12
			}
		};
		var expected = {
			nodes : {
						name : '',
						text : 'SELECT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags), X(geom) AS lat, Y(geom) AS lon FROM nodes, users WHERE nodes.user_id = users.id AND (geom && st_setsrid\\(st_makebox2d\\(st_setsrid\\(st_makepoint\\(\\$\\d+,\\$\\d+\\),4326\\),st_setsrid\\(st_makepoint\\(\\$\\d+,\\$\\d+\\),4326\\)\\),4326\\));',
						values : [10.0,10.0,12.0,12]
					}
		};
		var input = new QueryBuilder().createQueries(myQueryObject);
		test.equal(input, expected);
		test.finish();
	},
	//api/0.6/node[10.0,10.0,12.0,12][name=U3]
	'create queries for nodes with bbox and tags' : function(test) {
		var myQueryObject = {
			object : 'node',
			bbox : {
				left : 12.0,
				bottom : 52.0,
				right: 13.0,
				top : 53
			},
			tags : [{k:'name', v:'U3'}]
		};
		var expected = {
			nodes : {	//pgQuery
						name : '',
						text : 'SELECT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags), X(geom) AS lat, Y(geom) AS lon FROM nodes, users WHERE nodes.user_id = users.id AND (geom && st_setsrid\\(st_makebox2d\\(st_setsrid\\(st_makepoint\\(\\$\\d+,\\$\\d+\\),4326\\),st_setsrid\\(st_makepoint\\(\\$\\d+,\\$\\d+\\),4326\\)\\),4326\\)) AND (nodes.tags @> hstore(\'name\',\'U3\'));',
						values : [12.0,52.0,13.0,53,'name','U3']
					}
		};
		var input = new QueryBuilder().createQueries(myQueryObject);
		test.equal(input, expected);
		test.finish();
	},
	'create queryPlan for api/0.6/way[12.0,52.0,13.0,53][amenity=pub]' : function(test) {
		var myQueryObject = {
			object : 'node',
			bbox : {
				left : 12.0,
				bottom : 52.0,
				right: 13.0,
				top : 53
			},
			tags : [{k:'amenity', v:'pub'}] //FIXME
		};
		var expected = {
			nodes : {
						name : '',
						text : '',
						values : [12.0,52.0,13.0,53,'amenity','pub']
					},
			ways : {	//pgQuery
						name : '',
						text : 'SELECT ways.id, ways.version, ways.user_id, users.name AS user_name, ways.tstamp, ways.changeset_id, hstore_to_array(ways.tags), ways.nodes FROM ways, users WHERE ways.user_id = users.id AND (linestring && st_setsrid(st_makebox2d(st_setsrid(st_makepoint(12.0,52.0),4326),st_setsrid(st_makepoint(13.0,53),4326)),4326)) AND (ways.tags @> hstore(\'amenity\',\'pub\'));',
						values : [12.0,52.0,13.0,53,'amenity','pub']
					}
		};
		var input = new QueryBuilder().createQueries(myQueryObject);
		test.equal(input, expected);
		test.finish();
	}

};

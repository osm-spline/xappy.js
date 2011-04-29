//make this test standalone
if (module == require.main) {
	require('async_testing').run(__filename, process.ARGV);
}

module.exports = {
	//api/0.6/node
	'select nodes': function(test) {
		//selecht everything from nodes and retrieve user_name from users table
		//queryBuilder should return an array of sql requests
		var expected = { nodes : 'SELECT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) AS tags, X(nodes.geom) AS lat, Y(nodes.geom) AS lon FROM nodes, users WHERE nodes.user_id = users.id LIMIT 1;'};
	},
	//api/0.6/ways
	'select ways': function(test) {
		var expected = { ways : 'SELECT ways.id, ways.version, ways.user_id, name AS user_name, ways.tstamp, ways.changeset_id, hstore_to_array(ways.tags), ways.nodes FROM ways, users WHERE ways.user_id = users.id;',
			nodes : 'SELECT DISTINCT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(tags), X(geom) AS lat, Y(geom) AS lon FROM nodes, way_nodes, users WHERE nodes.id = way_nodes.node_id AND nodes.user_id = users.id;'};
	},
	//api/0.6/relation
	'select relation': function(test) {
		var expected = {
			// select the node from every relation
			//	SELECT * FROM nodes JOIN (SELECT DISTINCT * FROM relation_members WHERE member_type = 'N') AS relation_nodes ON relation_nodes.member_id = nodes.id;
			// select the nodes from every way in the relation
			// SELECT nodes.id, nodes.version, nodes.user_id, nodes.tstamp, nodes.changeset_id, hstore_to_array(tags) AS tags, X(geom) AS lat, Y(geom) AS lon FROM nodes JOIN (SELECT * FROM way_nodes JOIN (SELECT DISTINCT relation_members.member_id FROM relation_members WHERE member_type = 'W') AS foo ON foo.member_id = way_nodes.way_id) as bar ON node_id = nodes.id;
			//
			//
			nodes : '',
			//select all members of relations that are ways and join with ways table
			ways : 'SELECT ways.*, name AS user_name FROM (SELECT ways.id, ways.version, ways.user_id, ways.tstamp, ways.changeset_id, hstore_to_array(ways.tags), ways.nodes FROM ways JOIN (SELECT DISTINCT * FROM relation_members WHERE member_type = \'W\') AS relation_ways ON relation_ways.member_id = id) AS ways, users WHERE ways.user_id = users.id;',
			//returns a list of members
			relations : 'SELECT relations.id, relations.version, relations.user_id, relations.tstamp, relations.changeset_id, hstore_to_array(tags), relation_members.member_id, relation_members.member_type, relation_members.member_role FROM relations, relation_members WHERE relations.id = relation_members.relation_id;'
		};
	},

	'select all': function(test) {
	}

};

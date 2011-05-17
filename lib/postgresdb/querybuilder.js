var QueryBuilder = function() {
};

QueryBuilder.prototype.createQueryPlan = function(xapiQueryObject) {
	var queryPlan;
	if(xapiQueryObject.object === 'node') {

		if(xapiQueryObject.predicate === 'way') {
			queryPlan = {
							'node' : {
										'name' : '',
										'text' : 'SELECT DISTINCT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(tags), X(geom) AS lat, Y(geom) AS lon FROM nodes, way_nodes, users WHERE nodes.id = way_nodes.node_id AND nodes.user_id = users.id;',
										'values' : []
									}
			};
		} else if(xapiQueryObject.predicate === 'not[way]') {
			queryPlan = {
							'node' : {
										'name' : '',
										'text' : 'SELECT DISTINCT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(tags), X(geom) AS lat, Y(geom) AS lon FROM (nodes JOIN users  ON (nodes.user_id = users.id)) LEFT OUTER JOIN way_nodes ON (nodes.id = way_nodes.node_id);',
										'values' : []
									}
			};
		} else if(xapiQueryObject.predicate === 'tag') {
			queryPlan = {
							'node' : {
										'name' : '',
										'text' : 'SELECT DISTINCT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(tags), X(geom) AS lat, Y(geom) AS lon FROM nodes, users WHERE nodes.user_id = users.id AND NOT avals("nodes.tags"=>null) = array[null];',
										'values' : []
									}
			};
		} else if(xapiQueryObject.bbox !== undefined) {
                        queryPlan = {
                                                        'node' : {
                                                                                'name' : '',
                                                                                'text' : "SELECT  id, tags, geom FROM nodes WHERE POINT(geom) @ polygon(box(point '($1, $2)', point '($3, $4)')));",
                                                                                'values' : [xapiQueryObject.bbox.left, xapiQueryObject.bbox.bottom, xapiQueryObject.bbox.right, xapiQueryObject.bbox.top]
                                                                        }
                        }; 

		}else {
			queryPlan = {
							'node' : {
										'name' : '',
										'text' : 'SELECT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) AS tags, X(nodes.geom) AS lat, Y(nodes.geom) AS lon FROM nodes, users WHERE nodes.user_id = users.id;',
										'values' : []
									}
			};
		}
	}
	
	return queryPlan;
};

exports.QueryBuilder = QueryBuilder;

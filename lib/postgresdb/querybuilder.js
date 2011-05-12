var QueryBuilder = function() {
};

QueryBuilder.prototype.createQueryPlan = function(xapiQueryObject) {
	var queryPlan;
	if(xapiQueryObject.object === 'node') {
		queryPlan = {
						'node' : {
									'name' : '',
									'text' : 'SELECT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) AS tags, X(nodes.geom) AS lat, Y(nodes.geom) AS lon FROM nodes, users WHERE nodes.user_id = users.id;',
									'values' : []
								}
		};
	}
	return queryPlan;
};

exports.QueryBuilder = QueryBuilder;


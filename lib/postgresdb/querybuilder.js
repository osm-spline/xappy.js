/**
 * Create a new QueryBuilder
 *
 * @constructor
 *
*/
var QueryBuilder = function() {
};

/**
 * creates a query plan from an xapiRequest object.
 *
 * @param xapiRequest
 * @return queryPlan
 *
 */
QueryBuilder.prototype.createQueryPlan = function(xapiRequest) {
	var queryPlan;
	if(xapiRequest.object === 'node') {
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

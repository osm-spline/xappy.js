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
										'values' : [],
										binary : true
									}
			};
		} else if(xapiQueryObject.predicate === 'not[way]') {
			queryPlan = {
							'node' : {
										'name' : '',
										'text' : 'SELECT DISTINCT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(tags), X(geom) AS lat, Y(geom) AS lon FROM (nodes JOIN users  ON (nodes.user_id = users.id)) LEFT OUTER JOIN way_nodes ON (nodes.id = way_nodes.node_id);',
										'values' : [],
										binary : true
									}
			};
		} else if(xapiQueryObject.predicate === 'tag') {
			queryPlan = {
							'node' : {
										'name' : '',
										'text' : 'SELECT DISTINCT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(tags), X(geom) AS lat, Y(geom) AS lon FROM nodes, users WHERE nodes.user_id = users.id AND NOT avals("nodes.tags"=>null) = array[null];',
										'values' : [],
										binary : true
									}
			};
		} else if(xapiQueryObject.bbox !== undefined) {
            queryPlan = {
                             'node' : {
                                         'name' : '',
                                         'text' : "SELECT  id, tags, geom FROM nodes WHERE POINT(geom) @ polygon(box(point '($1, $2)', point '($3, $4)')));",
                                         'values' : [xapiQueryObject.bbox.left, xapiQueryObject.bbox.bottom, xapiQueryObject.bbox.right, xapiQueryObject.bbox.top],
										binary : true
                                      }
            };
		} else if(xapiQueryObject.tag !== undefined) {
				var keys = xapiQueryObject.tag.key;
				var values = xapiQueryObject.tag.value;
				var prepared_values = new Array();
				var key_values = "";
				var count = 1;
				for(var i = 0; i < keys.length; i++) {
					for(var j = 0; j < values.length; j++) {
					
						key_values += "tags @> hstore(";
						key_values += "$"+count;
						count++;
						//key_values += keys[i];
						key_values += ",";
						key_values += "$"+count;
						//key_values += values[j];
						key_values += ") OR ";
						prepared_values.push(keys[i]);
						prepared_values.push(values[j]);
						
						//prepared_values = keys[i]+", "+values[j];
						
						count++;
						
					}
				}

				key_values = key_values.substr(0,key_values.length-4);

				console.log('SELECT * FROM nodes WHERE ' + key_values + ';');
			
                queryPlan = {
	                'node' : {
	                    'name' : '',
	                    'text' : 'SELECT * FROM nodes WHERE ' + key_values + ';',
	                    'values' : prepared_values,
						binary : true
	            	}
                }; 
			} else {
				queryPlan = {
					'node' : {
						'name' : '',
						'text' : 'SELECT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) AS tags, X(nodes.geom) AS lat, Y(nodes.geom) AS lon FROM nodes, users WHERE nodes.user_id = users.id;',
						'values' : [],
						binary : true
				}
			};
		}
	}
	                 
	return queryPlan;
};

exports.QueryBuilder = QueryBuilder

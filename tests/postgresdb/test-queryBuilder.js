//make this test standalone
if (module == require.main) {
	require('async_testing').run(__filename, process.ARGV);
}

// does not exist yet
var QueryBuilder = require('../../lib/postgresdb/querybuilder').QueryBuilder;

module.exports = {
	//api/0.6/node
	'//api/0.6/node': function(test) {
		//select everything from nodes and retrieve user_name from users table
		//queryBuilder should return an array of sql requests
		var myQueryObject = {
			object : 'node'
		};
		var expected = {
			node : {
				name : '',
				text : 'SELECT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) AS tags, X(nodes.geom) AS lat, Y(nodes.geom) AS lon FROM nodes, users WHERE nodes.user_id = users.id;',
				values : [],
				binary : true
			}
		};
		var input = new QueryBuilder().createQueryPlan(myQueryObject);
		test.deepEqual(input, expected, 'queryPlan with on query for all nodes');
		test.finish();
	},
	
	'//api/0.6/node[way]': function(test) {
		//select all nodes whích are on at least one way
		//queryBuilder should return an array of sql requests
		var myQueryObject = {
			object : 'node',
			predicate: 'way'
		};
		var expected = {
			node : {
				name : '',
				text :"SELECT DISTINCT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(tags), X(geom) AS lat, Y(geom) AS lon FROM nodes, way_nodes, users WHERE nodes.id = way_nodes.node_id AND nodes.user_id = users.id;" ,
				values : [],
                binary : true
			}
		};
		var input = new QueryBuilder().createQueryPlan(myQueryObject);
		test.deepEqual(input, expected, 'queryPlan with on query for all nodes');
		test.finish();
	},
	
	'//api/0.6/node(not[way])': function(test) {
		//select all nodes whích are NOT on a way
		//queryBuilder should return an array of sql requests
		var myQueryObject = {
			object : 'node',
			predicate: 'not[way]'
		};
		var expected = {
			node : {
				name : '',
				text : 'SELECT DISTINCT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(tags), X(geom) AS lat, Y(geom) AS lon FROM (nodes JOIN users  ON (nodes.user_id = users.id)) LEFT OUTER JOIN way_nodes ON (nodes.id = way_nodes.node_id);',
				values : [],
                binary : true
			}
		};
		var input = new QueryBuilder().createQueryPlan(myQueryObject);
		test.deepEqual(input, expected, 'queryPlan with on query for all nodes');
		test.finish();
	},
	
	'//api/0.6/node[tag]': function(test) {
		//select all nodes whích have a tag
		//queryBuilder should return an array of sql requests
		//TODO: fix SQL
		var myQueryObject = {
			object : 'node',
			predicate: 'tag'
		};
		var expected = {
			node : {
				name : '',
				text : 'SELECT DISTINCT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(tags), X(geom) AS lat, Y(geom) AS lon FROM nodes, users WHERE nodes.user_id = users.id AND NOT avals("nodes.tags"=>null) = array[null];',
				values : [],
                binary : true
			}
		};
		var input = new QueryBuilder().createQueryPlan(myQueryObject);
		test.deepEqual(input, expected, 'queryPlan with on query for all nodes');
		test.finish();
	},
	
        '//api/0.6/node[bbox=left,bottom,right,top]': function(test) {
                //select all nodes whích are in the bbox
                //queryBuilder should return an array of sql requests
                var myQueryObject = {
                        object : 'node',
                        bbox : { left : 13,
				 bottom : 52,
				 right : 15,
				 top : 54
                        }
                };
 
                var expected = {
                        node : {
                                name : '',
                                text :"SELECT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) AS tags, X(nodes.geom) AS lat, Y(nodes.geom) AS lon FROM nodes, users WHERE (ST_intersects(nodes.geom,4236), st_setsrid(st_makebox2d(st_setsrid(st_makepoint($1, $2),4326)),st_srid(st_makepoint($3, $4),4326)),4326)));",
                                values : [13, 52, 15, 54],
                                binary : true
                        }
                };
                var input = new QueryBuilder().createQueryPlan(myQueryObject);
                test.deepEqual(input, expected, 'queryPlan with on query for all nodes');
                test.finish();
        },
	
	'//api/0.6/node[tag=key:value]': function(test) {
                //select all nodes whích are in the bbox
                //queryBuilder should return an array of sql requests
                var myQueryObject = {
                    object : 'node',
			        tag : {
                      key : ['amenity'],
				      value : ['pub']
		            }           
                };
 
                var expected = {
                        node : {
                                name : '',
                                text : "SELECT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) AS tags, X(nodes.geom) AS lat, Y(nodes.geom) AS lon FROM nodes, users WHERE (nodes.tags @> hstore($1,$2));",
                                values : ['amenity','pub'],
                              binary : true
                        }
                };
                var input = new QueryBuilder().createQueryPlan(myQueryObject);
                test.deepEqual(input, expected, 'queryPlan with on query for all nodes');
                test.finish();
        },

	'//api/0.6/node[tag=key,key:value,value]': function(test) {
                //select all nodes whích are in the bbox
                //queryBuilder should return an array of sql requests
                var myQueryObject = {
                   object : 'node',
			       tag : {
                     key : ['amenity','test'],
				     value : ['pub','val']
			       } 
                };
 
                var expected = {
                        node : {
                                name : '',
                                text : "SELECT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) AS tags, X(nodes.geom) AS lat, Y(nodes.geom) AS lon FROM nodes, users WHERE (nodes.tags @> hstore($1,$3) OR nodes.tags @> hstore($1,$4) OR nodes.tags @> hstore($2,$3) OR nodes.tags @> hstore($2,$4));",
                                values : ['amenity','test','pub','val'],
                              binary : true
                        }
                };
                var input = new QueryBuilder().createQueryPlan(myQueryObject);
                test.deepEqual(input, expected, 'queryPlan with on query for all nodes');
                test.finish();
        },

	'//api/0.6/node[2tag,bbox]': function(test) {
                //select all nodes whích are in the bbox
                //queryBuilder should return an array of sql requests
                var myQueryObject = {
                  object : 'node',
                  bbox : { 
                      left : 13,
				      bottom : 52,
				      right : 15,
				      top : 54
		          },
			      tag : {
                      key : ['amenity','test'],
				      value : ['pub','val']
			      } 
                };
 
                var expected = {
                        node : {
                                name : '',
                                text : "SELECT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) AS tags, X(nodes.geom) AS lat, Y(nodes.geom) AS lon FROM nodes, users WHERE (ST_intersects(nodes.geom,4236), st_setsrid(st_makebox2d(st_setsrid(st_makepoint($1, $2),4326)),st_srid(st_makepoint($3, $4),4326)),4326))) AND (nodes.tags @> hstore($5,$7) OR nodes.tags @> hstore($5,$8) OR nodes.tags @> hstore($6,$7) OR nodes.tags @> hstore($6,$8));",
                                values : [13,52,15,54,'amenity','test','pub','val'],
                              binary : true
                        }
                };
                var input = new QueryBuilder().createQueryPlan(myQueryObject);
                test.deepEqual(input, expected, 'queryPlan with on query for all nodes');
                test.finish();
        },

        '//api/0.6/way[bbox=left,bottom,right,top]': function(test) {
                //select all nodes whích are in the bbox
                //queryBuilder should return an array of sql requests
                var myQueryObject = {
                        object : 'way',
                        bbox : { left : 13,
				 bottom : 52,
				 right : 15,
				 top : 54
		        }
                };
 
                var expected = {
                        node : {
                                name : '',
                                text :"SELECT * FROM ways WHERE (ST_Crosses(st_setsrid(ways.geom,4326), st_setsrid(st_makebox2d(st_setsrid(st_makepoint($1, $2),4326)),st_srid(st_makepoint($3, $4),4326)),4326)));",
                                values : [13, 52, 15, 54],
                              	binary : true
                        }
                };
                var input = new QueryBuilder().createQueryPlan(myQueryObject);
                test.deepEqual(input, expected, 'queryPlan with on query for all nodes');
                test.finish();
        },

	'//api/0.6/way[tag=key:value]': function(test) {
                //select all nodes whích are in the bbox
                //queryBuilder should return an array of sql requests
                var myQueryObject = {
                    object : 'way',
			        tag : {	
                        key : ['amenity'],
				        value : ['pub']
			        } 
                };
 
                var expected = {
                        node : {
                                name : '',
                                text : "SELECT * FROM ways WHERE (ways.tags @> hstore($1,$2));",
                                values : ['amenity','pub'],
                              binary : true
                        }
                };
                var input = new QueryBuilder().createQueryPlan(myQueryObject);
                test.deepEqual(input, expected, 'queryPlan with on query for all nodes');
                test.finish();
        },

	'//api/0.6/way[tag=key,key:value,value]': function(test) {
                //select all nodes whích are in the bbox
                //queryBuilder should return an array of sql requests
                var myQueryObject = {
                        object : 'way',
			            tag : {
                        	key : ['amenity','test'],
				            value : ['pub','val']
			        } 
                };
 
                var expected = {
                        node : {
                                name : '',
                                text : "SELECT * FROM ways WHERE (ways.tags @> hstore($1,$3) OR ways.tags @> hstore($1,$4) OR ways.tags @> hstore($2,$3) OR ways.tags @> hstore($2,$4));",
                                values : ['amenity','test','pub','val'],
                              binary : true
                        }
                };
                var input = new QueryBuilder().createQueryPlan(myQueryObject);
                test.deepEqual(input, expected, 'queryPlan with on query for all nodes');
                test.finish();
        },

	'//api/0.6/way[2tag,bbox]': function(test) {
                //select all nodes whích are in the bbox
                //queryBuilder should return an array of sql requests
                var myQueryObject = {
                        object : 'way',
                        bbox : { left : 13,
				 bottom : 52,
				 right : 15,
				 top : 54
		        },
			tag : {
              	key : ['amenity','test'],
				value : ['pub','val']
			} 
                };
 
                var expected = {
                        node : {
                                name : '',
                                text : "SELECT * FROM ways WHERE (ST_Crosses(st_setsrid(ways.geom,4326), st_setsrid(st_makebox2d(st_setsrid(st_makepoint($1, $2),4326)),st_srid(st_makepoint($3, $4),4326)),4326))) AND (ways.tags @> hstore($5,$7) OR ways.tags @> hstore($5,$8) OR ways.tags @> hstore($6,$7) OR ways.tags @> hstore($6,$8));",
                                values : [13,52,15,54,'amenity','test','pub','val'],
                              binary : true
                        }
                };
                var input = new QueryBuilder().createQueryPlan(myQueryObject);
                test.deepEqual(input, expected, 'queryPlan with on query for all nodes');
                test.finish();
        },


	'//api/0.6/way': function(test) {
                //select all nodes whích are in the bbox
                //queryBuilder should return an array of sql requests
                var myQueryObject = {
                        object : 'way'
                };
 
                var expected = {
                        node : {
                                name : '',
                                text : "SELECT ways.*, users.name AS user_name, hstore_to_array(ways.tags) AS tags, X(ways.geom) AS lat, Y(ways.geom) AS lon FROM ways, users WHERE ways.user_id = users.id;",
                                values : [],
                              binary : true
                        }
                };
                var input = new QueryBuilder().createQueryPlan(myQueryObject);
                test.deepEqual(input, expected, 'queryPlan with on query for all nodes');
                test.finish();
        }



};

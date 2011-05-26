var QueryBuilder = function() {
};

QueryBuilder.prototype.createQueryPlan = function(xapiQueryObject) {

    var queryPlan;
    var sql_select;
    var sql_where;
    var sql_predicate;
    var key_vaules;
    var key_values_count;
    
    key_values_count = 1;
    key_values = [];
    sql_where = "";
    sql_predicate = "";

    if(xapiQueryObject.object === 'node') {
        sql_select = 'SELECT * FROM nodes ';
        if (xapiQueryObject.bbox !== undefined) {
            if (sql_where.length > 0) {
                sql_where =  "(" + sql_where +")" + " AND (ST_intersects(nodes.geom,4236), st_setsrid(st_makebox2d(st_setsrid(st_makepoint($1, $2),4326)),st_srid(st_makepoint($3, $4),4326)),4326)))"      
            }else{
                sql_where = "WHERE (ST_intersects(nodes.geom,4236), st_setsrid(st_makebox2d(st_setsrid(st_makepoint($1, $2),4326)),st_srid(st_makepoint($3, $4),4326)),4326)))"     
            }
            key_values = key_values.concat([xapiQueryObject.bbox.left, xapiQueryObject.bbox.bottom, xapiQueryObject.bbox.right, xapiQueryObject.bbox.top]); 
            key_values_count = key_values_count +4;
        }
        if (xapiQueryObject.tag !== undefined) {
            for ( var i= 0; i<xapiQueryObject.tag.key.length;i++) { 
                key_values = key_values.concat([xapiQueryObject.tag.key[i]]);
            }
            for ( var i= 0; i<xapiQueryObject.tag.value.length;i++) {   
                key_values = key_values.concat([xapiQueryObject.tag.value[i]]);
            }
            for ( var k= 0; k<xapiQueryObject.tag.key.length;k++) { 
                for ( var j= 0; j<xapiQueryObject.tag.value.length;j++) {
                    if (k!==0||j!==0) {
                        sql_where =  sql_where + " OR nodes.tags @> hstore($" + (key_values_count+ k) +",$" + (key_values_count+ j + xapiQueryObject.tag.key.length) +")";      
                    }else{
                        if(sql_where.length !==0){
                            sql_where = sql_where + " AND (nodes.tags @> hstore($" + (key_values_count+ k) +",$" + ( (key_values_count+ j + xapiQueryObject.tag.key.length)) +")";  
                        }else{      
                            sql_where = "WHERE (nodes.tags @> hstore($" + (key_values_count+ k) +",$" + ( (key_values_count+ j + xapiQueryObject.tag.key.length)) +")";     
                        }                   
                    }
                }
            }
            sql_where = sql_where +")"
            key_values_count = key_values_count + xapiQueryObject.tag.key.length +xapiQueryObject.tag.value.length;     }
                
        if (sql_where.length ===0) {
            if(xapiQueryObject.predicate === 'way') {
                sql_predicate = "SELECT DISTINCT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(tags), X(geom) AS lat, Y(geom) AS lon FROM nodes, way_nodes, users WHERE nodes.id = way_nodes.node_id AND nodes.user_id = users.id;";
            } else if(xapiQueryObject.predicate === 'not[way]') {
                sql_predicate = 'SELECT DISTINCT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(tags), X(geom) AS lat, Y(geom) AS lon FROM (nodes JOIN users  ON (nodes.user_id = users.id)) LEFT OUTER JOIN way_nodes ON (nodes.id = way_nodes.node_id);';
            } else if(xapiQueryObject.predicate === 'tag') {
                sql_predicate = 'SELECT DISTINCT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(tags), X(geom) AS lat, Y(geom) AS lon FROM nodes, users WHERE nodes.user_id = users.id AND NOT avals("nodes.tags"=>null) = array[null];';
            }else {
                sql_predicate ='SELECT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) AS tags, X(nodes.geom) AS lat, Y(nodes.geom) AS lon FROM nodes, users WHERE nodes.user_id = users.id;';
            }
        }
    }

    if(xapiQueryObject.object === 'way') {
        sql_select = 'SELECT * FROM ways ';
        if (xapiQueryObject.bbox !== undefined) {
            if (sql_where.length > 0) {
                sql_where =  "(" + sql_where +")" + " AND (ST_Crosses(st_setsrid(ways.geom,4326), st_setsrid(st_makebox2d(st_setsrid(st_makepoint($1, $2),4326)),st_srid(st_makepoint($3, $4),4326)),4326)))"       
            }else{
                sql_where = "WHERE (ST_Crosses(st_setsrid(ways.geom,4326), st_setsrid(st_makebox2d(st_setsrid(st_makepoint($1, $2),4326)),st_srid(st_makepoint($3, $4),4326)),4326)))"  
            }
            console.log(sql_where);
            key_values = key_values.concat([xapiQueryObject.bbox.left, xapiQueryObject.bbox.bottom, xapiQueryObject.bbox.right, xapiQueryObject.bbox.top]); 
            key_values_count = key_values_count +4;
        }
        if (xapiQueryObject.tag !== undefined) {
            for ( var i= 0; i<xapiQueryObject.tag.key.length;i++) { 
                key_values = key_values.concat([xapiQueryObject.tag.key[i]]);
            }
            for ( var i= 0; i<xapiQueryObject.tag.value.length;i++) {   
                key_values = key_values.concat([xapiQueryObject.tag.value[i]]);
            }
            for ( var k= 0; k<xapiQueryObject.tag.key.length;k++) { 
                for ( var j= 0; j<xapiQueryObject.tag.value.length;j++) {
                    if (k!==0||j!==0) {
                        sql_where =  sql_where + " OR ways.tags @> hstore($" + (key_values_count+ k) +",$" + (key_values_count+ j + xapiQueryObject.tag.key.length) +")";       
                    }else{
                        if(sql_where.length !==0){
                            sql_where = sql_where + " AND (ways.tags @> hstore($" + (key_values_count+ k) +",$" + ( (key_values_count+ j + xapiQueryObject.tag.key.length)) +")";   
                        }else{      
                            sql_where = "WHERE (ways.tags @> hstore($" + (key_values_count+ k) +",$" + ( (key_values_count+ j + xapiQueryObject.tag.key.length)) +")";      
                        }                   
                    }
                }
            }
            sql_where = sql_where +")"
            key_values_count = key_values_count + xapiQueryObject.tag.key.length +xapiQueryObject.tag.value.length;     }
                
        if (sql_where.length ===0) {
            sql_predicate ='SELECT ways.*, users.name AS user_name, hstore_to_array(ways.tags) AS tags, X(ways.geom) AS lat, Y(ways.geom) AS lon FROM ways, users WHERE ways.user_id = users.id;';
        }
    }
    if (sql_predicate.length !==0) {
        queryPlan = {
            'node' : {
                'name' : '',
                'text' : sql_predicate,
                'values' : [],
                binary : true
            }
        };
    }else{
        queryPlan = {
            'node' : {
                'name' : '',
                'text' : sql_select + sql_where +";",
                'values' : key_values,
                binary : true
            }
        };
    }               
    return queryPlan;
};

exports.QueryBuilder = QueryBuilder

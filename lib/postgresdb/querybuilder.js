var log4js = require('log4js')();
var log = log4js.getLogger('postgresdb/querybuilder');

var QueryBuilder = function() {
};

function buildTags(tags) {
    var keys = tags.key;
    var values = tags.value;
    return keys.concat(values);
}

function buildWhereTags(tag, key_values_count, type) {
    var sql_where = "";
    for (var i = 0; i<tag.key.length; i++) { 
        for (var j = 0; j<tag.value.length; j++) {
            var first = key_values_count + i;
            var second = key_values_count + j + tag.key.length;
            var nodeTags = type + ".tags @> hstore($" + first + ",$" + second + ")";
            if (i != 0 || j != 0) {
                sql_where += " OR ";
            }
            sql_where += nodeTags;
        }
    }
    return sql_where;
}

QueryBuilder.prototype.createQueryPlan = function(xapiQueryObject) {

    var queryPlan;
    var sql_select;
    var sql_where = "";
    var sql_predicate = "";
    var key_values = [];
    var key_values_count = 1;
    
    if(xapiQueryObject.object === 'node') {
        sql_select = 'SELECT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) AS tags, X(nodes.geom) AS lat, Y(nodes.geom) AS lon FROM nodes, users ';
        if (xapiQueryObject.bbox) {
            if (sql_where.length > 0) {
                sql_where =  "(" + sql_where +")" + " AND (ST_intersects(nodes.geom,4236), st_setsrid(st_makebox2d(st_setsrid(st_makepoint($1, $2),4326)),st_srid(st_makepoint($3, $4),4326)),4326)))";  
            }else{
                 sql_where = "WHERE (ST_intersects(nodes.geom,4236), st_setsrid(st_makebox2d(st_setsrid(st_makepoint($1, $2),4326)),st_srid(st_makepoint($3, $4),4326)),4326)))"; 
            }

            var bbox = xapiQueryObject.bbox;
            key_values = key_values.concat([bbox.left, bbox.bottom, bbox.right, bbox.top]); 
            key_values_count = key_values_count +4;
        }
        if (xapiQueryObject.tag) {
            var tag = xapiQueryObject.tag;
            var newTags = buildTags(tag);
            key_values = key_values.concat(newTags);

            sql_where += (sql_where.length == 0)? "WHERE (" : " AND ("

            sql_where += buildWhereTags(tag, key_values_count, "nodes");
            sql_where = sql_where +")";
            key_values_count = key_values_count + xapiQueryObject.tag.key.length +xapiQueryObject.tag.value.length;

        }
        if (sql_where.length === 0) {
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
        if (xapiQueryObject.bbox) {
            if (sql_where.length > 0) {
                sql_where =  "(" + sql_where +")" + " AND (ST_Crosses(st_setsrid(ways.geom,4326), st_setsrid(st_makebox2d(st_setsrid(st_makepoint($1, $2),4326)),st_srid(st_makepoint($3, $4),4326)),4326)))"; 
            }else{
                sql_where = "WHERE (ST_Crosses(st_setsrid(ways.geom,4326), st_setsrid(st_makebox2d(st_setsrid(st_makepoint($1, $2),4326)),st_srid(st_makepoint($3, $4),4326)),4326)))"; 
            }
            log.debug(sql_where);
            key_values = key_values.concat([xapiQueryObject.bbox.left, xapiQueryObject.bbox.bottom, xapiQueryObject.bbox.right, xapiQueryObject.bbox.top]); 
            key_values_count = key_values_count +4;
        }
        if (xapiQueryObject.tag) {
            var tag = xapiQueryObject.tag;

            var newTags = buildTags(tag);
            key_values = key_values.concat(newTags);

            sql_where += (sql_where.length == 0)? "WHERE (" : " AND ("
            sql_where += buildWhereTags(tag, key_values_count, "ways");
            sql_where += ")";
            key_values_count = key_values_count + xapiQueryObject.tag.key.length +xapiQueryObject.tag.value.length;
        }
                
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

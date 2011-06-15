var log4js = require('log4js')();
var log = log4js.getLogger('postgresdb/wayQueryBuilder');
var _ = require('underscore');


var createNodeSubQuery = function(xapiRequestObject) {
    var query = {
        name : '',
        text : '',
        values : [],
        binary : true
    };
    var columns = 'nodes.id, nodes.version, nodes.user_id, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) AS tags, X(nodes.geom) AS lat, Y(nodes.geom) AS lon, users.name AS user_name';
    function createSubSelect() {
        var subSelect = 'SELECT DISTINCT way_nodes.node_id FROM ways, way_nodes WHERE ways.id = way_nodes.way_id';
        if(xapiRequestObject.bbox) {
        }
        if(xapiRequestObject.tag) {
        }
        return subSelect;
    }
    query.text = 'SELECT ' + columns + ' FROM nodes, users, (' + createSubSelect() + ') AS nodesOfWays WHERE node.user_id = users.id AND nodesOfWays.node_id = nodes.id;';
    return query;
};

var createWaySubQuery = function(xapiRequestObject) {
    var query = {
        name : '',
        text : '',
        values : [],
        binary : true
    };
    var columns = 'ways.id, ways.version, ways.user_id, ways.tstamp, ways.changeset_id, hstore_to_array(ways.tags) AS tags, way.nodes, users.name AS user_name';
    query.text = 'SELECT ' + columns + ' FROM ways, users WHERE ways.user_id = users.id';

    function createSpacialCondition() {
        var index = query.values.length+1;
        var spacialCondition = 'ST_Crosses(st_setsrid(ways.geom,4326),st_setsrid(st_makebox2d(st_setsrid(st_makepoint($' +
                                index + ', $' + index++ +'),4326),st_setsrid(st_makepoint($' +
                                    index++ +', $'+ index++ +'),4326)),4326))';
        return spacialCondition;
    }
    function createTagCondition() {
        var index = query.values.length+1;
        var parts = [];
        var tagCondition;
        _.each(xapiRequestObject.tag.key, function(key) {
            _.each(xapiRequestObject.tag.value, function(value) {
                query.values.push(key);
                query.values.push(value);
                parts.push('tags @> hstore($' + index++ + ', $' + index++ + ')');
            });
        });
        return parts.join(' OR ');
    }

    if (xapiRequestObject.bbox) {
        query.text += ' AND (' + createSpacialCondition() + ')';
    }
    if (xapiRequestObject.tag) {
        query.text += ' AND (' + createTagCondition() + ')';
    }
    query.text += ';';
    return query;
};
var createQueryPlan = function(xapiQueryObject) {
    var queryPlan = {
        node: createNodeSubQuery(xapiQueryObject),
        way: createWaySubQuery(xapiQueryObject)
    };
    return queryPlan;
};

exports.createQueryPlan = createQueryPlan;

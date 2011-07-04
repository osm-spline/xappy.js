var log4js = require('log4js')();
var log = log4js.getLogger('postgresdb/relationQueryBuilder');
var _ = require('underscore');


var createNodeSubQuery = function (xapiRequestObject) {
    var query = {
        name: '',
        text: '',
        values: [],
        binary: true
    };
    var columns =
        'nodes.id, nodes.version, nodes.user_id, nodes.tstamp, nodes.changeset_id, ' +
        'hstore_to_array(nodes.tags) AS tags, X(nodes.geom) AS lat, Y(nodes.geom) ' +
        'AS lon, users.name AS user_name';
    /*function createSpacialCondition() {
        var index = query.values.length+1;
        var spacialCondition = 'ST_Crosses(st_setsrid(ways.linestring,4326),st_setsrid(st_makebox2d(st_setsrid(st_makepoint($' +
                                    index++ + ', $' + index++ +'),4326),st_setsrid(st_makepoint($' +
                                        index++ +', $'+ index++ +'),4326)),4326))';
        var bbox = xapiRequestObject.bbox;
        query.values.push(bbox.left);
        query.values.push(bbox.bottom);
        query.values.push(bbox.right);
        query.values.push(bbox.top);
        return spacialCondition;
    }*/
    function createTagCondition() {
        var index = query.values.length + 1;
        var parts = [];
        var tagCondition;
        _.each(xapiRequestObject.tag.key, function (key) {
            _.each(xapiRequestObject.tag.value, function (value) {
                query.values.push(key);
                query.values.push(value);
                parts.push('relations.tags @> hstore($' + (index++) + ', $' + (index++) + ')');
            });
        });
        return parts.join(' OR ');
    }
    //query.text = 'SELECT ' + columns + ' FROM nodes, users, (' + createSubSelect() + ')
    //AS nodesOfWays WHERE nodes.user_id = users.id AND nodesOfWays.node_id = nodes.id;';
    var query1 =
        'SELECT relation_members.member_id AS id' +
        ' FROM relations, relation_members' +
        ' WHERE relations.id = relation_members.relation_id' +
        ' AND relation_members.member_type = \'N\'';
    var query2 =
        'SELECT way_nodes.node_id AS id' +
        ' FROM relations, relation_members, way_nodes' +
        ' WHERE relations.id = relation_members.relation_id' +
        ' AND relation_members.member_type = \'W\'' +
        ' AND relation_members.member_id = way_nodes.way_id';

    if (xapiRequestObject.tag) {
        var tagCondition = ' AND (' + createTagCondition() + ')';
        query1 += tagCondition;
        query2 += tagCondition;
    }

    query.text =
        'SELECT ' + columns + ' FROM ' +
        'nodes, users, (' + query1 + ' UNION ' + query2 + ') AS nodeIds ' +
        'WHERE nodes.id = nodeIds.id ' +
        'AND users.id = nodes.user_id;';
    return query;
};

var createWaySubQuery = function (xapiRequestObject) {
    var query = {
        name : '',
        text : '',
        values : [],
        binary : true
    };
    var columns =
        'ways.id, ways.version, ways.user_id, ways.tstamp, ways.changeset_id, ' +
        'hstore_to_array(ways.tags) AS tags, ways.nodes, users.name AS user_name';
    query.text =
        'SELECT DISTINCT ' + columns + ' FROM ' +
        'relations, relation_members, ways, users ' +
        'WHERE relations.id = relation_members.relation_id ' +
        'AND relation_members.member_type = \'W\' ' +
        'AND ways.id = relation_members.member_id ' +
        'AND ways.user_id = users.id';

    function createTagCondition() {
        var index = query.values.length + 1;
        var parts = [];
        var tagCondition;
        _.each(xapiRequestObject.tag.key, function (key) {
            _.each(xapiRequestObject.tag.value, function (value) {
                query.values.push(key);
                query.values.push(value);
                parts.push('relations.tags @> hstore($' + (index++) + ', $' + (index++) + ')');
            });
        });
        return parts.join(' OR ');
    }

    if (xapiRequestObject.tag) {
        query.text += ' AND (' + createTagCondition() + ')';
    }
    /*function createSpacialCondition() {
        var index = query.values.length+1;
        var spacialCondition = 'ST_Crosses(st_setsrid(ways.linestring,4326),st_setsrid(st_makebox2d(st_setsrid(st_makepoint($' +
                                index++ + ', $' + index++ +'),4326),st_setsrid(st_makepoint($' +
                                    index++ +', $'+ index++ +'),4326)),4326))';

        var bbox = xapiRequestObject.bbox;
        query.values.push(bbox.left);
        query.values.push(bbox.bottom);
        query.values.push(bbox.right);
        query.values.push(bbox.top);
        return spacialCondition;
    }

    if (xapiRequestObject.bbox) {
        query.text += ' AND (' + createSpacialCondition() + ')';
    }*/
    query.text += ';';
    return query;
};

var createRelationSubQuery = function (xapiRequestObject) {
    var query = {
        name : '',
        text : '',
        values : [],
        binary : true
    };
    var relationColumns =
        'relations.id, relations.version, relations.user_id, ' +
        'relations.tstamp, relations.changeset_id, hstore_to_array(relations.tags) AS tags, ' +
        'users.name AS user_name, ' +
        'relation_members.member_id, relation_members.member_type, ' +
        'relation_members.member_role, relation_members.sequence_id';

    query.text =
        'SELECT ' + relationColumns + ' FROM relations, users, relation_members' +
        ' WHERE relations.user_id = users.id' +
        ' AND relations.id = relation_members.relation_id';


    function createTagCondition() {
        var index = query.values.length + 1;
        var parts = [];
        var tagCondition;
        _.each(xapiRequestObject.tag.key, function (key) {
            _.each(xapiRequestObject.tag.value, function (value) {
                query.values.push(key);
                query.values.push(value);
                parts.push('relations.tags @> hstore($' + (index++) + ', $' + (index++) + ')');
            });
        });
        return parts.join(' OR ');
    }


    if (xapiRequestObject.tag) {
        query.text += ' AND (' + createTagCondition() + ')';
    }

    query.text += ' ORDER BY relations.id;';
    return query;
};
var createQueryPlan = function (xapiRequestObject) {
    //console.log('wayquerybuilder.createQueryPlan(%j)', xapiRequestObject);
    var queryPlan = {
        node: createNodeSubQuery(xapiRequestObject),
        way: createWaySubQuery(xapiRequestObject),
        relation: createRelationSubQuery(xapiRequestObject)
    };
    return queryPlan;
};

exports.createQueryPlan = createQueryPlan;

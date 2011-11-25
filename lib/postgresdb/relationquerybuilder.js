var log4js = require('log4js');
var log = log4js.getLogger('postgresdb/relationQueryBuilder');
var _ = require('underscore');

var NODE_COLUMNS = require('./common').NODE_COLUMNS;
var WAY_COLUMNS = require('./common').WAY_COLUMNS;
var RELATION_COLUMNS = require('./common').RELATION_COLUMNS;

var createNodeSubQuery = function (xapiRequestObject) {
    var query = {
        name: '',
        text: '',
        values: [],
        binary: true
    };
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
        'SELECT unnest(ways.nodes) AS id' +
        ' FROM relations, relation_members, ways' +
        ' WHERE relations.id = relation_members.relation_id' +
        ' AND relation_members.member_type = \'W\'' +
        ' AND relation_members.member_id = ways.id';

    if (xapiRequestObject.tag) {
        var tagCondition = ' AND (' + createTagCondition() + ')';
        query1 += tagCondition;
        query2 += tagCondition;
    }

    query.text =
        'SELECT ' + NODE_COLUMNS + ' FROM ' +
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

    query.text =
        'SELECT DISTINCT ' + WAY_COLUMNS + ' FROM ' +
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

    query.text =
        'SELECT ' + RELATION_COLUMNS + ' FROM relations, users, relation_members' +
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
    log.debug('Created QueryPlan: ' + JSON.stringify(queryPlan) + '\n and xapiRequestObject: ' + JSON.stringify(xapiRequestObject));
    return queryPlan;
};

exports.createQueryPlan = createQueryPlan;

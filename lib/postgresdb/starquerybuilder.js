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
        'nodes.id, nodes.version, nodes.user_id, nodes.tstamp, ' +
        'nodes.changeset_id, hstore_to_array(nodes.tags) ' +
        'AS tags, X(nodes.geom) AS lat, Y(nodes.geom) AS lon, users.name AS user_name';
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
    
    function createTagCondition(element) {
        var index = query.values.length + 1;
        var parts = [];
        var tagCondition;
        _.each(xapiRequestObject.tag.key, function (key) {
            _.each(xapiRequestObject.tag.value, function (value) {
                query.values.push(key);
                query.values.push(value);
                parts.push(element + '.tags @> hstore($' + (index++) + ', $' + (index++) + ')');
            });
        });
        return parts.join(' OR ');
    }
    
    //query.text = 'SELECT ' + columns + ' FROM nodes, users, (' + createSubSelect() + ') AS nodesOfWays WHERE nodes.user_id = users.id AND nodesOfWays.node_id = nodes.id;';
    var query1 = 'SELECT relation_members.member_id AS id' +
        ' FROM relations, relation_members' +
        ' WHERE relations.id = relation_members.relation_id' +
        ' AND relation_members.member_type = \'N\'';
    var query2 = 'SELECT way_nodes.node_id AS id' +
        ' FROM relations, relation_members, way_nodes' +
        ' WHERE relations.id = relation_members.relation_id' +
        ' AND relation_members.member_type = \'W\'' +
        ' AND relation_members.member_id = way_nodes.way_id';
    var query3 = 'SELECT id FROM nodes';
    var query4 = 'SELECT way_nodes.node_id AS id' +
        ' FROM ways, way_nodes' +
        ' WHERE ways.id = way_nodes.way_id';

    if(xapiRequestObject.tag) {
        //var tagRelationCondition = ' AND (' + createTagCondition() + ')';
        query1 += ' AND (' + createTagCondition('relations') + ')';
        query2 += ' AND (' + createTagCondition('relations') + ')';
        query3 += ' WHERE (' + createTagCondition('nodes') + ')';
        query4 += ' AND (' + createTagCondition('ways') + ')';
    }

    query.text = 'SELECT ' + columns + ' FROM' +
                    ' nodes, users, (' + query1 + ' UNION ' + query2 + ' UNION ' + query3 + ' UNION ' + query4 + ') AS nodeIds' +
                    ' WHERE nodes.id = nodeIds.id' +
                    ' AND users.id = nodes.user_id;';
                    
    return query;
};

var createWaySubQuery = function (xapiRequestObject) {
    var query = {
        name: '',
        text: '',
        values: [],
        binary: true
    };
    
    var columns = 'ways.id, ways.version, ways.user_id, ways.tstamp, ways.changeset_id, hstore_to_array(ways.tags) AS tags, ways.nodes, users.name AS user_name';

    function createTagCondition(element) {
        var index = query.values.length + 1;
        var parts = [];
        var tagCondition;
        _.each(xapiRequestObject.tag.key, function (key) {
            _.each(xapiRequestObject.tag.value, function (value) {
                query.values.push(key);
                query.values.push(value);
                parts.push(element + '.tags @> hstore($' + index++ + ', $' + index++ + ')');
            });
        });
        return parts.join(' OR ');
    }
    
    var query1 = 'SELECT relation_members.member_id AS id' +
        ' FROM relations, relation_members' +
        ' WHERE relations.id = relation_members.relation_id' +
        ' AND relation_members.member_type = \'W\'';
    var query2 = 'SELECT id FROM ways';
    
    if(xapiRequestObject.tag) {
        query1 += ' AND (' + createTagCondition('relations') + ')';
        query2 += ' WHERE (' + createTagCondition('ways') + ')';
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
    
    query.text = 'SELECT ' + columns + ' FROM' +
                    ' ways, users, (' + query1 + ' UNION ' + query2 + ') AS wayIds' +
                    ' WHERE ways.id = wayIds.id' +
                    ' AND users.id = ways.user_id;';
    
    return query;
};

var createRelationSubQuery = function (xapiRequestObject) {
    var query = {
        name: '',
        text: '',
        values: [],
        binary: true
    };
    
    /*
    var relationColumns = 'relations.id, relations.version, relations.user_id,' +
            ' relations.tstamp, relations.changeset_id, hstore_to_array(relations.tags) AS tags,' +
            ' users.name AS user_name,' +
            ' relation_members.member_id, relation_members.member_type, relation_members.member_role, relation_members.sequence_id';

    query.text = 'SELECT ' + relationColumns + ' FROM relations, users, relation_members' +
            ' WHERE relations.user_id = users.id' +
            ' AND relations.id = relation_members.relation_id';
    */
    
    var columns = 'relations.id, relations.version, relations.user_id,' +
            ' relations.tstamp, relations.changeset_id, hstore_to_array(relations.tags) AS tags,' +
            ' users.name AS user_name';

    function createTagCondition(element) {
        var index = query.values.length + 1;
        var parts = [];
        var tagCondition;
        _.each(xapiRequestObject.tag.key, function (key) {
            _.each(xapiRequestObject.tag.value, function (value) {
                query.values.push(key);
                query.values.push(value);
                parts.push(element + '.tags @> hstore($' + index++ + ', $' + index++ + ')');
            });
        });
        return parts.join(' OR ');
    }
    
    var query1 = 'SELECT relation_members.member_id AS id' +
        ' FROM relations, relation_members' +
        ' WHERE relations.id = relation_members.relation_id' +
        ' AND relation_members.member_type = \'R\'';
    var query2 = 'SELECT id FROM relations';
    
    if(xapiRequestObject.tag) {
        query1 += ' AND (' + createTagCondition('relations') + ')';
        query2 += ' WHERE (' + createTagCondition('relations') + ')';
    }

    query.text = 'SELECT ' + columns + ' FROM' +
                    ' relations, users, (' + query1 + ' UNION ' + query2 + ') AS relationIds' +
                    ' WHERE relations.id = relationIds.id' +
                    ' AND users.id = relations.user_id;';
    
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

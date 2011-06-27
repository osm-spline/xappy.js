var _ = require('underscore');
var log4js = require('log4js')();
var log = log4js.getLogger('postgresdb/rowparser');

var parseRowTags = function(rowTags) {
    var tags = [];
    var i;
    for(i=0; i<tags.length; i++) {
        tags.push({k:rowTags[i], v:rowTags[i+1]});
    }
    return tags;
};

/**
 * Function to convert a row from the database into a node object.
 *
 * @param row
 * @returns a node object
 */
var rowToNode = function(row) {
    log.debug('New node: ' + JSON.stringify(row));
    var node = {
        id: row.id,
        lat: row.lat,
        lon: row.lon,
        version: row.version,
        uid: row.user_id,
        user : row.user_name,
        changeset: row.changeset_id,
        timestamp: row.tstamp
    };
    if(row.tags && !_.isEmpty(row.tags)) {
        node.tags = parseRowTags(row.tags);
    }
    return node;
};

/**
 * Function to convert a row from the database into a way object.
 *
 * @param row
 * @returns a way object
 */
var rowToWay = function(row) {
    log.debug('New way: ' + JSON.stringify(row));

    var way = {
        id: row.id,
        version: row.version,
        uid: row.user_id,
        user : row.user_name,
        changeset: row.changeset_id,
        timestamp: row.tstamp,
        nodes: row.nodes
    };
    if(row.tags && !_.isEmpty(row.tags)) {
        way.tags = parseRowTags(row.tags);
    }
    return way;
};

/**
 * Function to convert a row from the database into a relation object.
 *
 * @param row
 * @returns a relation object
 */
var rowToRelation = function(row) {
    log.debug('New relation: ' + JSON.stringify(row));
    var memberTypeParser = {
        N: 'node',
        W: 'way',
        R: 'relation'
    };
    var relation = {
        id: row.id,
        version: row.version,
        uid: row.user_id,
        user : row.user_name,
        changeset: row.changeset_id,
        timestamp: row.tstamp
    };
    if(row.tags && !_.isEmpty(row.tags)) {
        relation.tags = parseRowTags(row.tags);
    }
    relation.members = [{
        type: memberTypeParser[row.member_type],
        reference: row.member_id,
        role: row.member_role
    }];
    return relation;
};

/**
 * Function to convert a row with given type into an appropriate object.
 *
 * @param type The type of the row
 * @param row The row from the database
 */
var rowToObject = function(type, row) {
    var objects = {
        node: rowToNode,
        way: rowToWay,
        relation: rowToRelation
    };

    if (type in objects) {
        return objects[type](row);
    }
    // Todo this did not return anything
    // throw is a fix
    throw 'Invalid row type: ' + type;
};

module.exports = {
    rowToNode : rowToNode,
    rowToWay : rowToWay,
    rowToRelation : rowToRelation,
    rowToObject : rowToObject
};

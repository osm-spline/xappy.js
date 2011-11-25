var log4js = require('log4js');
var log = log4js.getLogger('postgresdb/wayQueryBuilder');
var _ = require('underscore');

var NODE_COLUMNS = require('./common').NODE_COLUMNS;
var WAY_COLUMNS = require('./common').WAY_COLUMNS;

var createNodeSubQuery = function (xapiRequestObject) {
    var query = {
        name: '',
        text: '',
        values: [],
        binary: true
    };

    function createSpacialCondition() {
        var index = query.values.length + 1;
        var spacialCondition =
            'ST_Intersects(st_setsrid(ways.linestring,4326),st_setsrid(st_makebox2d(' +
                'st_setsrid(st_makepoint($' + (index++) + ', $' + (index++) +'),4326),' +
                'st_setsrid(st_makepoint($' + (index++) +', $'+ (index++) +'),4326)),4326))';
        var bbox = xapiRequestObject.bbox;
        query.values.push(bbox.left);
        query.values.push(bbox.bottom);
        query.values.push(bbox.right);
        query.values.push(bbox.top);
        return spacialCondition;
    }

    function createTagCondition() {
        var index = query.values.length + 1;
        var parts = [];
        var tagCondition;
        log.debug(JSON.stringify(xapiRequestObject.tag));
        _.each(xapiRequestObject.tag.key, function (key) {
            _.each(xapiRequestObject.tag.value, function (value) {
                query.values.push(key);
                query.values.push(value);
                parts.push('ways.tags @> hstore($' + (index++) + ', $' + (index++) + ')');
            });
        });
        return parts.join(' OR ');
    }
    function createSubSelect() {
        var subSelect =
            'SELECT DISTINCT unnest(ways.nodes) AS id ' +
            'FROM ways';
        var whereSubSelect = '';
        if (xapiRequestObject.bbox) {
            whereSubSelect += ' WHERE (' + createSpacialCondition() + ')';
        }
        if (xapiRequestObject.tag) {
            whereSubSelect += (whereSubSelect !== '') ? ' AND (' + createTagCondition() + ')' : ' WHERE (' + createTagCondition() + ')';
        }
        return subSelect + whereSubSelect;
    }

    query.text =
        'SELECT ' + NODE_COLUMNS + ' FROM nodes, users, (' + createSubSelect() + ') ' +
        'AS nodesOfWays ' +
        'WHERE nodes.user_id = users.id ' +
        'AND nodesOfWays.id = nodes.id;';
    return query;
};

var createWaySubQuery = function (xapiRequestObject) {
    var query = {
        name: '',
        text: '',
        values: [],
        binary: true
    };

    query.text =
        'SELECT ' + WAY_COLUMNS + ' FROM ways, users WHERE ways.user_id = users.id';

    function createSpacialCondition() {
        var index = query.values.length + 1;
        var spacialCondition =
            'ST_Intersects(st_setsrid(ways.linestring,4326),st_setsrid(st_makebox2d(' +
                'st_setsrid(st_makepoint($' + (index++) + ', $' + (index++) +'),4326),' +
                'st_setsrid(st_makepoint($' + (index++) +', $'+ (index++) +'),4326)),4326))';

        var bbox = xapiRequestObject.bbox;
        query.values.push(bbox.left);
        query.values.push(bbox.bottom);
        query.values.push(bbox.right);
        query.values.push(bbox.top);
        return spacialCondition;
    }
    function createTagCondition() {
        var index = query.values.length + 1;
        var parts = [];
        var tagCondition;
        _.each(xapiRequestObject.tag.key, function (key) {
            _.each(xapiRequestObject.tag.value, function (value) {
                query.values.push(key);
                query.values.push(value);
                parts.push('ways.tags @> hstore($' + (index++) + ', $' + (index++) + ')');
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

var createQueryPlan = function (xapiRequestObject) {
    //console.log('wayquerybuilder.createQueryPlan(%j)', xapiRequestObject);
    var queryPlan = {
        node: createNodeSubQuery(xapiRequestObject),
        way: createWaySubQuery(xapiRequestObject)
    };
    log.debug('Created QueryPlan: ' + JSON.stringify(queryPlan) + '\t and xapRequestObject: ' + JSON.stringify(xapiRequestObject));
    return queryPlan;
};

exports.createQueryPlan = createQueryPlan;

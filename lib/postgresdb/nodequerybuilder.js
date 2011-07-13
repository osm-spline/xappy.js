var log4js = require('log4js')();
var log = log4js.getLogger('postgresdb/nodeQuerybuilder');

var NODE_COLUMNS = 'nodes.id, nodes.version, nodes.user_id, users.name ' +
        'AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) ' +
        'AS tags, Y(nodes.geom) AS lat, X(nodes.geom) AS lon';

function buildTags(tags) {
    var keys = tags.key;
    var values = tags.value;
    return keys.concat(values);
}

function buildWhereTags(tag, key_values_count, type) {
    var sql_where = '';
    for (var i = 0; i < tag.key.length; i++) {
        for (var j = 0; j < tag.value.length; j++) {
            var first = key_values_count + i;
            var second = key_values_count + j + tag.key.length;
            var nodeTags = type + '.tags @> hstore($' + first + ',$' + second + ')';
            if (i !== 0 || j !== 0) {
                sql_where += ' OR ';
            }
            sql_where += nodeTags;
        }
    }
    return sql_where;
}

var createQueryPlan = function (xapiQueryObject) {
    var sql_select;
    var sql_where = '';
    var sql_predicate = '';
    var key_values = [];
    var key_values_count = 1;

    function addWhereAnd(where) {
        var isEmpty = sql_where.length === 0;
        sql_where += ' AND'  + ' (' + where + ')';
    }

    sql_select = 'SELECT ' + NODE_COLUMNS + ' FROM nodes, users WHERE nodes.user_id = users.id';

    if (xapiQueryObject.bbox) {
        var isEmpty = sql_where.length === 0;
        var where =
            '(ST_intersects(' +
                'st_setsrid(nodes.geom,4326),st_setsrid(st_makebox2d(' +
                    'st_setsrid(st_makepoint($1, $2),4326),' +
                    'st_setsrid(st_makepoint($3, $4),4326)' +
            '),4326)))';
        //sql_where += (isEmpty ? 'WHERE nodes.user_id = users.id' : ' AND ') + where;
        sql_where += ' AND ' + where;
        var bbox = xapiQueryObject.bbox;
        key_values = key_values.concat([bbox.left, bbox.bottom, bbox.right, bbox.top]);
        key_values_count = key_values_count + 4;
    }
    if (xapiQueryObject.tag) {
        var tag = xapiQueryObject.tag;
        var newTags = buildTags(tag);
        key_values = key_values.concat(newTags);

        addWhereAnd(buildWhereTags(tag, key_values_count, 'nodes'));
        key_values_count =
                key_values_count +
                xapiQueryObject.tag.key.length +
                xapiQueryObject.tag.value.length;

    }
    if (sql_where.length === 0) {
        if (xapiQueryObject.predicate === 'way') {
            sql_predicate =
                'SELECT DISTINCT ' + NODE_COLUMNS +
                ' FROM nodes, way_nodes, users ' +
                'WHERE nodes.id = way_nodes.node_id AND nodes.user_id = users.id;';
        } else if (xapiQueryObject.predicate === 'not(way)') {
            sql_predicate =
                'SELECT ' + NODE_COLUMNS +
                ' FROM nodes, users ' +
                'WHERE nodes.id NOT IN (SELECT node_id FROM way_nodes);';
        } else if (xapiQueryObject.predicate === 'tag') {
            sql_predicate =
                'SELECT DISTINCT ' + NODE_COLUMNS +
                ' FROM nodes, users ' +
                'WHERE nodes.user_id = users.id AND array_length(avals(nodes.tags), 1) > 0;';
        } else {
            sql_predicate =
                'SELECT ' + NODE_COLUMNS +
                ' FROM nodes, users ' +
                'WHERE nodes.user_id = users.id;';
        }
    }

    var hasPredicate = sql_predicate.length > 0;
    var queryPlan = {
        node: {
            name: '',
            binary: true
        }
    };

    queryPlan.node.text = hasPredicate ? sql_predicate : sql_select + sql_where + ';';
    queryPlan.node.values = hasPredicate ? [] : key_values;
    return queryPlan;
};

exports.createQueryPlan = createQueryPlan;

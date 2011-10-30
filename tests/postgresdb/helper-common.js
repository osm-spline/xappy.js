var NODE_COLUMNS = 'nodes.id, nodes.version, nodes.user_id, users.name ' +
        'AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) ' +
        'AS tags, Y(nodes.geom) AS lat, X(nodes.geom) AS lon';

var WAY_COLUMNS = 'ways.id, ways.version, ways.user_id, users.name ' +
        'AS user_name, ways.tstamp, ways.changeset_id, hstore_to_array(ways.tags) ' +
        'AS tags, ways.nodes';

var RELATION_COLUMNS = 'relations.id, relations.version, relations.user_id, users.name ' +
        'AS user_name, relations.tstamp, relations.changeset_id, hstore_to_array(relations.tags) ' +
        'AS tags, ' +
        'relation_members.member_id, relation_members.member_type, ' +
        'relation_members.member_role, relation_members.sequence_id';

module.exports = {
    NODE_COLUMNS: NODE_COLUMNS,
    WAY_COLUMNS: WAY_COLUMNS,
    RELATION_COLUMNS: RELATION_COLUMNS
};

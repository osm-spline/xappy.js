var starQueryBuilder = require('../../lib/postgresdb/starquerybuilder');
var sampleObjects = require('../helpers/helper-samplexapirequestobjects');

module.exports = {
    '*' : function(test) {
        var nodeColumns = 'nodes.id, nodes.version, nodes.user_id, nodes.tstamp, ' +
            'nodes.changeset_id, hstore_to_array(nodes.tags) ' +
            'AS tags, X(nodes.geom) AS lat, Y(nodes.geom) AS lon, users.name AS user_name';

        var wayColumns = 'ways.id, ways.version, ways.user_id, ways.tstamp, ways.changeset_id, ' +
            'hstore_to_array(ways.tags) AS tags, ways.nodes, users.name AS user_name';

        var relationColumns = 'relations.id, relations.version, relations.user_id, ' +
            'relations.tstamp, relations.changeset_id, hstore_to_array(relations.tags) AS tags, ' +
            'users.name AS user_name, relation_members.member_id, relation_members.member_type, ' +
            'relation_members.member_role, relation_members.sequence_id';
            
        var node_query1 = 'SELECT relation_members.member_id AS id' +
            ' FROM relations, relation_members' +
            ' WHERE relations.id = relation_members.relation_id' +
            ' AND relation_members.member_type = \'N\'';
        var node_query2 = 'SELECT way_nodes.node_id AS id' +
            ' FROM relations, relation_members, way_nodes' +
            ' WHERE relations.id = relation_members.relation_id' +
            ' AND relation_members.member_type = \'W\'' +
            ' AND relation_members.member_id = way_nodes.way_id';
        var node_query3 = 'SELECT id FROM nodes';
        var node_query4 = 'SELECT way_nodes.node_id AS id' +
            ' FROM ways, way_nodes' +
            ' WHERE ways.id = way_nodes.way_id';
            
        var way_query1 = 'SELECT relation_members.member_id AS id' +
            ' FROM relations, relation_members' +
            ' WHERE relations.id = relation_members.relation_id' +
            ' AND relation_members.member_type = \'W\'';
        var way_query2 = 'SELECT id FROM ways';
            
        var relation_query1 = 'SELECT relation_members.member_id AS id' +
            ' FROM relations, relation_members' +
            ' WHERE relations.id = relation_members.relation_id' +
            ' AND relation_members.member_type = \'R\'';
        var relation_query2 = 'SELECT id FROM relations';
            
        var expected = {
            node: {
                      name: '',
                      text: 'SELECT ' + nodeColumns + ' FROM' +
                            ' nodes, users, (' + node_query1 + ' UNION ' + node_query2 + ' UNION ' + node_query3 + ' UNION ' + node_query4 + ') AS nodeIds' +
                            ' WHERE nodes.id = nodeIds.id' +
                            ' AND users.id = nodes.user_id;',
                      values: [],
                      binary: true
                  },
            way: {
                      name: '',
                      text: 'SELECT ' + wayColumns + ' FROM' +
                            ' ways, users, (' + way_query1 + ' UNION ' + way_query2 + ') AS wayIds' +
                            ' WHERE ways.id = wayIds.id' +
                            ' AND users.id = ways.user_id;',
                      values: [],
                      binary: true
                 },
            relation: {
                      name: '',
                      text: 'SELECT ' + relationColumns + ' FROM' +
                            ' relations, users, relation_members, (' + relation_query1 + ' UNION ' + relation_query2 + ') AS relationIds' +
                            ' WHERE relations.id = relationIds.id' +
                            ' AND users.id = relations.user_id' +
                            ' AND relations.id = relation_members.relation_id;',
                      values: [],
                      binary: true
                      }
        };
        var input = starQueryBuilder.createQueryPlan(sampleObjects['relation']);
        test.deepEqual(input, expected, '\texpected: ' + JSON.stringify(expected) + '\n\treturned: '+ JSON.stringify(input));
        test.finish();
    },
    '*[note=OstDeutschland]' : function(test) {

        var nodeColumns = 'nodes.id, nodes.version, nodes.user_id, nodes.tstamp, ' +
            'nodes.changeset_id, hstore_to_array(nodes.tags) ' +
            'AS tags, X(nodes.geom) AS lat, Y(nodes.geom) AS lon, users.name AS user_name';

        var wayColumns = 'ways.id, ways.version, ways.user_id, ways.tstamp, ways.changeset_id, ' +
            'hstore_to_array(ways.tags) AS tags, ways.nodes, users.name AS user_name';

        var relationColumns = 'relations.id, relations.version, relations.user_id, ' +
            'relations.tstamp, relations.changeset_id, hstore_to_array(relations.tags) AS tags, ' +
            'users.name AS user_name, relation_members.member_id, relation_members.member_type, ' +
            'relation_members.member_role, relation_members.sequence_id';
            
        var node_query1 = 'SELECT relation_members.member_id AS id' +
            ' FROM relations, relation_members' +
            ' WHERE relations.id = relation_members.relation_id' +
            ' AND relation_members.member_type = \'N\' AND (relations.tags @> hstore($1, $2))';
        var node_query2 = 'SELECT way_nodes.node_id AS id' +
            ' FROM relations, relation_members, way_nodes' +
            ' WHERE relations.id = relation_members.relation_id' +
            ' AND relation_members.member_type = \'W\'' +
            ' AND relation_members.member_id = way_nodes.way_id AND (relations.tags @> hstore($3, $4))';
        var node_query3 = 'SELECT id FROM nodes WHERE (nodes.tags @> hstore($5, $6))';
        var node_query4 = 'SELECT way_nodes.node_id AS id' +
            ' FROM ways, way_nodes' +
            ' WHERE ways.id = way_nodes.way_id AND (ways.tags @> hstore($7, $8))';
            
        var way_query1 = 'SELECT relation_members.member_id AS id' +
            ' FROM relations, relation_members' +
            ' WHERE relations.id = relation_members.relation_id' +
            ' AND relation_members.member_type = \'W\' AND (relations.tags @> hstore($1, $2))';
        var way_query2 = 'SELECT id FROM ways WHERE (ways.tags @> hstore($3, $4))';
            
        var relation_query1 = 'SELECT relation_members.member_id AS id' +
            ' FROM relations, relation_members' +
            ' WHERE relations.id = relation_members.relation_id' +
            ' AND relation_members.member_type = \'R\' AND (relations.tags @> hstore($1, $2))';
        var relation_query2 = 'SELECT id FROM relations WHERE (relations.tags @> hstore($3, $4))';

        var expected = {
            node: {
                      name: '',
                      text: 'SELECT ' + nodeColumns + ' FROM' +
                            ' nodes, users, (' + node_query1 + ' UNION ' + node_query2 + ' UNION ' + node_query3 + ' UNION ' + node_query4 + ') AS nodeIds' +
                            ' WHERE nodes.id = nodeIds.id' +
                            ' AND users.id = nodes.user_id;',
                      values: ['note','OstDeutschland','note','OstDeutschland','note','OstDeutschland','note','OstDeutschland'],
                      binary: true
                  },
            way: {
                      name: '',
                      text: 'SELECT ' + wayColumns + ' FROM' +
                              ' ways, users, (' + way_query1 + ' UNION ' + way_query2 + ') AS wayIds' +
                              ' WHERE ways.id = wayIds.id' +
                              ' AND users.id = ways.user_id;',
                      values: ['note','OstDeutschland','note','OstDeutschland'],
                      binary: true
                 },
            relation: {
                      name: '',
                      text: 'SELECT ' + relationColumns + ' FROM' +
                              ' relations, users, relation_members, (' + relation_query1 + ' UNION ' + relation_query2 + ') AS relationIds' +
                              ' WHERE relations.id = relationIds.id' +
                              ' AND users.id = relations.user_id' +
                              ' AND relations.id = relation_members.relation_id;',
                      values: ['note','OstDeutschland','note','OstDeutschland'],
                      binary: true
                      }
        };
        var input = starQueryBuilder.createQueryPlan(sampleObjects['relation[note=OstDeutschland]']);
        test.deepEqual(input, expected, '\texpected: ' + JSON.stringify(expected) + '\n\treturned: '+ JSON.stringify(input));
        test.finish();
    }
};

//make this test standalone
if (module == require.main) {
    require('coverage_testing').run(__filename, process.argv);
}

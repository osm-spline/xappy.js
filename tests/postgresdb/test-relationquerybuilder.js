var relationQueryBuilder = require('../../lib/postgresdb/relationquerybuilder');
var sampleObjects = require('../helpers/helper-samplexapirequestobjects');

var NODE_COLUMNS = require('./helper-common').NODE_COLUMNS;
var WAY_COLUMNS = require('./helper-common').WAY_COLUMNS;
var RELATION_COLUMNS = require('./helper-common').RELATION_COLUMNS;

module.exports = {
    'relation' : function(test) {

        var query1 = 'SELECT relation_members.member_id AS id FROM relations, relation_members' +
             ' WHERE relations.id = relation_members.relation_id' +
             ' AND relation_members.member_type = \'N\'';
        var query2 = 'SELECT way_nodes.node_id AS id FROM relations, relation_members, way_nodes' +
            ' WHERE relations.id = relation_members.relation_id' +
            ' AND relation_members.member_type = \'W\'' +
            ' AND relation_members.member_id = way_nodes.way_id';

        var union = '(' + query1 + ' UNION ' + query2 + ') AS nodeIds';
        var expected = {
            node: {
                      name: '',
                      text: 'SELECT ' + NODE_COLUMNS + ' FROM nodes, users, ' + union +
                            ' WHERE nodes.id = nodeIds.id AND users.id = nodes.user_id;',
                      values: [],
                      binary: true
                  },
            way: {
                      name: '',
                      text: 'SELECT DISTINCT ' + WAY_COLUMNS + ' FROM' +
                          ' relations, relation_members, ways, users' +
                          ' WHERE relations.id = relation_members.relation_id' +
                          ' AND relation_members.member_type = \'W\'' +
                          ' AND ways.id = relation_members.member_id' +
                          ' AND ways.user_id = users.id;',
                      values: [],
                      binary: true
                 },
            relation: {
                      name: '',
                      text: 'SELECT ' + RELATION_COLUMNS + ' FROM' +
                          ' relations, users, relation_members' +
                          ' WHERE relations.user_id = users.id' +
                          ' AND relations.id = relation_members.relation_id' +
                          ' ORDER BY relations.id;',
                      values: [],
                      binary: true
                      }
        };
        var input = relationQueryBuilder.createQueryPlan(sampleObjects['relation']);
        test.deepEqual(input, expected, '\texpected: ' + JSON.stringify(expected) + '\n\treturned: '+ JSON.stringify(input));
        test.finish();
    },
    'relation[note=OstDeutschland]' : function(test) {

        var query1 = 'SELECT relation_members.member_id AS id FROM relations, relation_members' +
             ' WHERE relations.id = relation_members.relation_id' +
             ' AND relation_members.member_type = \'N\'' +
             ' AND (relations.tags @> hstore($1, $2))';
        var query2 = 'SELECT way_nodes.node_id AS id FROM relations, relation_members, way_nodes' +
            ' WHERE relations.id = relation_members.relation_id' +
            ' AND relation_members.member_type = \'W\'' +
            ' AND relation_members.member_id = way_nodes.way_id' +
            ' AND (relations.tags @> hstore($1, $2))';

        var union = '(' + query1 + ' UNION ' + query2 + ') AS nodeIds';
        var expected = {
            node: {
                      name: '',
                      text: 'SELECT ' + NODE_COLUMNS + ' FROM nodes, users, ' + union +
                            ' WHERE nodes.id = nodeIds.id AND users.id = nodes.user_id;',
                      values: ['note','OstDeutschland'],
                      binary: true
                  },
            way: {
                      name: '',
                      text: 'SELECT DISTINCT ' + WAY_COLUMNS + ' FROM' +
                          ' relations, relation_members, ways, users' +
                          ' WHERE relations.id = relation_members.relation_id' +
                          ' AND relation_members.member_type = \'W\'' +
                          ' AND ways.id = relation_members.member_id' +
                          ' AND ways.user_id = users.id' +
                          ' AND (relations.tags @> hstore($1, $2));',
                      values: ['note','OstDeutschland'],
                      binary: true
                 },
            relation: {
                      name: '',
                      text: 'SELECT ' + RELATION_COLUMNS + ' FROM' +
                          ' relations, users, relation_members' +
                          ' WHERE relations.user_id = users.id' +
                          ' AND relations.id = relation_members.relation_id' +
                          ' AND (relations.tags @> hstore($1, $2))' +
                          ' ORDER BY relations.id;',
                      values: ['note','OstDeutschland'],
                      binary: true
                      }
        };
        var input = relationQueryBuilder.createQueryPlan(sampleObjects['relation[note=OstDeutschland]']);
        test.deepEqual(input, expected, '\texpected: ' + JSON.stringify(expected) + '\n\treturned: '+ JSON.stringify(input));
        test.finish();
    }
};

//make this test standalone
if (module == require.main) {
    require('coverage_testing').run(__filename, process.ARGV);
}

//make this test standalone
if (module == require.main) {
	require('coverage_testing').run(__filename, process.ARGV);
}

var queryBuilder = require('../../lib/postgresdb/querybuilder');
var sampleObjects = require('../helpers/helper-samplexapirequestobjects');
var sinon = require('sinon');

module.exports = {
    'create query for node' : function(test) {
        var nodeQueryBuilder = require('../../lib/postgresdb/nodequerybuilder');
        var spy = sinon.spy(nodeQueryBuilder,'createQueryPlan');
        queryBuilder.createQueryPlan(sampleObjects.node);
        test.ok(spy.called);
        test.finish();
    },
    'create query for way' : function(test) {
        var wayQueryBuilder = require('../../lib/postgresdb/wayquerybuilder');
        var spy = sinon.spy(wayQueryBuilder,'createQueryPlan');
        queryBuilder.createQueryPlan(sampleObjects.way);
        test.ok(spy.called);
        test.finish();
    },
    'create query for relation' : function(test) {
        var relationQueryBuilder = require('../../lib/postgresdb/relationquerybuilder');
        var spy = sinon.spy(relationQueryBuilder,'createQueryPlan');
        queryBuilder.createQueryPlan(sampleObjects.relation);
        test.ok(spy.called);
        test.finish();
    },
    'create query for *' : function(test) {
        var starQueryBuilder = require('../../lib/postgresdb/starquerybuilder');
        var spy = sinon.spy(starQueryBuilder,'createQueryPlan');
        queryBuilder.createQueryPlan(sampleObjects['*']);
        test.ok(spy.called);
        test.finish();
    }
};

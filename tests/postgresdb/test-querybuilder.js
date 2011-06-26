//make this test standalone
if (module == require.main) {
	require('xappy-async_testing').run(__filename, process.ARGV);
}

var queryBuilder = require('../../lib/postgresdb/querybuilder');
var sampleObjects = require('../helpers/helper-samplexapirequestobjects');
var sinon = require('sinon');

module.exports = {
    'create query for node' : function(test) {
        var nodeQueryBuilder = require('../../lib/postgresdb/nodequerybuilder');
        var spy = sinon.spy(nodeQueryBuilder,'createQueryPlan');
        queryBuilder.createQueryPlan(sampleObjects['node']);
        test.ok(spy.called);
        test.finish();
    },
    'create query for way' : function(test) {
        var wayQueryBuilder = require('../../lib/postgresdb/wayquerybuilder');
        var spy = sinon.spy(wayQueryBuilder,'createQueryPlan');
        queryBuilder.createQueryPlan(sampleObjects['way']);
        test.ok(spy.called);
        test.finish();
    }
};

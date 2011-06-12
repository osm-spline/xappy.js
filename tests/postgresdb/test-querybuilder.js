//make this test standalone
if (module == require.main) {
	require('async_testing').run(__filename, process.ARGV);
}

var queryBuilder = require('../../lib/postgresdb/querybuilder');
var sampleObjects = require('../helpers/helper-samplexapirequestobjects');
var sinon = require('sinon');

module.exports = {
    'create query for node' : function(test) {
        queryBuilder.createQueryPlan()         
        test.finish();
    }
};

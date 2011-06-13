var _ = require('underscore');
var sampleObjects = require('../helpers/helper-samplexapirequestobjects');
var xapiRequestTester = require('../helpers/helper-xapi-request.js');

var queryBuilder = require('../../lib/postgresdb/querybuilder');

var pg = require('pg');

var executeQuery = function(statement, callback) {
	var client = new pg.Client({
		user : 'xapi',
		password : '***',
		database : 'xapi_petra', //datenbank name
		host : 'db.osm.spline.de' //server dns
	});

	client.connect();
    //console.log("Executing query:\n" + statement);
    client.query(statement, function(error, result){
        if(error) {
            callback(error, null);
        } else {
            callback(null, result);
        }
		client.end();
    });

};


module.exports = {
    'testSqlQueries on real database' : function(test) {
        _.each(sampleObjects, function(sampleObject) {
            //console.log(sampleObject);
            //xapiRequestTester.test_xapi_request(test, sampleObject);
            if (sampleObject.object === 'node') {
                var queryPlan = queryBuilder.createQueryPlan(sampleObject);
                //iterate over subQueries of queryPlan
                _.each(queryPlan, function(query){
                    executeQuery(query, function(error, result) {
                        if(error) {
                            console.log("Error executing: (" + JSON.stringify(sampleObject) + ")\n" + JSON.stringify(query));
                            //error in subQuery
                            console.log(error);
                        } else {
                            console.log("SubQuery successful");
                            //console.log(result);
                        }
                    });
                });
            }
        });
        test.finish();
    }
};

//make this test standalone
if (module == require.main) {
	require('async_testing').run(__filename, process.ARGV);
}

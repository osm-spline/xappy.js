var _ = require('underscore');
var sampleObjects = require('../helpers/helper-samplexapirequestobjects');
var sampleDBRowObjects = require('../helpers/helper-sample-db-row-objects');
var xapiRequestTester = require('../helpers/helper-xapi-request');

var queryBuilder = require('../../lib/postgresdb/querybuilder');

var pg = require('pg');

var executeQuery = function(statement, callback) {
    //console.log("CONNECTION: "+config.connectionString);
    
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

var compareRows = function(sampleObject, key, result) {
    //if(sampleDBRowObjects[sampleObject.name]) {
        //compare length
        if(result.rows.length != Object.keys(sampleDBRowObjects[key]).length) {
            //test false
            return false;
        }
        
        var length = result.rows.length;
        var row;
        var true_count = 0;
        
        for(var i = 0; i < length; i++) {
            row = result.rows[i];
            //console.log('ID: ' + row['id']);
            
            //TODO: compare more than IDs?
            for (var j = 0; j < length; j++) {
                if(row['id'] === sampleDBRowObjects[key][j]['id']) {
                    true_count++;
                    break;
                }
            }
        }
        
        if(true_count == length) {
            return true;
        } else {
            return false;
        }
    //}
}

module.exports = {
    'testSqlQueries on real database' : function(test) {
        var queryPlan;
        var row_equal;
        
        _.each(sampleObjects, function(sampleObject, key) {
            //console.log(sampleObject);
            //console.log('---');
            //xapiRequestTester.test_xapi_request(test, sampleObject);
            if (sampleObject.object === 'node') {
                queryPlan = queryBuilder.createQueryPlan(sampleObject);
                //iterate over subQueries of queryPlan
                _.each(queryPlan, function(query) {                    
                    executeQuery(query, function(error, result) {
                        console.log('Testing: ' + key);
                        
                        if(error) {
                            console.log("Error executing: (" + JSON.stringify(sampleObject) + ")\n" + JSON.stringify(query));
                            //error in subQuery
                            console.log(error);
                        } else {
                            //Compare retrieved rows
                            row_equal = compareRows(sampleObject, key, result);
                            //undefined == no expected object defined in helper-sample-db-row-objects.js
                            console.log('Rows equal? ' + row_equal);
                            //console.log("SubQuery successful");
                            //console.log(result);
                        }
                        
                        console.log('---');
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

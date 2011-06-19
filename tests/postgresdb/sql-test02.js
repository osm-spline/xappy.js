var _ = require('underscore');
var sampleObjects = require('../helpers/helper-samplexapirequestobjects');
var sampleDBRowObjects = require('../helpers/helper-sample-db-row-objects');
var xapiRequestTester = require('../helpers/helper-xapi-request');

var queryBuilder = require('../../lib/postgresdb/querybuilder');

var pg = require('pg');
var fs = require('fs');
var path = require('path');

var log4js = require('log4js')();
var log = log4js.getLogger('sql-test02');

var configPath = '../../etc/my-config.json';
var absConfPath = path.resolve(__dirname, configPath);
var config = JSON.parse(fs.readFileSync(absConfPath));
var connString = config.connectionString;

var executeQuery = function(statement, callback) {
    var conStrArray = connString.split('@');
    var password = conStrArray[0].split(':')[2];
     
	var client = new pg.Client({
	    user : 'xapi',
		password : password,
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
                var testType = sampleDBRowObjects[key][j]['type'];
                
                var rowType = "node";
                if(row['ways'] != null){
                    rowType = "relation";
                }
                else{
					if(row['nodes'] != null){
						rowType = "way";
					}
                }
                log.debug("testType = " + testType + ", rowType = "+ rowType);
                if(row['id'] === sampleDBRowObjects[key][j]['id'] && testType === rowType) {
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
        
        // (-3) for none-node objects
        test.numAssertions = Object.keys(sampleObjects).length - 3;
        var counter = 0;
        _.each(sampleObjects, function(sampleObject, key) {
            
            //console.log(sampleObject);
            //console.log('---');
            //xapiRequestTester.test_xapi_request(test, sampleObject);
            if (sampleObject.object === 'node' || sampleObject.object === 'way') {
                queryPlan = queryBuilder.createQueryPlan(sampleObject);
                //iterate over subQueries of queryPlan
                _.each(queryPlan, function(query) {
                     executeQuery(query, function(error, result) {
                        counter = counter + 1;
                        //console.log('Testing: ' + key);
                        log.debug('Testing: ' + key);
                        log.debug('QUERY: ' + query.text);
                        log.debug('VALUES: ' + JSON.stringify(query.values));
                        
                        if(error) {
                            console.log("Error executing: (" + JSON.stringify(sampleObject) + ")\n" + JSON.stringify(query));
                            row_equal = false;
                            //error in subQuery
                            console.log(error);
                        } else {
                            //Compare retrieved rows
                            row_equal = compareRows(sampleObject, key, result);
                            //undefined == no expected object defined in helper-sample-db-row-objects.js
                            //console.log('Rows equal? ' + row_equal);
                            log.debug('Rows equal? ' + row_equal);
                        }
                        
                        test.ok(row_equal);
                        //console.log('---');
                        log.debug('---');
                        
                        if(counter == test.numAssertions) {
                            test.finish();
                        }
                            
                    });
                });
            }
        });
        //test.finish();
    }
};

//make this test standalone
if (module == require.main) {
	require('async_testing').run(__filename, process.ARGV);
}

var _ = require('underscore');
var sampleObjects = require('./helper-samplexapirequestobjects');
var xapiRequestTester = require('./helper-xapi-request.js');

module.exports = {
     'testSampleXapiRequestObjects' : function(test) {
         _.each(sampleObjects, function(sampleObject) {
             //console.log(sampleObject);
             xapiRequestTester.test_xapi_request(test, sampleObject);
         });
         test.finish();
     }
};

if (module == require.main) {
    require('coverage_testing').run(__filename, process.argv);
}

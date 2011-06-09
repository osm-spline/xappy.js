var validator = require('../lib/validator');
var helperObj = require('./helpers/helper-xapi-request.js');

module.exports = {
    'validate correct simple object' : function(test){
        var xapiRequestInput = {
            object : 'node'
        };
        helperObj.test_xapi_request(test,xapiRequestInput);
        validator.validate(xapiRequestInput,function(error, xapiRequestOut){
                test.equal(error, null);
                test.deepEqual(xapiRequestInput,xapiRequestOut);
                test.finish();
        });

    }
};

if (module == require.main) {
  return require('async_testing').run(__filename, process.ARGV);
}



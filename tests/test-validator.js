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

    //'validate valid bbox' : function(test){
    //};

    /*
     'validate correct compound object'
     'validate bbox out of range'
     'validate bbox swapped values'
     'validate tag predicate with child predicate no(tags)'
     'validate tag predicate with child predicate tags'
     'validate node object with child predicate node or no(node)'
     'validate way object with child predicate way or no(way)'
     'validate way object with child predicate node or no(node)'
     */

};

if (module == require.main) {
  return require('async_testing').run(__filename, process.ARGV);
}



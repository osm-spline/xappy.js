var validator = require('../lib/validator');
//var helperObj = require('./helpers/helper-xapi-request.js');

module.exports = {
    'validate correct simple object' : function(test){
        var xapiRequestInput = {
            object : 'node'
        };

        validator.validate(xapiRequestInput,function(error, xapiRequestOut){
                test.equal(error, null);
                test.deepEqual(xapiRequestInput,xapiRequestOut);
                test.finish();
        });
    },

    'validate valid bbox' : function(test){
        var xapiRequestInput = {
            object : 'node',
            bbox : {
                left : 1.2345,
                right : 23.4565,
                top : 40.5679,
                bottom : -20.3424
            }
        };
        validator.validate(xapiRequestInput, function(error, xapiRequestOut){
                test.equal(error, null);
                test.deepEqual(xapiRequestInput,xapiRequestOut);
                test.finish();
        });
    },

    'validate correct compound object' : function(test){
        var xapiRequestInput = {
            object : 'node',
            bbox : {
                left : 1.2345,
                right : 23.4565,
                top : 40.5679,
                bottom : -20.3424
            },
            tag : {
                key : ['bla','blup'],
                value : ['petra']
            },
            child : {
                has : false,
                attribute : 'way'
            }
        };

        validator.validate(xapiRequestInput, function(error, xapiRequestOut){
                test.equal(error, null);
                test.deepEqual(xapiRequestInput,xapiRequestOut);
                test.finish();
        });
    },

    'validate bbox out of range' : function(test){
        var xapiRequestInput = {
            object : 'node',
            bbox : {
                left : 1.2345,
                right : 23.4565,
                top : 90.5679,
                bottom : -20.3424
            }
        };

        validator.validate(xapiRequestInput, function(error, xapiRequestOut){
                //what should be the format of an error: (code,message)?
                test.equal(error.code, 400);
                test.strictEqual(error.message, "Bbox out of range. Please input values for left and right [-180,180], for top and bottom [-90,90]");
                test.deepEqual(xapiRequestOut, null);
                test.finish();

        });
    },

    'validate bbox swapped values' : function(test){
        var xapiRequestInput = {
            object : 'node',
            bbox : {
                left : 123.456,
                right : 98.9842,
                top : -19.394,
                bottom : -87.59823
            }
        };

        validator.validate(xapiRequestInput, function(error,xapiRequestOut){
            test.equal(error.code, 400);
            test.strictEqual(error.message, "Bbox has swapped values. Please beware that left <= right and bottom <= top");
            test.deepEqual(xapiRequestOut, null);
            test.finish();
        });
    }
    /*

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



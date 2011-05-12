var assert = require('assert');
var async_testing = require('async_testing');

var knownDatatypes = {
    xapiRequest : {
        type : 'costum',
        members : {
            object : 'requestObject'
        } ,
        optionalMembers : {
            bbox : 'requestBbox',
            tag : 'requestTag'
        }
    },
    requestObject : {
        type : 'enum',
        values : [ 'node' , 'way', 'relation', '*' ]
    },
    requestBbox : {
        type : 'costum',
        members : {
            left : 'number',
            right : 'number',
            top : 'number',
            bottom : 'number'
        }
    },
    requestTag : {
        type : 'costum',
        members: {
            key : 'listString',
            value : 'listString'
        }
    },
    listString : {
        type : 'list',
        valueType : 'string'
    }

};



//export.checkQueryObject = function(obj){
//    checkCostumType(obj,'xapiRequest');
//}


// ################# fire and for get tests



var testObj = {
    object: "node",
    bbox : {
            left : 3.1,
            bottom: 4,
            right: 100,
            top: 50
    },
    tag: {
            key: [ "adsd" ],
            value: [ "asdas"]
    }
};


module.exports.test = function asyncTest(test){
    var checkType = function(obj,type){
        console.log(obj + " " + type);
        // handle built primitiv datatypes
        primitives = ['number','string'];
            if ( primitives[type] ) {
                test.ok(true);
            }

        // handle types from knownTypes array
        if ( type.type === 'list' ) {
            for ( element in obj ) {
                checkType(element,type.valueType);
            }
        }

        if ( type.type === 'enum' ) {
            checkEnumType(obj,type);
        }

        if ( type.type === 'costum' ) {
            checkCostumType(obj,type);
        }
    };

    var checkEnumType = function(obj,type) {

        for ( value in type.values ) {
            return;
        }

    };

    var checkCostumType = function(obj,type){

        var members = knownDatatypes[type].members;
        var optionalMembers = knownDatatypes[type].optionalMembers;

        for ( member in members ) {
            test.ok(obj.hasOwnProperty(member),'Object is missing non optional property ' + member);
            checkType(obj[member],members[member]);
        }

        for ( member in optionalMembers ) {
            if ( obj.hasOwnProperty(member) ) {
                checkType(obj[member],optionalMembers[member]);
            }
        }

        return true;
    };

    setTimeout(function() {
    // make an assertion (these are just regular Node assertions)
    checkType(testObj,'xapiRequest');
    // finish the test
    test.finish();
  },0.001);
};

async_testing.run(__filename, process.ARGV);

//console.log(checkCostumType(testObj,'xapiRequest'));

//var async_testing = require('async_testing');//to be commented out ...
var _ = require('underscore')._;

var knownDatatypes = {
    xapiRequest: {
	    members: {
	        object: ['node','way','relation','*']
    	},
	    optionalMembers: {
	        bbox: {
		        left: 'number',
		        right: 'number',
        		top: 'number',
		        bottom: 'number'
	        },
	        tag: {
		        key: ['string'],
        		value: ['string']
	        }
	    }
    }
}

/*
var testObj={
    object:'node',
    bbox:{
	left:12,
	rigth:16,
	top:40,
	bottom:23
    },
    tag:{
	key:['name'],
	value:['spline','cafete']
    }
}
*/

module.exports={
    'test_xapi_request_object': function(test,totest_xapi_request){
        test.ok(_.include (["node","way","relation","*"],totest_xapi_request.object,"Invalid format of the xapi request object"), "xapi request: invalid object");
	    //test.finish();//to be commented out ...
    },

    'test_xapi_request_bbox': function(test,totest_xapi_request){
        if (typeof totest_xapi_request.bbox!=='undefined'){
	        test.deepEqual(typeof totest_xapi_request.bbox.left,'number',"bbox.left is not a number");
            test.ok(totest_xapi_request.bbox.left >= -180, "xapi request bbox out of range");
            test.ok(totest_xapi_request.bbox.left <= 180, "xapi request bbox out of range");

	        test.deepEqual(typeof totest_xapi_request.bbox.right,'number',"bbox.right is not a number");
            test.ok(totest_xapi_request.bbox.right >= -180, "xapi request bbox out of range");
            test.ok(totest_xapi_request.bbox.right <= 180, "xapi request bbox out of range");

	        test.deepEqual(typeof totest_xapi_request.bbox.top,'number',"bbox.top is not a number");
            test.ok(totest_xapi_request.bbox.top >= -90, "xapi request bbox out of range");
            test.ok(totest_xapi_request.bbox.top <= 90, "xapi request bbox out of range");

	        test.deepEqual(typeof totest_xapi_request.bbox.bottom,'number',"bbox.bottom is not a number");
            test.ok(totest_xapi_request.bbox.bottom >= -90, "xapi request bbox out of range");
            test.ok(totest_xapi_request.bbox.bottom <= 90, "xapi request bbox out of range");

        };
//	test.finish();//to be commented out ..
    },

    'test_xapi_request_tag': function(test,totest_xapi_request){
	    if (typeof totest_xapi_request.tag!=='undefined'){
	        test.notDeepEqual(typeof totest_xapi_request.tag.key[0],'undefined',"The tag.key list has no elements");
	        test.notDeepEqual(typeof totest_xapi_request.tag.value[0],'undefined',"The tag.value list has no elements");

	        for (var i=0;i<totest_xapi_request.tag.key.length; i++){
		        test.deepEqual(typeof totest_xapi_request.tag.key[i],'string',"tag.key has invalid format");
		        test.notDeepEqual(totest_xapi_request.tag.key[i],"","tag.key has an empty string element");
	        }

            for (var i=0;i<totest_xapi_request.tag.value.length;i++){
		        test.deepEqual(typeof totest_xapi_request.tag.value[i],'string',"tag.value has invalid format");
		        test.notDeepEqual(totest_xapi_request.tag.value[i],"","tag.value has an empty string elem.");
	        }
	    };
//	test.finish();//to be commented out ..
    }
}

//async_testing.run(__filename,process.ARGV);

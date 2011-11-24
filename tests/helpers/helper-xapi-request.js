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
            },

            child: {
                has : 'boolean',
                attribute : ['node', 'way', 'relation', 'tag']
            }
        }
    }
};

module.exports={
    'test_xapi_request_object': function(test,totest_xapi_request){
        test.ok(_.include (["node","way","relation","*"],
			   totest_xapi_request.object,
			   "Invalid format of the xapi request object"),
		"xapi request: invalid object");
    },

    'test_xapi_request_bbox': function(test,totest_xapi_request){
        if (typeof totest_xapi_request.bbox!=='undefined'){
            test.deepEqual(typeof totest_xapi_request.bbox.left,
			   'number',
			   "bbox.left is not a number");
            test.ok(totest_xapi_request.bbox.left >= -180, "xapi request bbox out of range");
            test.ok(totest_xapi_request.bbox.left <= 180, "xapi request bbox out of range");

            test.deepEqual(typeof totest_xapi_request.bbox.right,
			   'number',
			   "bbox.right is not a number");
            test.ok(totest_xapi_request.bbox.right >= -180, "xapi request bbox out of range");
            test.ok(totest_xapi_request.bbox.right <= 180, "xapi request bbox out of range");

            test.deepEqual(typeof totest_xapi_request.bbox.top,'number',"bbox.top is not a number");
            test.ok(totest_xapi_request.bbox.top >= -90, "xapi request bbox out of range");
            test.ok(totest_xapi_request.bbox.top <= 90, "xapi request bbox out of range");

            test.deepEqual(typeof totest_xapi_request.bbox.bottom,
			   'number',
			   "bbox.bottom is not a number");
            test.ok(totest_xapi_request.bbox.bottom >= -90, "xapi request bbox out of range");
            test.ok(totest_xapi_request.bbox.bottom <= 90, "xapi request bbox out of range");

            //left must be on the left and top on the top
            test.ok(totest_xapi_request.bbox.left < totest_xapi_request.bbox.right,
		    "left and right of the bbox are swapped");
            test.ok(totest_xapi_request.bbox.bottom < totest_xapi_request.bbox.top,
		    "top and bottom of the bbox are swapped");
        }
    },

    'test_xapi_request_tag': function(test,totest_xapi_request){
        if (typeof totest_xapi_request.tag!=='undefined'){
            test.notDeepEqual(typeof totest_xapi_request.tag.key[0],
			      'undefined',
			      "The tag.key list has no elements");
            test.notDeepEqual(typeof totest_xapi_request.tag.value[0],
			      'undefined',
			      "The tag.value list has no elements");

            for (var i=0;i<totest_xapi_request.tag.key.length; i++){
                test.deepEqual(typeof totest_xapi_request.tag.key[i],
			       'string',
			       "tag.key has invalid format");
                test.notDeepEqual(totest_xapi_request.tag.key[i],"",
				  "tag.key has an empty string element");
            }

            for (i=0;i<totest_xapi_request.tag.value.length;i++){
                test.deepEqual(typeof totest_xapi_request.tag.value[i],
			       'string',
			       "tag.value has invalid format");
                test.notDeepEqual(totest_xapi_request.tag.value[i],
				  "",
				  "tag.value has an empty string elem.");
            }
        }
    },

    'test_xapi_request_child': function(test,totest_xapi_request){
        if(typeof totest_xapi_request.child !== 'undefined'){
            test.deepEqual(typeof totest_xapi_request.child.has,
			   'boolean',
			   "The function of the child predicate is not a boolean");
            test.ok(_.include (["node","way","relation","tag"],
			       totest_xapi_request.child.attribute),
		    "Invalid format of the xapi request child predicate");
            if(totest_xapi_request.object == 'node'){
                test.ok(totest_xapi_request.child.attribute !== 'node',
			"Child predicate of node cannot be a node");
            }

            if(totest_xapi_request.object == 'way'){
                test.ok(totest_xapi_request.child.attribute !== 'way',
			"Child predicate of way cannot be a way");
            }

            if(totest_xapi_request.child.attribute == 'tag'){
                test.deepEqual(totest_xapi_request.tag,
			       'undefined',
			       "Tag child predicate and tag predicate cannot exist simultaneously");
            }
        }
    },

    //calls all tests on xapi_request
    'test_xapi_request' : function(test,totest_xapi_request){
        this.test_xapi_request_object(test,totest_xapi_request);
        this.test_xapi_request_bbox(test,totest_xapi_request);
        this.test_xapi_request_tag(test,totest_xapi_request);
        this.test_xapi_request_child(test,totest_xapi_request);
    }

};



module.exports = {
    'validate' : function(xapiRequest,callback){
        var error = {
            code : null,
            message : null
        };

        var xapiRequestModified ={
            object : null,
            bbox : null,
            tag : null
        };

        if (xapiRequest.bbox !== undefined && (xapiRequest.bbox.left < -180 || xapiRequest.bbox.right > 180 || xapiRequest.bbox.top > 90 || xapiRequest.bbox.bottom < -90)){
            error.code = 400;
            error.message = "Bbox out of range. Please input values for left and right [-180,180], for top and bottom [-90,90]";
            callback(error,null);
            return;
        }

        if (xapiRequest.bbox !== undefined && (xapiRequest.bbox.left > xapiRequest.bbox.right || xapiRequest.bbox.top < xapiRequest.bbox.bottom)){
            error.code = 400;
            error.message = "Bbox has swapped values. Please beware that left <= right and bottom <= top";
            callback(error,null);
            return;
        }

        //HTTP 204 means "No content"; tag predicate with child predicate no(tags) returns no results
        if (xapiRequest.tag !== undefined && xapiRequest.child !== undefined && xapiRequest.child.attribute ==='tag' && xapiRequest.child.has === false){
            error.code = 204;
            callback(error,null);
            return;
        }

        //if tag and child predicate has(tags) - ignore child predicate, pass on the rest of the request
        if (xapiRequest.tag !== undefined && xapiRequest.child !== undefined && xapiRequest.child.attribute === 'tag' && xapiRequest.child.has === true){
            xapiRequestModified.object = xapiRequest.object;
            xapiRequestModified.bbox = xapiRequest.bbox;
            xapiRequestModified.tag = xapiRequest.tag;
            callback(null,xapiRequestModified);
            return;
        }

        //node object with child predicate attribute node - ignore child predicate
        if (xapiRequest.object === 'node' && xapiRequest.child !== undefined && xapiRequest.child.attribute === 'node'){
            xapiRequestModified.object = xapiRequest.object;
            xapiRequestModified.bbox = xapiRequest.bbox;
            xapiRequestModified.tag = xapiRequest.tag;
            callback(null,xapiRequestModified);
            return;
        }

        else{
            callback(null,xapiRequest);
        }
    }


};

module.exports = {
    'validate' : function(xapiRequest,callback){
        var error = {
            code : null,
            message : null
        };

        if (xapiRequest.bbox !== undefined && (xapiRequest.bbox.left < -180 || xapiRequest.bbox.right > 180 || xapiRequest.bbox.top > 90 || xapiRequest.bbox.bottom < -90)){
            error.code = 400;
            error.message = "Bbox out of range. Please input values for left and right [-180,180], for top and bottom [-90,90]";
            callback(error,null);
        }

        if (xapiRequest.bbox !== undefined && (xapiRequest.bbox.left > xapiRequest.bbox.right || xapiRequest.bbox.top < xapiRequest.bbox.bottom)){
            error.code = 400;
            error.message = "Bbox has swapped values. Please beware that left <= right and bottom <= top";
            callback(error,null);
        }

        else{
            callback(null,xapiRequest);
        }
    }


};

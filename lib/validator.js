module.exports = {
    'validate' : function(xapiRequest,callback){
        if (xapiRequest.bbox !== undefined && (xapiRequest.bbox.left < -180 || xapiRequest.bbox.right > 180 || xapiRequest.bbox.top > 90 || xapiRequest.bbox.bottom < -90)){
            var error = {
                code : 400,
                message : "Bbox out of range. Please input values for left and right [-180,180], for top and bottom [-90,90]"
            };
            callback(error,null);
        }
        else{
            callback(null,xapiRequest);
        }
    }


};

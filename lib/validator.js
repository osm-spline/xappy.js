var log = require('log4js')().getLogger('validator');

module.exports = {
    'validate' : function (xapiRequest, callback) {
        var error = {
            code : null,
            message : null
        };

        var xapiRequestModified = {
            object : null,
            bbox : null,
            tag : null
        };

        //catch bbox out of range
        if (xapiRequest.bbox &&
                (xapiRequest.bbox.left < -180 ||
                xapiRequest.bbox.right > 180 ||
                xapiRequest.bbox.top > 90 ||
                xapiRequest.bbox.bottom < -90)) {
            error.code = 400;
            error.message = 'Bbox out of range. Please input values for left' +
                ' and right [-180,180], for top and bottom [-90,90]';
            //log.error('Error validating request', error);
            callback(error, null);
            return;
        }

        //catch bbox where left and right or top and bottom are swapped
        if (xapiRequest.bbox &&
                (xapiRequest.bbox.left > xapiRequest.bbox.right ||
                xapiRequest.bbox.top < xapiRequest.bbox.bottom)) {
            error.code = 400;
            error.message = 'Bbox has swapped values. Please beware that left' +
                ' <= right and bottom <= top';
            //log.error('Error validating request', error);
            callback(error, null);
            return;
        }

        //catch tag predicate with child predicate no(tags)
        //HTTP 204 means 'No content';
        //tag predicate with child predicate no(tags) returns no results
        if (xapiRequest.tag &&
                xapiRequest.child &&
                xapiRequest.child.attribute ==='tag' &&
                xapiRequest.child.has === false) {
            error.code = 204;
            error.message = 'Request has a tag predicate and a' +
                ' child predicate no(tags)';
            //log.warn('Warning: validating request returns an empty string', error);
            callback(error, null);
            return;
        }

        //if tag and child predicate has(tags) - ignore child predicate,
        //pass on the rest of the request
        if (xapiRequest.tag &&
                xapiRequest.child &&
                xapiRequest.child.attribute === 'tag' &&
                xapiRequest.child.has === true) {
            xapiRequestModified.object = xapiRequest.object;
            xapiRequestModified.bbox = xapiRequest.bbox;
            xapiRequestModified.tag = xapiRequest.tag;
            callback(null, xapiRequestModified);
            return;
        }

        //node object with child predicate attribute node - return empty object
        if (xapiRequest.object === 'node' &&
                xapiRequest.child &&
                xapiRequest.child.attribute === 'node') {
            error.code = 204;
            error.message = 'Request object and child predicate attribute are both node';
            //log.warn('Warning: validating request returns an empty string', error);
            callback(error, null);
            return;
        }

        //way object with child predicate attribute way - return empty object
        if (xapiRequest.object === 'way' &&
                xapiRequest.child &&
                xapiRequest.child.attribute === 'way') {
            error.code = 204;
            error.message = 'Request object and child predicate attribute are both way';
            //log.warn('Warning: validating request returns an empty string', error);
            callback(error, null);
            return;
        }

        //way object and child predicate attribute node - ignore child predicate,
        //pass on the rest of the request
        //according to specification ways have at least 2 and at most 2000 nodes
        if (xapiRequest.object === 'way' &&
                xapiRequest.child &&
                xapiRequest.child.attribute === 'node') {
            xapiRequestModified.object = xapiRequest.object;
            xapiRequestModified.bbox = xapiRequest.bbox;
            xapiRequestModified.tag = xapiRequest.tag;
            callback(null, xapiRequestModified);
            return;
        //all other cases are valid, pass on xapiRequest to the database module
        } else {
            callback(null, xapiRequest);
        }
    }
};

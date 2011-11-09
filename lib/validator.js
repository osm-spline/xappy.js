var log = require('log4js').getLogger('validator');
var _ = require('underscore')._;

function validate(request, callback) {
    var error = null;
    if (isOutOfRangeBbox(request)) {
        error = createError(400, outOfRangeMsg);
    } else if (isSwaped(request)) {
        error = createError(400, isSwapedMsg);
    } else if (tagContradiction(request)) {
        error = createError(204, hasTagWithNoTag);
    } else if (nodesWithNodesAsChilds(request)) {
        error = createError(204, nodesWithNodesChildsMsg);
    } else if (wayWithChildPredicateWay(request)) {
        error = createError(204, wayWithChildPredicateWayMsg);
    }
    var result = error? null : simplify(request);

    callback(error, result);
}

function isOutOfRangeBbox(request) {
    var bbox = request.bbox;
    return bbox && (bbox.left < -180 || bbox.right > 180
                    || bbox.top > 90 || bbox.bottom < -90);
}

function isSwaped(request) {
    var bbox = request.bbox;
    return bbox && (bbox.left > bbox.right || bbox.top < bbox.bottom);
}

// this searches for something with a specific tag but excludes
// everything that has a tag. the result is always empty
function tagContradiction(request) {
    var child = request.child;
    return request.tag && child && child.attribute ==='tag' && child.has === false
}

// nodes cant have nodes as children
function nodesWithNodesAsChilds(request) {
    var child = request.child;
    return request.object === 'node' && child &&
        child.attribute === 'node';
}

// a way cant have ways as a child predicate (only nodes)
function wayWithChildPredicateWay(request) {
    var child = request.child;
    return request.object === 'way' && child && child.attribute === 'way'
}

function wayWithNodeChilds(request) {
    var child = request.child;
    return request.object === 'way' && child && child.attribute === 'node';
}

function hasTags(request) {
    var child = request.child;
    return request.tag && child && child.attribute === 'tag' && child.has === true
}

var wayWithChildPredicateWayMsg = 'Request object and child predicate attribute are both way';
var outOfRangeMsg = 'Bbox out of range. Please input values for left and right [-180,180], for top and bottom [-90,90]';
var isSwapedMsg = 'Bbox has swapped values. Please beware that left <= right and bottom <= top';
var hasTagWithNoTag = 'Request has a tag predicate and a child predicate no(tags)';
var nodesWithNodesChildsMsg = 'Request object and child predicate attribute are both node';

function simplify(request) {
    var modifiedRequest = _.clone(request);
    //if tag and child predicate has(tags) - ignore child predicate,
    //pass on the rest of the request
    if (hasTags(request)) {
        delete modifiedRequest.child
    }
    //way object and child predicate attribute node - ignore child predicate,
    //pass on the rest of the request
    //according to specification ways have at least 2 and at most 2000 nodes
    if (wayWithNodeChilds(request)) {
        delete modifiedRequest.child
    }
    return modifiedRequest;
}

function createError(code, message) {
    return {code: code, message: message};
}

exports.validate = validate;

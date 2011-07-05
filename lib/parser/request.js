/* wrapper around path-parser. does some pre- and post-processing:
 *
 * - decodes the request url
 * - TODO strips the url prefix
 * - TODO deals with the version number
 * - TODO logs errors
 * - constructs a valid XapiRequest object from the parser output
 */

var underscore = require('underscore');

var parser = require('./path');
var generic = require('./generic');

/* constructs XapiRequest from the parser output.
 * the parser accepts an arbitrary list of predicates.
 * an XapiRequest however contains at most one tag and one bbox.
 * therefore, only the first tag and bbox returned by the parser are chosen.
 */
function xapiRequest(parsed) {
    var bbox = probeFirst(parsed.predicates, 'left');
    var tag = probeFirst(parsed.predicates, 'key');
    var child = probeFirst(parsed.predicates, 'child');

    var request = {
        object: parsed.object
    };
    if (bbox !== undefined) {
        request.bbox = bbox;
    }
    if (tag !== undefined) {
        request.tag = tag;
    }
    if (child !== undefined) {
        request.child = makeChildPredicate(child);
    }

    return request;
}

// helpers
// -------

// find the first array element, which has a certain attribute set
function probeFirst(array, attribute) {
    var probe = function (object) {
        return object[attribute] !== undefined;
    };
    return underscore.detect(array, probe);
}

function makeChildPredicate(child) {
    return {
        has: has(child.child), attribute: attribute(child.child)
    };
}

function has(word) {
    return !startsWith(word, 'not(');
}

function startsWith(string, prefix) {
    return string.indexOf(prefix) === 0;
}

function attribute(word) {
    var normalized = has(word) ? word : word.slice(4, -1);
    if (normalized === 'nd') {
        return 'node';
    }
    return normalized;
}

// public interface
// ----------------

function parseSync(expr) {
    var genericParser = generic.GenericParser(decodeURI(expr));
    var p = parser.Parser(genericParser);
    return xapiRequest(p.xpath());
}

// returns XapiRequest parsed from `expr`
function parse(expr, callback) {
    var error = null;
    var result = null;
    try {
        result = parseSync(expr);
    } catch (er) {
        error = er;
    }
    callback(error, result);
}

if (typeof module === 'object' && typeof require === 'function') {
    exports.parseSync = parseSync;
    exports.parse = parse;
    exports.xapiRequest = xapiRequest;
}

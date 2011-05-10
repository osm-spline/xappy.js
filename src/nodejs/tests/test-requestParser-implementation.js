var parser = require('../requestParser');

// example data
// ------------

var BBOX_EXPR = 'bbox=0.111,0.222,0.333,0.444';
var BBOX_EXPECTED = {
    left: 0.111,
    bottom: 0.222,
    right: 0.333,
    top: 0.444
};
var TAG_EXPR = 'amenity|leisure|fun=golf_course|tennis_court|pool';
var TAG_EXPECTED = {
    key: ['amenity', 'leisure', 'fun'],
    value: ['golf_course', 'tennis_court', 'pool']
};

var PREDICATES_EXPR = '[' + TAG_EXPR + '][' + BBOX_EXPR + '][' + TAG_EXPR + ']';
var PREDICATES_EXPECTED = [TAG_EXPECTED, BBOX_EXPECTED, TAG_EXPECTED];

var XPATH_EXPR = '/node' + PREDICATES_EXPR;
var XPATH_EXPECTED = {
    object: 'node',
    predicates: PREDICATES_EXPECTED
};

var XAPI_REQUEST_EXPECTED = {
    object: 'node',
    bbox: BBOX_EXPECTED,
    tag: TAG_EXPECTED
};

// tests
// -----

module.exports = {
    '"get"': function(test) {
        var p = parser.Parser('abc');
        test.equal('a', p.get());
        p.advance();
        test.equal('b', p.get());
        p.advance();
        test.equal('c', p.get());
        test.finish();
    },

    '"expect" with single char': function(test) {
        var p = parser.Parser('abc');
        p.expect('a');
        test.finish();
    },

    '"expect" with multiple chars': function(test) {
        var p = parser.Parser('abc');
        p.expect('abc');
        test.finish();
    },

    '"expect" fails for unexpected char': function(test) {
        var p = parser.Parser('abc');
        test.throws(function() {
            p.expect('b');
        });
        test.finish();
    },

    '"word" ends on separator': function(test) {
        var p = parser.Parser('abc,def');
        test.equal(p.word(), 'abc');
        test.finish();
    },

    '"word" ends on expression end': function(test) {
        var p = parser.Parser('abc');
        test.equal(p.word(), 'abc');
        test.finish();
    },

    '"word" fails for empty word': function(test) {
        var p = parser.Parser(',def');
        test.throws(function() {
            p.word();
        });
        test.finish();
    },

    '"delimited" with single word': function(test) {
        var p = parser.Parser('abc');
        test.deepEqual(p.delimited(), ['abc']);
        test.finish();
    },

    '"delimited" with multiple words': function(test) {
        var p = parser.Parser('abc|def|ghi');
        test.deepEqual(p.delimited(), ['abc', 'def', 'ghi']);
        test.finish();
    },

    '"tagPredicate"': function(test) {
        var p = parser.Parser(TAG_EXPR);
        test.deepEqual(p.tagPredicate(), TAG_EXPECTED);
        test.finish();
    },

    '"bboxPredicate"': function(test) {
        var p = parser.Parser(BBOX_EXPR);
        test.deepEqual(p.bboxPredicate(), BBOX_EXPECTED);
        test.finish();
    },

    '"object" succeeds for known object': function(test) {
        var expr = 'way';
        var p = parser.Parser(expr);
        test.equal(p.object(), 'way');
        test.finish();
    },

    '"object" fails for unknown object': function(test) {
        var p = parser.Parser('foo');
        test.throws(function() {
            p.object();
        });
        test.finish();
    },

    '"predicate" succeeds for bbox': function(test) {
        var p = parser.Parser(BBOX_EXPR);
        test.deepEqual(p.predicate(), BBOX_EXPECTED);
        test.finish();
    },

    '"predicate" succeeds for tag': function(test) {
        var p = parser.Parser(TAG_EXPR);
        test.deepEqual(p.predicate(), TAG_EXPECTED);
        test.finish();
    },

    'three "predicates"': function(test) {
        var p = parser.Parser(PREDICATES_EXPR);
        test.deepEqual(p.predicates(), PREDICATES_EXPECTED);
        test.finish();
    },

    '"xpath"': function(test) {
        var p = parser.Parser(XPATH_EXPR);
        test.deepEqual(p.xpath(), XPATH_EXPECTED);
        test.finish();
    },

    'parsing empty expression fails': function(test) {
        var p = parser.Parser('');
        test.throws(function() {
            p.xpath();
        });
        test.finish();
    },

    '"xapiRequest" only selects one bbox and one tag': function(test) {
        test.deepEqual(parser.xapiRequest(XPATH_EXPECTED), XAPI_REQUEST_EXPECTED);
        test.finish();
    },

    '"parse"': function(test) {
        test.deepEqual(parser.parse(XPATH_EXPR), XAPI_REQUEST_EXPECTED);
        test.finish();
    },

};

if (module === require.main) {
    require('async_testing').run(__filename, process.ARGV);
}

var underscore = require('underscore');

var parser = require('../../lib/parser/path');
var generic = require('../../lib/parser/generic');

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

var makeParser = function(expr) {
    return parser.Parser(generic.GenericParser(expr));
};

// tests
// -----

module.exports = {
    '"word" ends on separator': function(test) {
        var p = makeParser('abc,def');
        test.equal(p.word(), 'abc');
        test.finish();
    },

    '"word" ends on expression end': function(test) {
        var p = makeParser('abc');
        test.equal(p.word(), 'abc');
        test.finish();
    },

    '"word" fails for empty word': function(test) {
        var p = makeParser(',def');
        test.throws(function() {
            p.word();
        });
        test.finish();
    },

    '"delimited" with single word': function(test) {
        var p = makeParser('abc');
        test.deepEqual(p.delimited(), ['abc']);
        test.finish();
    },

    '"delimited" with multiple words': function(test) {
        var p = makeParser('abc|def|ghi');
        test.deepEqual(p.delimited(), ['abc', 'def', 'ghi']);
        test.finish();
    },

    '"tagPredicate"': function(test) {
        var p = makeParser(TAG_EXPR);
        test.deepEqual(p.tagPredicate(), TAG_EXPECTED);
        test.finish();
    },

    '"bboxPredicate"': function(test) {
        var p = makeParser(BBOX_EXPR);
        test.deepEqual(p.bboxPredicate(), BBOX_EXPECTED);
        test.finish();
    },

    '"childPredicate" succeeds for child predicate': function(test) {
        var p = makeParser('not(nd)');
        test.deepEqual(p.childPredicate(), {child: 'not(nd)'});
        test.finish();
    },

    '"childPredidcate" fails for non child predicate': function(test) {
        var p = makeParser('foo');
        test.throws(function() {
            p.childPredicate();
        });
        test.finish();
    },

    '"object" succeeds for known object': function(test) {
        var expr = 'way';
        var p = makeParser(expr);
        test.equal(p.object(), 'way');
        test.finish();
    },

    '"object" fails for unknown object': function(test) {
        var p = makeParser('foo');
        test.throws(function() {
            p.object();
        });
        test.finish();
    },

    '"predicate" succeeds for bbox': function(test) {
        var p = makeParser(BBOX_EXPR);
        test.deepEqual(p.predicate(), BBOX_EXPECTED);
        test.finish();
    },

    '"predicate" succeeds for tag': function(test) {
        var p = makeParser(TAG_EXPR);
        test.deepEqual(p.predicate(), TAG_EXPECTED);
        test.finish();
    },

    'three "predicates"': function(test) {
        var p = makeParser(PREDICATES_EXPR);
        test.deepEqual(p.predicates(), PREDICATES_EXPECTED);
        test.finish();
    },

    '"xpath"': function(test) {
        var p = makeParser(XPATH_EXPR);
        test.deepEqual(p.xpath(), XPATH_EXPECTED);
        test.finish();
    },

    'parsing empty expression fails': function(test) {
        var p = makeParser('');
        test.throws(function() {
            p.xpath();
        });
        test.finish();
    },

    'tag predicates can be escaped by prefixing with backslash': function(test) {
        var p1 = makeParser('route=46\\|46A');
        test.deepEqual(p1.tagPredicate(), {key: ['route'], value: ['46|46A']});
        var p2 = makeParser('foo\\|bar\\|baz=blub');
        test.deepEqual(p2.tagPredicate(), {key: ['foo|bar|baz'], value: ['blub']});
        test.finish();
    }
};

if (module === require.main) {
    require('async_testing').run(__filename, process.argv);
}

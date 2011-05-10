var parser = require('../requestParser');

// example data
// ------------

var BBOX_EXPR = 'bbox=0.111,0.222,0.333,0.444';
var BBOX_EXPECTED = {
    type: 'bbox',
    left: 0.111,
    bottom: 0.222,
    right: 0.333,
    top: 0.444
};
var TAGS_EXPR = 'amenity|leisure|fun=golf_course|tennis_court|pool';
var TAGS_EXPECTED = {
    type: 'selection',
    tags: ['amenity', 'leisure', 'fun'],
    values: ['golf_course', 'tennis_court', 'pool']
};

var PREDICATES_EXPR = '[' + TAGS_EXPR + '][' + BBOX_EXPR + '][' + TAGS_EXPR + ']';
var PREDICATES_EXPECTED = [TAGS_EXPECTED, BBOX_EXPECTED, TAGS_EXPECTED];

var XPATH_EXPR = '/node' + PREDICATES_EXPR;
var XPATH_EXPECTED = {
    object: 'node',
    predicates: PREDICATES_EXPECTED
};

var XAPI_REQUEST_EXPECTED = {
    object: 'node',
    bbox: {
        left: 0.111,
        bottom: 0.222,
        right: 0.333,
        top: 0.444
    },
    tag: {
        key: ['amenity', 'leisure', 'fun'],
        value: ['golf_course', 'tennis_court', 'pool']
    }
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

    '"selectionPredicate"': function(test) {
        var p = parser.Parser(TAGS_EXPR);
        test.deepEqual(p.selectionPredicate(), TAGS_EXPECTED);
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

    '"predicate" succeeds for tags': function(test) {
        var p = parser.Parser(TAGS_EXPR);
        test.deepEqual(p.predicate(), TAGS_EXPECTED);
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

    '"xapiRequest" only selects one bbox and one tag': function(test) {
        test.deepEqual(parser.xapiRequest(XPATH_EXPECTED), XAPI_REQUEST_EXPECTED);
        test.finish();
    },

    '"parse"': function(test) {
        test.deepEqual(parser.parse(XPATH_EXPR), XAPI_REQUEST_EXPECTED);
        test.finish();
    },

    'parsing empty expression fails': function(test) {
        var p = parser.Parser('');
        test.throws(function() {
            p.xpath();
        });
        test.finish();
    },

    // test all simple objects { node, way, relation }

    'parse simple node string': function(test) {
        test.deepEqual(parser.parse('/node'), {object: 'node'});
        test.finish();
    },

    'parse simple node string with trailing slash': function(test) {
        test.deepEqual(parser.parse('/node/'), {object: 'node'});
        test.finish();
    },

    'parse simple way string': function(test) {
        debugger;
        var x = parser.parse('/way');
        test.deepEqual(x, { object: 'way' });
        test.finish();
    },

    'parse simple way string with trailing slash': function(test) {
        test.deepEqual(parser.parse('/way/'), { object: 'way' });
        test.finish();
    },

    'parse simple relation string': function(test) {
        test.deepEqual(parser.parse('/relation'), { object: 'relation' });
        test.finish();
    },

    'parse simple relation string with trailing slash': function(test) {
        test.deepEqual(parser.parse('/relation/'), { object: 'relation' });
        test.finish();
    },

    // TODO invalid object eg not (node, way, relation)

    'parse node with bbox': function(test) {
        test.deepEqual(parser.parse('/node[bbox=0,51.5,0.25,51.75]'),
                       { object: 'node', bbox: {left:0, bottom:51.5, right:0.25, top:51.75} });
        test.finish();
    },

    'parse node with simple tag': function(test) {
        test.deepEqual(parser.parse('/node[key=value]'),
                       { object: 'node', tag: {key: ['key'], value: ['value']} });
        test.finish();
    },

    'parse node with tag with two values': function(test) {
        test.deepEqual(parser.parse('/node[key=foo|bar]'),
                       { object: 'node', tag: {key: ['key'], value: ['foo', 'bar']} });
        test.finish();
    },

    'parse node with tag with two keys': function(test) {
        test.deepEqual(parser.parse('/node[foo|bar=value]'),
                       { object: 'node', tag: {key: ['foo', 'bar'], value: ['value']} });
        test.finish();
    },

    'parse node with tag with cross product': function(test) {
        test.deepEqual(parser.parse('/node[key1|key2=value1|value2]'),
                       { object: 'node', tag: {key: ['key1', 'key2'], value: ['value1', 'value2']} });
        test.finish();
    },

    'parse node with bbox and simple tag': function(test) {
        test.deepEqual(parser.parse('/node[bbox=0,0,0,0][key=value]'),
                       { object: 'node',
                         bbox: {left:0,bottom:0,right:0,top:0},
                         tag: {key: ['key'], value: ['value']} });
        test.finish();
    }
};

if (module === require.main) {
    require('async_testing').run(__filename, process.ARGV);
}

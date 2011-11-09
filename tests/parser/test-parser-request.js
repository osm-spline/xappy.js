var underscore = require('underscore');

var parser = require('../../lib/parser/request');

var CHILD_PREDICATE_TO_EXPECTED = {
    'nd':               {has: true,     attribute: 'node'},
    'not(nd)':          {has: false,    attribute: 'node'},
    'tag':              {has: true,     attribute: 'tag'},
    'not(tag)':         {has: false,    attribute: 'tag'},
    'way':              {has: true,     attribute: 'way'},
    'not(way)':         {has: false,    attribute: 'way'},
    'node':             {has: true,     attribute: 'node'},
    'not(node)':        {has: false,    attribute: 'node'},
    'relation':         {has: true,     attribute: 'relation'},
    'not(relation)':    {has: false,    attribute: 'relation'}
};

module.exports = {
    '/node': function(test) {
        test.deepEqual(parser.parseSync('/node'), {object: 'node'});
        test.finish();
    },

    '/way': function(test) {
        var x = parser.parseSync('/way');
        test.deepEqual(x, { object: 'way' });
        test.finish();
    },

    '/relation': function(test) {
        test.deepEqual(parser.parseSync('/relation'), { object: 'relation' });
        test.finish();
    },

    '/node[bbox=0,51.5,0.25,51.75]': function(test) {
        test.deepEqual(parser.parseSync('/node[bbox=0,51.5,0.25,51.75]'),
                       { object: 'node', bbox: {left:0, bottom:51.5, right:0.25, top:51.75} });
        test.finish();
    },

    '/node[key=value]': function(test) {
        test.deepEqual(parser.parseSync('/node[key=value]'),
                       { object: 'node', tag: {key: ['key'], value: ['value']} });
        test.finish();
    },

    '/node[key=foo|bar]': function(test) {
        test.deepEqual(parser.parseSync('/node[key=foo|bar]'),
                       { object: 'node', tag: {key: ['key'], value: ['foo', 'bar']} });
        test.finish();
    },

    '/node[foo|bar=value]': function(test) {
        test.deepEqual(parser.parseSync('/node[foo|bar=value]'),
                       { object: 'node', tag: {key: ['foo', 'bar'], value: ['value']} });
        test.finish();
    },

    '/node[key1|key2=value1|value2]': function(test) {
        test.deepEqual(parser.parseSync('/node[key1|key2=value1|value2]'),
                       { object: 'node', tag: {key: ['key1', 'key2'], value: ['value1', 'value2']} });
        test.finish();
    },

    '/node[bbox=0,0,0,0][key=value]': function(test) {
        test.deepEqual(parser.parseSync('/node[bbox=0,0,0,0][key=value]'),
                       { object: 'node',
                         bbox: {left:0,bottom:0,right:0,top:0},
                         tag: {key: ['key'], value: ['value']} });
        test.finish();
    },

    '/node[bbox=0,0,0,0][key=value][not(way)]': function(test) {
        test.deepEqual(parser.parseSync('/node[bbox=0,0,0,0][key=value][not(way)]'),
                       { object: 'node',
                         bbox: {left:0,bottom:0,right:0,top:0},
                         tag: {key: ['key'], value: ['value']},
                         child: {has: false, attribute: 'way'}});
        test.finish();
    },

    'all possible child predicates are parsed correctly': function(test) {
        underscore.each(CHILD_PREDICATE_TO_EXPECTED, function(expected, string) {
            test.deepEqual(parser.parseSync('/node[' + string + ']').child, expected);
        });

        test.finish();
    },

    'async: valid request, expect no error': function(test) {
        parser.parse('/node', function(error, data) {
            test.equal(null, error);
            test.ok(data);
            test.finish();
        });
    },

    'async: invalid request, expect error': function(test) {
        parser.parse('error', function(error, data) {
            test.ok(error);
            test.equal(null, data);
            test.finish();
        });
    }
};

if (module === require.main) {
    require('coverage_testing').run(__filename, process.argv);
}

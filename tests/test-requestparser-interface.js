var parser = require('../lib/requestparser');

module.exports = {
    'parse simple node string': function(test) {
        test.deepEqual(parser.parseSync('/node'), {object: 'node'});
        test.finish();
    },

    'parse simple way string': function(test) {
        var x = parser.parseSync('/way');
        test.deepEqual(x, { object: 'way' });
        test.finish();
    },

    'parse simple relation string': function(test) {
        test.deepEqual(parser.parseSync('/relation'), { object: 'relation' });
        test.finish();
    },

    'parse node with bbox': function(test) {
        test.deepEqual(parser.parseSync('/node[bbox=0,51.5,0.25,51.75]'),
                       { object: 'node', bbox: {left:0, bottom:51.5, right:0.25, top:51.75} });
        test.finish();
    },

    'parse node with simple tag': function(test) {
        test.deepEqual(parser.parseSync('/node[key=value]'),
                       { object: 'node', tag: {key: ['key'], value: ['value']} });
        test.finish();
    },

    'parse node with tag with two values': function(test) {
        test.deepEqual(parser.parseSync('/node[key=foo|bar]'),
                       { object: 'node', tag: {key: ['key'], value: ['foo', 'bar']} });
        test.finish();
    },

    'parse node with tag with two keys': function(test) {
        test.deepEqual(parser.parseSync('/node[foo|bar=value]'),
                       { object: 'node', tag: {key: ['foo', 'bar'], value: ['value']} });
        test.finish();
    },

    'parse node with tag with cross product': function(test) {
        test.deepEqual(parser.parseSync('/node[key1|key2=value1|value2]'),
                       { object: 'node', tag: {key: ['key1', 'key2'], value: ['value1', 'value2']} });
        test.finish();
    },

    'parse node with bbox and simple tag': function(test) {
        test.deepEqual(parser.parseSync('/node[bbox=0,0,0,0][key=value]'),
                       { object: 'node',
                         bbox: {left:0,bottom:0,right:0,top:0},
                         tag: {key: ['key'], value: ['value']} });
        test.finish();
    },

    'parse node with bbox, simple tag and child predicate': function(test) {
        test.deepEqual(parser.parseSync('/node[bbox=0,0,0,0][key=value][not(way)]'),
                       { object: 'node',
                         bbox: {left:0,bottom:0,right:0,top:0},
                         tag: {key: ['key'], value: ['value']},
                         child: {has: false, attribute: 'way'}});
        test.finish();
    }
};

if (module === require.main) {
    require('async_testing').run(__filename, process.ARGV);
}

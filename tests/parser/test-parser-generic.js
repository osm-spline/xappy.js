var parser = require('../../lib/parser/generic');

module.exports = {
    '"get"': function(test) {
        var p = parser.GenericParser('abc');
        test.equal('a', p.get());
        p.advance();
        test.equal('b', p.get());
        p.advance();
        test.equal('c', p.get());
        test.finish();
    },

    '"expect" with single char': function(test) {
        var p = parser.GenericParser('abc');
        p.expect('a');
        test.finish();
    },

    '"expect" with multiple chars': function(test) {
        var p = parser.GenericParser('abc');
        p.expect('abc');
        test.finish();
    },

    '"expect" fails for unexpected char': function(test) {
        var p = parser.GenericParser('abc');
        test.throws(function() {
            p.expect('b');
        });
        test.finish();
    },

    '"choice" fails for empty choices': function(test) {
        var p = parser.GenericParser('abc');
        test.throws(function() {
            p.choice([]);
        });
        test.finish();
    },

    '"choice" fails if all parsers fail': function(test) {
        var p = parser.GenericParser('abc');
        test.throws(function() {
            p.choice([
                function() { return p.expect('foo'); },
                function() { return p.expect('bar'); },
                function() { return p.expect('baz'); }
            ]);
        });
        test.finish();
    },

    '"choice" succeeds if one parser succeeds': function(test) {
        var p = parser.GenericParser('abc');
        p.choice([
            function() { return p.expect('foo'); },
            function() { return p.expect('abc'); },
            function() { return p.expect('baz'); }
        ]);
        test.finish();
    }
};

if (module === require.main) {
    require('coverage_testing').run(__filename, process.ARGV);
}

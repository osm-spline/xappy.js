/* simple recursive descent parser for the x-path like syntax used in xapi queries.
 *
 * parsers indicate failure by throwing an exception
 * 'xpath' is the top-level parsing function.
 * it parses an entire request and calls the necessary sub-parsers.
 *
 * depends on a GenericParser.
 *
 * do not use this module directly.
 * use the high level wrappers in RequestParser instead.
 */

var underscore = require('underscore');

var Parser = function (parser) {
    return {
        // each function has a comment that describes, what the function parses.
        // other parser functions are denoted by angle braces.

        // '/'<object><predicates>
        xpath: function() {
            parser.expect('/');
            return {
                object: this.object(),
                predicates: this.predicates()
            };
        },

        // '*' | 'way' | 'node' | 'relation'
        object: function() {
            var type = this.word();
            if (!underscore.include(['*', 'way', 'node', 'relation'], type)) {
                throw 'unknown object type "' + type + '" at ' + parser.offset;
            }
            return type;
        },

        // [ <predicate> ]
        predicates: function () {
            var out = [];
            while (parser.hasMore()) {
                parser.expect('[');
                out.push(this.predicate());
                parser.expect(']');
            }
            return out;
        },

        // <bboxPredicate> | <childPredicate> | <selectionPredicate>
        predicate: function () {
            // the following line is necessary, that the this object inside the
            // three predicate callbacks is always the right this.
            // TODO find a better way to do this
            underscore.bindAll(this);
            return parser.choice([
                this.bboxPredicate,
                this.tagPredicate,
                this.childPredicate
            ]);
        },

        // 'bbox='<float>','<float>','<float>','<float>
        bboxPredicate: function () {
            parser.expect('bbox=');
            var bbox = {};
            bbox.left = parseFloat(this.word());
            parser.expect(',');
            bbox.bottom = parseFloat(this.word());
            parser.expect(',');
            bbox.right = parseFloat(this.word());
            parser.expect(',');
            bbox.top = parseFloat(this.word());
            return bbox;
        },

        // 'nd' || 'not(nd)' || 'tag' || 'not(tag)' || 'way' || 'not(way)' ||
        // 'node' || 'not(node)' || 'relation' || 'not(relation)'
        childPredicate: function () {
            var valid = [
                'nd',
                'not(nd)',
                'tag',
                'not(tag)',
                'way',
                'not(way)',
                'node',
                'not(node)',
                'relation',
                'not(relation)'
            ];
            var word = this.word();

            if (!underscore.include(valid, word)) {
                throw {
                    name: 'parse error',
                    message: 'expected child predicate but was "' + word + '" at' +
                        parser.offset
                };
            }
            return {
                child: word
            };
        },

        // <delimited>'='<delimited>
        tagPredicate: function () {
            var tag = {};
            tag.key = this.delimited();
            parser.expect('=');
            tag.value = this.delimited();
            return tag;
        },

        // list of <word> delimited by '|' (at least one)
        delimited: function () {
            var out = [this.word()];
            while (!underscore.include('=]', parser.get()) && parser.hasMore()) {
                parser.expect('|');
                out.push(this.word());
            }
            return out;
        },

        // everything until one of ']|=,' (not prefixed by a backslash)
        word: function () {
            var out = '';
            var escapeMode = false;
            while ((!underscore.include('[]|=,', parser.get()) || escapeMode) &&
                    parser.hasMore()) {
                var chr = parser.get();
                if (chr === '\\' && !escapeMode) {
                    escapeMode = true;
                } else {
                    escapeMode = false;
                    out += parser.get();
                }
                parser.advance();
            }
            if (out === '') {
                throw {
                    name: 'parse error',
                    message: 'empty word at ' + parser.offset
                };
            }
            return out;
        }
    };
};

exports.Parser = Parser;

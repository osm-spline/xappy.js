// simple recursive descent parser.
// parses the x-path like syntax used in xapi queries.

// TODO support wildcards for values
// TODO escaping of values within predicates
//
// parsers indicate failure by throwing an exception

var underscore = require('underscore');
var log = require('log4js')().getLogger('requestparser');

function Parser(expr) {
    return {
        offset: 0, // current parsing position in `expr`
        expr: expr,

        // advance parsing position by one
        advance: function() {
            this.offset++;
        },

        // returns whether there is more to parse
        hasMore: function() {
            return this.offset < this.expr.length;
        },

        // returns char at current parsing position
        get: function() {
            return this.expr.charAt(this.offset);
        },

        // cosumes char sequence at current parsing position.
        // throws if char sequence is not found.
        expect: function(chars) {
            var that = this;
            underscore.each(chars, function(c) {
                if (that.get() !== c) {
                    throw {
                        name: 'parse error',
                        message:
                            'at ' + that.offset + ': ' +
                            'expected "' + c + '" but was "' + that.get() + '"'
                    };
                }
                that.advance();
            });
        },

        // takes a list of parsers. tries them in order.
        // returns output of first succeeding parser. fails if all choices fail.
        choice: function(choices) {
            if (underscore.isEmpty(choices)) {
                throw {name: 'user error', message: 'empty choices'};
            }
            var head = underscore.head(choices);
            var tail = underscore.tail(choices);
            var stored_offset = this.offset;
            try {
                return head();
            } catch (error) {
                if (underscore.isEmpty(tail)) {
                    throw {
                        name: 'parse error',
                        message:
                            'at ' + this.offset + ': ' +
                            'all choices failed'
                    };
                } else {
                    this.offset = stored_offset;
                    return this.choice(tail);
                }
            }
        },

        // parser functions
        // ----------------

        // each function has a comment that describes, what the function parses.
        // other parser functions are denoted by angle braces.

        // '/'<object><predicates>
        xpath: function() {
            this.expect('/');
            return { object: this.object(), predicates: this.predicates() };
        },

        // '*' | 'way' | 'node' | 'relation'
        object: function() {
            var type = this.word();
            if ( ! underscore.include(['*', 'way', 'node', 'relation'], type)) {
                throw 'unknown object type "' + type + '" at ' + this.offset;
            }
            return type;
        },

        // [ <predicate> ]
        predicates: function() {
            var out = [];
            while(this.hasMore()) {
                this.expect('[');
                out.push(this.predicate());
                this.expect(']');
            }
            return out;
        },

        // <bboxPredicate> | <childPredicate> | <selectionPredicate>
        predicate: function() {
            // the following line is necessary, that the this object inside the
            // three predicate callbacks is always the right this.
            // TODO find a better way to do this
            underscore.bindAll(this); 
            return this.choice([
                this.bboxPredicate,
                this.tagPredicate,
                this.childPredicate
            ]);
        },

        // 'bbox='<float>','<float>','<float>','<float>
        bboxPredicate: function() {
            this.expect('bbox=');
            var bbox = {};
            bbox.left = parseFloat(this.word());
            this.expect(',');
            bbox.bottom = parseFloat(this.word());
            this.expect(',');
            bbox.right = parseFloat(this.word());
            this.expect(',');
            bbox.top = parseFloat(this.word());
            return bbox;
        },

        // 'nd' || 'not(nd)' || 'tag' || 'not(tag)' || 'way' || 'not(way)' ||
        // 'node' || 'not(node)' || 'relation' || 'not(relation)'
        childPredicate: function() {
            var valid = [
                'nd', 'not(nd)',
                'tag', 'not(tag)',
                'way', 'not(way)',
                'node', 'not(node)',
                'relation', 'not(relation)'
            ];
            var word = this.word();
            if (! underscore.include(valid, word)) {
                throw {
                    name: 'parse error',
                    message: 'expected child predicate but was "' + word + '" at' +
                        this.offset
                };
            }
            return {child: word};
        },

        // <delimited>'='<delimited>
        tagPredicate: function() {
            var tag = {};
            tag.key = this.delimited();
            this.expect('=');
            tag.value = this.delimited();
            return tag;
        },

        // list of <word> delimited by '|' (at least one)
        delimited: function() {
            var out = [this.word()];
            while( ! underscore.include('=]', this.get()) && this.hasMore()) {
                this.expect('|');
                out.push(this.word());
            }
            return out;
        },

        // everything until one of ']|=,' (not prefixed by a backslash)
        word: function() {
            var out = '';
            var escapeMode = false;
            while(( ! underscore.include('[]|=,', this.get()) || escapeMode)
                    && this.hasMore()) {
                var char = this.get();
                if (char === '\\' && ! escapeMode) {
                    escapeMode = true;
                } else {
                    escapeMode = false;
                    out += this.get();
                }
                this.advance();
            }
            if (out === '') {
                throw {
                    name: 'parse error',
                    message: 'empty word at ' + this.offset
                };
            }
            return out;
        }
    };
}

// constructs XapiRequest from the parser output.
// the parser accepts an arbitrary list of predicates.
// an XapiRequest however contains at most one tag and one bbox.
// therefore, only the first tag and bbox returned by the parser are chosen.
function xapiRequest(parsed) {
    // used to differentiate between tag and bbox predicates
    var isTag = function(object) { return object.key != undefined; };
    var isBbox = function(object) { return object.left != undefined; };
    var isChild = function(object) { return object.child != undefined; };

    var bbox = underscore.detect(parsed.predicates, isBbox);
    var tag = underscore.detect(parsed.predicates, isTag);
    var child = underscore.detect(parsed.predicates, isChild);

    var request = { object: parsed.object };
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

function makeChildPredicate(child) {
    return {has: has(child.child), attribute: attribute(child.child)}
}

function has(word) {
    return ! startsWith(word, 'not(');
}

function startsWith(string, prefix) {
    return string.indexOf(prefix) == 0;
}

function attribute(word) {
    var normalized = has(word) ? word : word.slice(4, -1);
    if (normalized == 'nd') return 'node';
    return normalized;
}

function parseSync(expr) {
    var parser = Parser(decodeURI(expr));
    return xapiRequest(parser.xpath());
}

// returns XapiRequest parsed from `expr`
function parse(expr, callback) {
    var error = null;
    var result = null;
    try {
        result = parseSync(expr);
    }
    catch(er) {
        error = er;
    }
    callback(error, result);
}

if (typeof module == "object" && typeof require == "function") {
    exports.Parser = Parser;
    exports.parseSync = parseSync;
    exports.parse = parse;
    exports.xapiRequest = xapiRequest;
}

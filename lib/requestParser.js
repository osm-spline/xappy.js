// simple recursive descent parser.
// parses the x-path like syntax used in xapi queries.

// TODO support wildcards for values
// TODO escaping of values within predicates

var underscore = require('underscore');

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
        expect: function(chars){
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

        // <bboxPredicate> | <selectionPredicate>
        predicate: function() {
            var stored_offset = this.offset;
            try {
                return this.bboxPredicate();
            } catch (error) {
                this.offset = stored_offset;
                return this.tagPredicate();
            }
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

        // everything until one of ']|=,'
        word: function() {
            var out = '';
            while( ! underscore.include('[]|=,', this.get()) && this.hasMore()) {
                out += this.get();
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

    var request = { object: parsed.object };
    var bbox = underscore.detect(parsed.predicates, isBbox);
    var tag = underscore.detect(parsed.predicates, isTag);
    if (bbox !== undefined) {
        request.bbox = bbox;
    }
    if (tag !== undefined) {
        request.tag = tag;
    }
    return request;
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

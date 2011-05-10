// simple recursive descent parser.
// parses the x-path like syntax used in xapi queries.

// TODO support wildcards for values
// TODO escaping of values within predicates

var underscore = require('underscore');

module.exports = {
    Parser: function(expr) {
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

            // '/'<object>[ <predicate> ]
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
                    return this.selectionPredicate();
                }
            },

            // 'bbox='<float>','<float>','<float>','<float>
            bboxPredicate: function() {
                this.expect('bbox=');
                var out = { type: 'bbox' };
                out.left = parseFloat(this.word());
                this.expect(',');
                out.bottom = parseFloat(this.word());
                this.expect(',');
                out.right = parseFloat(this.word());
                this.expect(',');
                out.top = parseFloat(this.word());
                return out;
            },

            // <delimited>'='<delimited>
            selectionPredicate: function() {
                var out = { type: 'selection' };
                out.tags = this.delimited();
                this.expect('=');
                out.values = this.delimited();
                return out;
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

    },

    // constructs XapiRequest from the parser output.
    // the parser accepts an arbitrary list of predicates.
    // and XapiRequest however contains at most one tag and one bbox.
    // therefore, only the first tag and bbox returned by the parser are chosen.
    // TODO find a better way to do this
    xapiRequest: function(parsed) {
        var detectByType = function(type) {
            return underscore.detect(parsed.predicates, function(x) { return x.type === type; });
        };

        // reformat parser output as XapiRequest
        // TODO this is ugly
        var first_bbox = detectByType('bbox');
        if (first_bbox !== undefined) {
            delete first_bbox.type;
        }

        var first_tag = detectByType('selection');
        if (first_tag !== undefined) {
            delete first_tag.type;
            first_tag.value = first_tag.values;
            delete first_tag.values;
            first_tag.key = first_tag.tags;
            delete first_tag.tags;
        }

        // only add those elements in the XapiRequest,
        // that are really set in the request
        var result = { object: parsed.object };
        if (first_bbox) {
            result.bbox = first_bbox;
        }
        if (first_tag) {
            result.tag = first_tag;
        }

        return result;
    },

    // returns XapiRequest parsed from `expr`
    parse: function(expr,callback) {
        try {
            var parser = this.Parser(expr);     
            callback(null,this.xapiRequest(parser.xpath()));
        }
        catch(error) {
            callback(error,null);
        }
    }
};

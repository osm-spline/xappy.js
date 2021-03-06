// generic low-level parser functionality

var _ = require('underscore')._;
var us = require('underscore.string')

var GenericParser = function (expr) {
    return {
        // offset = current parsing position in 'expr'
        offset: 0,
        expr: expr,

        // advance parsing position by one
        advance: function () {
            this.offset++;
        },

        // returns whether there is more to parse
        hasMore: function () {
            return this.offset < this.expr.length;
        },

        // returns char at current parsing position
        get: function () {
            return this.expr.charAt(this.offset);
        },

        // cosumes char sequence at current parsing position.
        // throws if char sequence is not found.
        expect: function (chars) {
            var that = this;
            _.each(us.chars(chars), function (c) {
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
        choice: function (choices) {
            if (_.isEmpty(choices)) {
                throw {
                    name: 'user error', message: 'empty choices'
                };
            }

            var head = _.head(choices);
            var tail = _.tail(choices);
            var stored_offset = this.offset;

            try {
                return head();
            } catch (error) {
                if (_.isEmpty(tail)) {
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
        }
    };
};

exports.GenericParser = GenericParser;

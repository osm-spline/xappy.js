var parse = require('../lib/requestParser').parse;

module.exports = {
    'valid request, expect no error': function(test) {
        parse('/node', function(error, data) {
            test.equal(null, error);
            test.ok(data);
            test.finish();
        });
    },
    'invalid request, expect error': function(test) {
        parse('error', function(error, data) {
            test.ok(error);
            test.equal(null, data);
            test.finish();
        });
    }
};

if (module === require.main) {
    require('async_testing').run(__filename, process.ARGV);
}

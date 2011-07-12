var Factory = require('../lib/generatorFactory').factory;

var xml = 'application/xml';
var json = 'application/json';

var parameters = function() { return {}; };
var generator = Factory(parameters);

module.exports = {
    'getGenerator with invalid type': function(test) {
        test.uncaughtExceptionHandler = function(err) {
            test.equal('Invalid Content-Type',err.message);
            test.equal(415,err.code);
            test.finish();
        }
        var gen = generator('text/text', 'uri');
    },
    'getGenerator, get Json': function(test) {
        var config = {};
        var gen = generator(json, 'uri');
        test.equal(gen.contentType, json);
        test.finish();
    },
    'getGenerator, get Xml': function(test) {
        var config = {};
        var gen = generator(xml, 'uri');
        test.equal(gen.contentType, xml);
        test.finish();
    },
};

if (module == require.main) {
  require('coverage_testing').run(__filename, process.ARGV);
}

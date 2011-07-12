var configPath = 'etc/my-config.json';
var petra = require('./petraData');
var helper = require('./helper');
var testing = require('coverage_testing');

var testForError = helper.testForError;
var suiteUp = helper.SuiteUp(configPath).suiteUp;

var allBbox = petra.bbox.all;
var tagHospital = petra.tags.hospital;

var allErrorSuite = {
    'all: all': function(test) {
        var request = { object: '*' };
        testForError(request, test);
    },
    'all: bbox': function(test) {
        var request = { object: '*' };
        testForError(request, test);
    },
    'all: tags': function(test) {
        var request = { object: '*', bbox: allBbox };
        testForError(request, test);
    },
    'all: tags and bbox': function(test) {
        var request = { object: '*', bbox: allBbox, tag: tagHospital };
        testForError(request, test);
    }
};

exports.allError = suiteUp(allErrorSuite);

if (module == require.main) {
    return testing.run(__filename, process.ARGV);
}

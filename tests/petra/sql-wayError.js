var configPath = 'etc/petra-config.json';
var petra = require('./petraData');
var helper = require('./helper');
var testing = require('coverage_testing');

var testForError = helper.testForError;
var suiteUp = helper.SuiteUp(configPath).suiteUp;

var allBbox = petra.bbox.all;
var tagHospital = petra.tags.hospital;

var wayErrorSuite = {
    'ways: all': function(test) {
        var request = { object: 'way' };
        testForError(request, test);
    },
    'ways: bbox': function(test) {
        var request = { object: 'way' };
        testForError(request, test);
    },
    'ways: tags': function(test) {
        var request = { object: 'way', bbox: allBbox };
        testForError(request, test);
    },
    'ways: tags and bbox': function(test) {
        var request = { object: 'way', bbox: allBbox, tag: tagHospital };
        testForError(request, test);
    }
};

exports.wayError = suiteUp(wayErrorSuite);

if (module == require.main) {
    return testing.run(__filename, process.argv);
}

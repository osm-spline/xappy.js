var configPath = 'etc/petra-config.json';
var petra = require('./petraData');
var helper = require('./helper');
var testing = require('coverage_testing');

var testForError = helper.testForError;
var suiteUp = helper.SuiteUp(configPath).suiteUp;

var allBbox = petra.bbox.all;
var emptyBbox = petra.bbox.empty;
var bottomBbox = petra.bbox.bottom;
var tagHospital = petra.tags.hospital;

var relationErrorSuite = {
    'relations error: all': function(test) {
        var request = { object: 'relation' };
        testForError(request, test);
    },
    'relations error: all in bbox': function(test) {
        var request = { object: 'relation', bbox: allBbox };
        testForError(request, test);
    },
    'relations and tag': function(test) {
        var request = { object: 'relation', tag: tagHospital };
        testForError(request, test);
    },
    'relations: tag and bbox': function(test) {
        var request = { object: 'relation', bbox: allBbox, tag: tagHospital };
        testForError(request, test);
    }
};

exports.relationError = suiteUp(relationErrorSuite);

if (module == require.main) {
    return testing.run(__filename, process.ARGV);
}

var configPath = 'etc/my-config.json';
var petra = require('./petraData');
var helper = require('./helper');
var testing = require('coverage_testing');

var testForError = helper.testForError;
var testForCount = helper.testForCount;
var suiteUp = helper.SuiteUp(configPath).suiteUp;

var allBbox = petra.bbox.allBbox;
var tagHospital = petra.tags.hospital;

var nodesErrorSuite = {
    'nodes only': function(test) {
        var request = { object: 'node' };
        testForError(request, test);
    },
    'node and bbox': function(test) {
        var request = { object: 'node', bbox: allBbox };
        testForError(request, test);
    },
    'nodes and tag': function(test) {
        var request = { object: 'node', tag: tagHospital };
        testForError(request, test);
    },
    'node tag and bbox': function(test) {
        var request  = { object: 'node', tag: tagHospital, bbox: allBbox };
        testForError(request, test);
    },
};

exports.nodesError = suiteUp(nodesErrorSuite);

if (module == require.main) {
    return testing.run(__filename, process.ARGV);
}

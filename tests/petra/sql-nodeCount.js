var configPath = 'etc/my-config.json';
var petra = require('./petraData');
var helper = require('./helper');
var testing = require('coverage_testing');

var testForCount = helper.testForCount;
var suiteUp = helper.SuiteUp(configPath).suiteUp;

var allBbox = petra.bbox.all;
var emptyBbox = petra.bbox.empty;
var bottomBbox = petra.bbox.bottom;
var tagHospital = petra.tags.hospital;

var nodesCountSuite = {
    'all': function(test) {
        var request = { object: 'node' };
        testForCount(request, test, 7, 0, 0);
    },
    'all with bbox': function(test) {
        var request = { object: 'node', bbox: allBbox };
        testForCount(request, test, 7, 0, 0);
    },
    'empty bbox': function(test) {
        var request = { object: 'node', bbox: emptyBbox };
        testForCount(request, test, 0, 0, 0);
    },
    // 'tag': function(test) {
    //     var request = { object: 'node', tag: tagHospital };
    //     testForCount(request, test, 2, 0, 0);
    // },
    'tag and bbox': function(test) {
        // should return id 7
        var request = {object: 'node', tag: tagHospital, bbox: bottomBbox };
        testForCount(request, test, 1, 0, 0);
    }
};

exports.nodeCount = suiteUp(nodesCountSuite);

if (module == require.main) {
    return testing.run(__filename, process.ARGV);
}

var configPath = 'etc/my-config.json';
var petra = require('./petraData');
var helper = require('./helper');
var testing = require('coverage_testing');

var testForCount = helper.testForCount;
var suiteUp = helper.SuiteUp(configPath).suiteUp;

var allBbox = petra.bbox.all;
var emptyBbox = petra.bbox.empty;
var top = petra.bbox.top;
var tagHospital = petra.tags.hospital;

var nodesCountSuite = {
    'all elements': function(test) {
        var request = { object: '*' };
        testForCount(request, test, 7, 3, 5);
    }/*,
    'all elements in big bbox': function(test) {
        var request = { object: '*', bbox: allBbox };
        testForCount(request, test, 7, 3, 2);
    },
    'empty bbox': function(test) {
        var request = { object: '*', bbox: emptyBbox };
        testForCount(request, test, 0, 0, 0);
    },
    'special tag': function(test) {
        var request = { object: '*', tag: tagHospital };
        testForCount(request, test, 2, 0, 0);
    },
    'nodes: all nodes with a tag and a bbox': function(test) {
        // should return id 7
        var request = {object: '*', tag: tagHospital, bbox: top };
        testForCount(request, test, 1, 0, 0);
    } */
};

exports.nodeCount = suiteUp(nodesCountSuite);

if (module == require.main) {
    return testing.run(__filename, process.ARGV);
}

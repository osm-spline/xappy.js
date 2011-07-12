var configPath = 'etc/my-config.json';
var petra = require('./petraData');
var helper = require('./helper');
var testing = require('coverage_testing');

var testForCount = helper.testForCount;
var suiteUp = helper.SuiteUp(configPath).suiteUp;

var allBbox = petra.bbox.all;
var emptyBbox = petra.bbox.empty;
var tagStrandweg = petra.tags.strandweg;

var wayCountSuite = {
    'ways: all ways': function(test) {
        var request = { object: 'way' };
        testForCount(request, test, 6, 3, 0);
    },
    'ways: all bbox': function(test) {
        var request = { object: 'way', bbox: allBbox };
        testForCount(request, test, 6, 3, 0);
    },
    'ways: empty bbox': function(test) {
        var request = {object: 'way', bbox: emptyBbox };
        testForCount(request, test, 0, 0, 0);
    },
    'ways: tag': function(test) {
        // should be Norden - Usedom with nodes 2 and 3
        var request = {object: 'way', tag: tagStrandweg };
        testForCount(request, test, 2, 1, 0);
    },
    'ways: tag and empty bbox': function(test) {
        var request = {object: 'way', tag: tagStrandweg, bbox: emptyBbox};
        testForCount(request, test, 0,0,0);
    },
    'ways: tag amd full bbox': function(test) {
        var request = {object: 'way', tag: tagStrandweg, bbox: allBbox};
        testForCount(request, test, 2,1,0);
    }
    // TODO need another tag for another way
    // TODO test 2 ways with same tag, split by bbox
    // TODO test 2 ways with same bbox, split by tag
};

exports.wayCount = suiteUp(wayCountSuite);

if (module == require.main) {
    return testing.run(__filename, process.ARGV);
}

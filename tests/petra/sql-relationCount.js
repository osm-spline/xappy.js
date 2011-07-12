var configPath = 'etc/my-config.json';
var petra = require('./petraData');
var helper = require('./helper');
var testing = require('coverage_testing');

var testForCount = helper.testForCount;
var suiteUp = helper.SuiteUp(configPath).suiteUp;

var relationCountSuite = {
    'relations: count all relations': function(test) {
        var request = {object: 'relation'};
        testForCount(request, test, 7,3,5);
    }
    // TODO test for bbox
    // TODO test for tag
    // TODO test for bbox and tag
};


exports.relationCount = suiteUp(relationCountSuite);

if (module == require.main) {
    return testing.run(__filename, process.ARGV);
}

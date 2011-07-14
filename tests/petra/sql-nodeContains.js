var configPath = 'etc/petra-config.json';
var petra = require('./petraData');
var helper = require('./helper');
var testing = require('coverage_testing');

var contains = helper.containsElement;
var suiteUp = helper.SuiteUp(configPath).suiteUp;

var allBbox = petra.bbox.all;
var emptyBbox = petra.bbox.empty;
var bottomBbox = petra.bbox.bottom;
var tagHospital = petra.tags.hospital;

var nodesCountSuite = {
    'all': function(test) {
        var request = { object: 'node' };
        contains(request, test, { nodes: petra.nodes });
    }
};

exports.nodeContains = suiteUp(nodesCountSuite);

if (module == require.main) {
    return testing.run(__filename, process.ARGV);
}

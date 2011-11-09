var configPath = 'etc/petra-config.json';
var petra = require('./petraData');
var helper = require('./helper');
var testing = require('coverage_testing');

var contains = helper.containsElement;
var suiteUp = helper.SuiteUp(configPath).suiteUp;

var wayContains = {
    'all': function(test) {
        var request = { object: 'way' };
        var nodes = [
            petra.nodes[0], // node 1 is in way1
            petra.nodes[1], // node 2 is in way2/way3
            petra.nodes[2], // node 3 is in way3
            petra.nodes[4], // node 5 is in way2
            petra.nodes[5], // node 6 is in way1
            petra.nodes[6] // node 7 is in way1
        ];
        contains(request, test, { ways: petra.ways, nodes: nodes});
    }
};

exports.wayContains = suiteUp(wayContains);

if (module == require.main) {
    return testing.run(__filename, process.argv);
}

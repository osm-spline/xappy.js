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
    },
    'bbox over node2': function(test) {
        var request = {object: 'node', bbox: petra.bbox.node2 }
        var node2 = petra.nodes[1];
        contains(request, test, { nodes: [node2] });
    },
    'bbox over all nodes': function(test) {
        var request = { object: 'node' , bbox: petra.bbox.all};
        contains(request, test, { nodes: petra.nodes });
    },
    'bbox over some nodes': function(test) {
        var request = { object: 'node' , bbox: petra.bbox.bottom};
        var nodes = [
            petra.nodes[3], // node 4
            petra.nodes[4], // node 5
            petra.nodes[6] // node 7
        ];
        contains(request, test, { nodes: nodes });
    },
    'tag': function(test) {
        var request = { object: 'node', tag: petra.tags.hospital};
        var nodes = [
            petra.nodes[0],
            petra.nodes[6]
        ];
        contains(request, test, {nodes: nodes });
    },
    'tag and bbox': function(test) {
        var request = {object: 'node',
                bbox: petra.bbox.bottom,
                tag: petra.tags.hospital
        };
        // contains only node 7
        contains(request, test, {nodes: [petra.nodes[6]]});
    }
};

exports.nodeContains = suiteUp(nodesCountSuite);

if (module == require.main) {
    return testing.run(__filename, process.ARGV);
}

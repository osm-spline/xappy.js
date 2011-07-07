
var configPath = 'etc/my-config.json';
var petra = require('./sql-petraData');
var helper = require('./helper');

var testForError = helper.testForError;
var testForCount = helper.testForCount;
var suiteUp = helper.SuiteUp(configPath).suiteUp;

// for details please read `petra.osm`
// all contains nodes [1..7]
var allBbox = { left: 7, bottom: 47, right: 14, top: 54};
// bottom contains nodes [4,5,7]
var bottomBbox = { left: 7, bottom: 47, right: 14, top: 51};
// top contains node [1,2,3,6]
var topBbox = { left: 7, bottom: 51, right: 14, top: 54};
// left contains nodes [1,2,4]
var leftBbox = { left: 7, bottom: 47, right: 9.49, top: 54};
// right contains nodes [3,5,6,7]
var rightBbox = { left: 9.5, bottom: 47, right: 14, top: 54};
// empty contains nodes []
var emptyBbox = { left: -11.43, bottom: 49.81, right: 0.95, top: 59 };

// contains nodes [1,7]
var tagHospital = {key: ['amenity'], value: ['hospital'] };
// contains nodes [6]
var tagEmblem = {key: ['building'], value: ['emblem'] };
// contains nodes [3,4]
var tagHotel = {key: ['amenity'], value: ['hotel']};

var tagStrandweg = {key: ['value'], value: ['Strandweg']};

var nodesCountSuite = {
    'nodes: all nodes (7 in db)': function(test) {
        var request = { object: 'node' };
        testForCount(request, test, 7, 0, 0);
    },
    'nodes: all nodes in a big bbox (should contain all nodes)': function(test) {
        var request = { object: 'node', bbox: allBbox };
        testForCount(request, test, 7, 0, 0);
    },
    'nodes: test empty bbox': function(test) {
        var request = { object: 'node', bbox: emptyBbox };
        testForCount(request, test, 0, 0, 0);
    },
    'nodes: all nodes with a special tag': function(test) {
        var request = { object: 'node', tag: tagHospital };
        testForCount(request, test, 2, 0, 0);
    },
    'nodes: all nodes with a tag and a bbox': function(test) {
        // should return id 7
        var request = {object: 'node', tag: tagHospital, bbox: bottomBbox };
        testForCount(request, test, 1, 0, 0);
    }
};

var nodeContainsSuite = {
    'nodes: contains all 7 nodes': function(test) {
        // var request = { object: 'node' };
        console.log('petra: %j', petra.nodes);
        test.finish();
    }
};

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

var relationCountSuite = {
    'relations: count all relations': function(test) {
        var request = {object: 'relation'};
        testForCount(request, test, 7,3,2);
    }
    // TODO test for bbox
    // TODO test for tag
    // TODO test for bbox and tag
};

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


var allErrorSuite = {
    'all: all': function(test) {
        var request = { object: '*' };
        testForError(request, test);
    },
    'all: bbox': function(test) {
        var request = { object: '*' };
        testForError(request, test);
    },
    'all: tags': function(test) {
        var request = { object: '*', bbox: allBbox };
        testForError(request, test);
    },
    'all: tags and bbox': function(test) {
        var request = { object: '*', bbox: allBbox, tag: tagHospital };
        testForError(request, test);
    }
};

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

// Error testing
exports.nodesError = suiteUp(nodesErrorSuite);
exports.relationsError = suiteUp(relationErrorSuite);
exports.wayError = suiteUp(wayErrorSuite);
exports.allError = suiteUp(allErrorSuite);

// Count testing
exports.nodesCount = suiteUp(nodesCountSuite);
exports.waysCount = suiteUp(wayCountSuite);
exports.relationsCount = suiteUp(relationCountSuite);

// Contains testing
exports.nodeContains = suiteUp(nodeContainsSuite);


if (module == require.main) {
    var testing = require('coverage_testing');
    return testing.run(__filename, process.ARGV);
}

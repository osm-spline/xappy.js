var PostgresDb = require('../../lib/postgresdb/postgresdb').PostgresDb;

var log4js = require('log4js')();
var log = log4js.getLogger('sql-realDatabase');

var utility = require('../../lib/utility');
var nodeunit = require('coverage_testing');
var wrap = nodeunit.wrap;

var configPath = 'etc/my-config.json';

var petra = require('./sql-petraData');

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

function countNumberOfNodes(emitter, cb) {
    var nodes = 0;
    var ways = 0;
    var relations = 0;
    emitter.on('node', function() { nodes++; });
    emitter.on('way', function() { ways++; });
    emitter.on('relation', function() { relations++; });
    emitter.on('end', function() { cb(nodes, ways, relations); });
}


function testForCount(request, test, nodes, ways, relations) {
    test.db.executeRequest(request, function(error, emitter) {
        countNumberOfNodes(emitter, function(n, w, r) {
            test.equal(nodes, n, 'nodes: expected: ' + nodes + ' was: ' + n);
            test.equal(ways, w, 'ways: expected: ' + ways + ' was: ' + w);
            test.equal(relations, r, 'relations: expected: ' + relations + ' was: ' + r);
            test.finish();
        });
    });
}

function testForError(request, test) {
    test.db.executeRequest(request, function(error, emitter) {
        test.ok(error == null, "there is an error in the callback " + JSON.stringify(error));
        test.ok(emitter !== null, "emitter in the callback is null");
        test.finish();
    });
}

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
    }
}

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

function suiteUp(suite) {
    return wrap({
        suite: suite,
        setup: setup,
        teardown: teardown
    });
}

var setup = function(test, finish) {
    utility.readRelJson(configPath, function(error, config) {
        test.db = new PostgresDb(config.database);
        finish();
    });
};

var teardown = function(test, finish) {
    test.db.end();
    finish();
};

// Error testing
exports.nodesError = suiteUp(nodesErrorSuite);
exports.relationsError = suiteUp(relationErrorSuite);
exports.wayError = suiteUp(wayErrorSuite);
// exports.allError = suiteUp(allErrorSuite);

// Count testing
exports.nodesCount = suiteUp(nodesCountSuite);
exports.waysCount = suiteUp(wayCountSuite);


if (module == require.main) {
    var testing = require('coverage_testing');
    return testing.run(__filename, process.ARGV);
}

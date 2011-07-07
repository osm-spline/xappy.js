var PostgresDb = require('../../lib/postgresdb/postgresdb').PostgresDb;

var log4js = require('log4js')();
var log = log4js.getLogger('sql-realDatabase');

var utility = require('../../lib/utility');
var nodeunit = require('async_testing');
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
    var count = 0;
    emitter.on('node', function() { count++; });
    emitter.on('end', function() { cb(count); });
}

function testForCount(request, count, test) {
    test.db.executeRequest(request, function(error, emitter) {
        countNumberOfNodes(emitter, function(res) {
            test.equal(count, res);
            test.done();
        });
    });
}

function testForError(request, test) {
    test.db.executeRequest(request, function(error, emitter) {
        test.ok(error == null, "there is an error in the callback " + JSON.stringify(error));
        test.ok(emitter !== null, "emitter in the callback is null");
        test.done();
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
        testForCount(request, 7, test);
    },
    'nodes: all nodes in a big bbox (should contain all nodes)': function(test) {
        var request = { object: 'node', bbox: allBbox };
        testForCount(request, 7, test);
    },
    'nodes: test empty bbox': function(test) {
        var request = { object: 'node', bbox: emptyBbox };
        testForCount(request, 0, test);
    },
    'nodes: all nodes with a special tag': function(test) {
        var request = { object: 'node', tag: tagHospital };
        testForCount(request, 2, test);
    },
    'nodes: all nodes with a tag and a bbox': function(test) {
        // should return id 7
        var request = {object: 'node', tag: tagHospital, bbox: bottomBbox };
        testForCount(request, 1, test);
    }
};

var relationErrorSuite = {
    'test for error while requesting all relations': function(test) {
        var request = { object: 'relation' };
        testForError(request, test);
    }
};

var wayErrorSuite = {
    'test for error while requesting all ways': function(test) {
        var request = { object: 'way' };
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

var setup = function(test, done) {
    utility.readRelJson(configPath, function(error, config) {
        test.db = new PostgresDb(config.database);
        done();
    });
};

var teardown = function(test, done) {
    test.db.end();
    done();
};

exports.nodesError = suiteUp(nodesErrorSuite);
exports.nodesCount = suiteUp(nodesCountSuite);
// exports.relationsError = suiteUp(relationErrorSuite);
exports.wayError = suiteUp(wayErrorSuite);

if (module == require.main) {
    return require('nodeunit').run(__filename, process.ARGV);
}

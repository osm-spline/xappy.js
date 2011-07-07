var utility = require('../../lib/utility');
var PostgresDb = require('../../lib/postgresdb/postgresdb').PostgresDb;
var testing = require('coverage_testing');
var wrap = testing.wrap;

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
function SuiteUp(configPath) {
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
    this.suiteUp = function(suite) {
        return wrap({
            suite: suite,
            setup: setup,
            teardown: teardown
        });
    }
    return this;
}

exports.SuiteUp = SuiteUp;
exports.testForError = testForError;
exports.testForCount = testForCount;

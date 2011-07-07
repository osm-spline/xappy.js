var utility = require('../../lib/utility');
var PostgresDb = require('../../lib/postgresdb/postgresdb').PostgresDb;
var testing = require('coverage_testing');
var wrap = testing.wrap;
var _ = require('underscore')._;

function containsElement(request, test, elements) {
    test.db.executeRequest(request, function(e, emitter) {
        containsElementsEmitter(emitter, elements, function(success, msg) {
            // emitter.removeAllListeners();
            test.ok(success, msg);
            test.finish();
        });
    });
}

function containsElementsEmitter(emitter, elements, cb) {
    var nodes = _.clone(elements.nodes) || [];
    var ways = _.clone(elements.ways) || [];
    var relations = _.clone(elements.relations) || [];

    emitter.on('node', function(node) {
        if (_.include(nodes, node)) {
            console.log('uih');
            nodes = _.reject(nodes, node);
        } else {
            console.log('pfui');
            var e = JSON.stringify(node);
            var l = JSON.stringify(nodes);
            cb(false, e + ' is not in list ' + l);
        }
    });

    emitter.on('way', function(way) {
        if (_.include(ways, way)) {
            ways = _.reject(ways, way);
        } else {
            cb(JSON.stringify(way) + ' is not in list');
        }
    });

    emitter.on('relation', function(rel) {
        if (_.include(relations, rel)) {
            relations = _.reject(relations, rel);
        } else {
            cb(JSON.stringify(rel) + ' is not in list');
        }
    });

    emitter.on('end', function() {
        var ndEmpty = _.isEmpty(nodes);
        var wayEmpty = _.isEmpty(ways);
        var relEmpty = _.isEmpty(relations);
        if (ndEmpty && wayEmpty && relEmpty) {
            cb(true);
        } else {
            cb(false, 'not empty'); // todo send debug
        }
    });
}

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
exports.containsElement = containsElement;

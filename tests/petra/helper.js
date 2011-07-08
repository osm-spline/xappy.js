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
};

function compareKeyValue(a, b) {
    if (a.key < b.key) {
        return -1;
    } else if (a.key > b.key) {
        return 1;
    } else { //a.key == b.key
        if (a.value < b.value) {
            return -1;
        } else if (a.value > b.value) {
            return 1;
        } else {
            return 0;
        }
    }
}

function containsElementsEmitter(emitter, elements, cb) {
    var nodes = _.clone(elements.nodes) || [];
    var ways = _.clone(elements.ways) || [];
    var relations = _.clone(elements.relations) || [];

    // sort tags of nodes
    tags = _.pluck(nodes, 'tags');
    _.each(tags, function(tag) {
        if (tag) {
            tag.sort(compareKeyValue);
        }
    });

    nodes = _.map(nodes, function(node) {
        return JSON.stringify(node);
    });

    emitter.on('node', function(node) {
        // sort results tags
        if (node.tags) {
            node.tags.sort(compareKeyValue);
        }
        // jsonify
        var elem = JSON.stringify(node);

        if (_.include(nodes, elem)) {
            nodes = _.without(nodes, elem);
        } else {
            var l = JSON.stringify(nodes);
            cb(false, elem + ' is not in list ' + l);
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

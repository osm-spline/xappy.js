exports.nodeError = require('./sql-nodeError').nodeError;
exports.nodeCount = require('./sql-nodeCount').nodeCount;
exports.nodeContains = require('./sql-nodeContains').nodeContains;

exports.wayError = require('./sql-wayError').wayError;
// exports.wayCount = require('./sql-wayCount').wayCount;

exports.relationError = require('./sql-relationError').relationError;
exports.relationCount = require('./sql-relationCount').relationCount;
// TODO: relationContains

exports.allError = require('./sql-allError').allError;
exports.allError = require('./sql-allCount').allCount;
// TODO: allContains


if (module == require.main) {
    var testing = require('coverage_testing');
    return testing.run(__filename, process.ARGV);
}

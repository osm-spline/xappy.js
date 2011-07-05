#! /usr/bin/env node

var testing = require('async_testing'),
sys = require('sys'),
fs = require('fs'),
path = require('path');

if (testing.hasOwnProperty('registerRunner')) {
    // new async_testing version
    process.ARGV.shift();
    process.ARGV.shift();
    process.ARGV.unshift('node');
    testing.run(process.ARGV, done);
}
else {
    testing.run(null, process.ARGV, done);
}

function done(allResults) {
    // we want to have our exit status be the number of problems
    var problems = 0;

    for(var i = 0; i < allResults.length; i++) {
        if (allResults[i].hasOwnProperty('tests')) {
            if (allResults[i].tests.length > 0) {
                problems += allResults[i].numErrors;
                problems += allResults[i].numFailures;
            }
        }
        else {
            // new async_testing version
            if (allResults[i].results.tests.length > 0) {
                problems += allResults[i].results.numFailures;
            }
        }
    }

    if (typeof _$jscoverage === 'object') {
        // dump coverage data into coverage.json
        writeCoverage(reformatCoverageData(_$jscoverage));
    }
    else if ('coverage' in testing) {
        writeCoverage(testing.coverage);
    }

    process.exit(problems);
}

function reformatCoverageData(data) {
    // reformat jscoverage data to save it with JSON.stringify
    var validData = {};
    for (var key in data) {
        validData[key] = {};
        for (var line in data[key]) {
            if (data[key][line] != null) {
                validData[key][line] = data[key][line];
            }
        }

        validData[key]['source'] = data[key].source;
    }

    return validData;
}

function writeCoverage(data) {
    var filename = path.join(path.dirname(__filename),
                             '..', '..', 'coverage.json');

    var fp = fs.openSync(filename, 'w');
    fs.writeSync(fp, JSON.stringify(data), null);
    fs.closeSync(fp);
}

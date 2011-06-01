#! /usr/bin/env node

var testing = require('async_testing'),
sys = require('sys'),
fs = require('fs'),
path = require('path');

testing.run(null, process.ARGV, done);

function done(allResults) {
    // we want to have our exit status be the number of problems
    var problems = 0;

    for(var i = 0; i < allResults.length; i++) {
        if (allResults[i].tests.length > 0) {
            problems += allResults[i].numErrors;
            problems += allResults[i].numFailures;
        }
    }

    if (typeof _$jscoverage === 'object') {
        // dump coverage data into coverage.json
        writeCoverage(_$jscoverage);
    }

    process.exit(problems);
}

function writeCoverage(data) {
    var filename = path.join(path.dirname(__filename),
                             '..', '..', 'coverage.json');

    var fp = fs.openSync(filename, 'w');
    fs.writeSync(fp, JSON.stringify(data), null);
    fs.closeSync(fp);
}

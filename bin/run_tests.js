#!/usr/bin/env node

var path = require('path');
var _ = require('underscore')._;
var testing = require('xappy-async_testing')

// var jsCovPath = path.resolve(__dirname, '../../node-jscoverage/jscoverage');
// console.log(jsCovPath);

var testPath = path.resolve(__dirname, '..', 'tests');
console.log('Run tests in %s', testPath);

// this is copied from `running.js run`
var cb = function (allResults) {
    var problems = 0;
    for (var i = 0; i < allResults.length; i++) {
        if (allResults[i].status != 'complete' || allResults[i].results.numFailures > 0) {
            problems++;
        }
    }

    console.log('jscoverage var %j', _$jscoverage);
    if (typeof _$jscoverage === 'object') {
        console.log('dump coverage data into coverage.json');
        // dump coverage data into coverage.json
        writeCoverage(_$jscoverage);
    }

    console.log('problems: %s', problems);
    // we only want to exit after we know everything has been written to
    // stdout, otherwise sometimes not all the output from tests will have
    // been printed. Thus we write an empty string to stdout and then make sure
    // it is 'drained' before exiting
    var written = process.stdout.write('');
    if (written) {
        process.exit(problems);
    } else {
        process.stdout.on('drain', function drained() {
            process.stdout.removeListener('drain', drained);
            process.exit(problems);
        });
    }
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
    var filename = path.join(__dirname, '..', '..', 'coverage.json');
    var fp = fs.openSync(filename, 'w');
    fs.writeSync(fp, JSON.stringify(reformatCoverageData(data)), null);
    fs.closeSync(fp);
}
testing.run(null, process.ARGV, cb);

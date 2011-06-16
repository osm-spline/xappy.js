#! /usr/bin/env node

var path = require('path'),
fs = require('fs'),
sys = require('sys'),
common = require('./common'),
contrib = require('../../../lib/contrib'),
argv = require('optimist').argv;

function cli() {
    if (argv.help) {
        console.log("html.js usage");
        console.log("  --verbose           print coverage statistics for every line of all files");
        console.log("  --data              set alternativ coverage.json file");
    }
    else {
        var coverage = common.getCoverageData(argv.data);
        reportCoverage(coverage);
    }
}

function print(str){
    sys.print(str);
}

function reportCoverage(cov) {
    var LOC = 0, SLOC = 0, totalFiles = 0, totalHits = 0, totalMisses = 0, coverage = 0, sources = {};

    print('<html><head><style type="text/css">.source { white-space: pre; font-family: monospace; padding-left: 20px; } .line { font-size: 0.8em; width: 50px; }</style></head><body>');

    // print header
    print('<h1>Test Coverage</h1>');
    print('<table>');
    print('<tr><th>filename</th><th>coverage</th><th>LOC</th><th>SLOC</th><th>missed</th></tr>');

    for (var name in cov) {
        if (cov.hasOwnProperty(name)) {
            var file = cov[name], fileHits, fileMisses, fileSLOC, fileLOC, fileCoverage;

            // stats
            ++totalFiles;
            totalHits += fileHits = common.sumCoverage(file, true);
            totalMisses += fileMisses = common.sumCoverage(file, false);
            SLOC += fileSLOC = fileHits + fileMisses;
            LOC += fileLOC = file.source.length;
            fileCoverage = (fileHits / fileSLOC) * 100;

            print('<tr><td>' + name + '</td><td>'
                  + fileCoverage.toFixed(2) + '</td><td>'
                  + fileLOC + '</td><td>' + fileSLOC
                  + '</td><td>' + fileMisses + '</td></tr>');
        }
    }

    coverage = (totalHits / SLOC) * 100;

    // summary
    print('<tr><td></td><td>' + coverage.toFixed(2)
          + '</td><td>' + LOC + '</td><td>' + SLOC
          + '</td><td>' + totalMisses + '</td></tr>');
    print('</table>');

    // print source of files with counters
    if (argv.verbose) {
        for (var name in cov) {
            if (cov.hasOwnProperty(name)) {
                print('<h1>' + name + '</h1>');
                printSource(cov[name]);
            }
        }
    }

    print('</body></html>');
}

function printSource(file) {
    print('<table>');
    for (var line in file.source) {
        print('<tr><td class="line">' + ++line + '</td><td>');

        if (file[line] === 0) {
            // highlight missed lines
            print('<span style="color: red;">0</span></td><td style="background: red; color: white;" class="source">');
        }
        else {
            print('<span style="color: green;">' + (file[line] || '')  + '</span></td><td class="source">');
        }

        print(file.source[line - 1] + '</td></tr>');
    }
    print('</table>');
}

if (typeof module == "object" && typeof require == "function") {
    exports.cli = cli;
}
if (module === require.main) {
    cli();
}

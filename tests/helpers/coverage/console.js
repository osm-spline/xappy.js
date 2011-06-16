#! /usr/bin/env node

var path = require('path'),
fs = require('fs'),
sys = require('sys'),
common = require('./common'),
contrib = require('../../../lib/contrib'),
argv = require('optimist').argv,
_ = require('underscore');

function cli() {
    if (argv.help) {
        console.log("console.js usage");
        console.log("  --nocolor           do not use colors in output");
        console.log("  --verbose           print coverage statistics for every line of all files");
        console.log("  --data              set alternativ coverage.json file");
    }
    else {
        var coverage = common.getCoverageData(argv.data);
        reportCoverage(coverage);
    }
}

function print(str){
    sys.print(colorize(str));
}

function colorize(str){
    var colors = { bold: 1, black: 30, red: 31, green: 32, yellow: 33,
                   blue: 34, purple: 35, cyan: 36, gray: 37,
                   blackback: 40, redback: 41, greenback: 42,
                   yellowback: 43, blueback: 44, purpleback: 45,
                   cyanback: 46, grayback: 47,
                   lblack: '1;30', lred: '1;31', lgreen: '1;32',
                   lyellow: '1;33', lblue: '1;34', lpurple: '1;35',
                   lcyan: '1;36', lgray: '1;37',
                   lblackback: '1;40', lredback: '1;41', lgreenback: '1;42',
                   lyellowback: '1;43', lblueback: '1;44', lpurpleback: '1;45',
                   lcyanback: '1;46', lgrayback: '1;47' };

    return str.replace(/\[(\w+)\]\{([^]*?)\}/g, function(_, color, str){
        if (!argv.nocolor) {
            return '\x1B[' + colors[color] + 'm' + str + '\x1B[0m';
        }
        else {
            return str;
        }
    });
}

function reportCoverage(cov) {
    var LOC = 0, SLOC = 0, totalFiles = 0, totalHits = 0, totalMisses = 0, coverage = 0, sources = {};

    // print header
    print('\n   [bold]{Test Coverage}\n\n');
    var sep = '   +------------------------------------------+----------+------+------+--------+\n',
    lastSep = '                                              +----------+------+------+--------+\n';
    print(sep);
    print('   | filename                                 | coverage | LOC  | SLOC | missed |\n');
    print(sep);

    for (var name in cov) {
        if (cov.hasOwnProperty(name)) {
            var file = cov[name], fileHits, fileMisses, fileSLOC, fileLOC, fileCoverage;

            // stats
            ++totalFiles;
            totalHits += fileHits = common.sumCoverage(file, true);
            totalMisses += fileMisses = common.sumCoverage(file, false);
            debugger;
            SLOC += fileSLOC = fileHits + fileMisses;
            LOC += fileLOC = file.source.length;
            fileCoverage = (fileHits / fileSLOC) * 100;

            print('   | ' + contrib.rpad(name, 40));
            print(' | ' + contrib.lpad(fileCoverage.toFixed(2), 8));
            print(' | ' + contrib.lpad(fileLOC, 4));
            print(' | ' + contrib.lpad(fileSLOC, 4));
            print(' | ' + contrib.lpad(fileMisses, 6));
            print(' |\n');
        }
    }

    coverage = (totalHits / SLOC) * 100;

    // summary
    print(sep);
    print('     ' + contrib.rpad('', 40));
    print(' | ' + contrib.lpad(coverage.toFixed(2), 8));
    print(' | ' + contrib.lpad(LOC, 4));
    print(' | ' + contrib.lpad(SLOC, 4));
    print(' | ' + contrib.lpad(totalMisses, 6));
    print(' |\n');
    print(lastSep);

    // print source of files with counters
    if (argv.verbose) {
        for (var name in cov) {
            if (cov.hasOwnProperty(name)) {
                print('\n   [bold]{' + name + '}:\n');
                printSource(cov[name]);
                print('\n');
            }
        }
    }
}

function xmlDecode(line) {
    var escaped_one_to_xml_special_map = {
        '&amp;': '&',
        '&quot;': '"',
        '&lt;': '<',
        '&gt;': '>'
    };

    return line.replace(/(&quot;|&lt;|&gt;|&amp;)/g,
        function(str, item) {
            return escaped_one_to_xml_special_map[item];
    });
}

function printSource(file) {
    var lineNumberWidth = file.source.length.toString().length;
    var max = _(file).chain().filter(function(value, key) { return key > 0; }).max().value();
    var hitNumberWidth = max.toString().length;

    for (var line in file.source) {
        print('\n     ' + contrib.lpad(++line, lineNumberWidth) + ' | ');

        if (file[line] === 0) {
            // highlight missed lines
            print('[red]{' + contrib.lpad(0, hitNumberWidth) + '} | ');
            file.source[line-1] = '[redback]{' + file.source[line - 1] + '}';
        }
        else {
            print('[green]{' + contrib.lpad(file[line] || ' ' , hitNumberWidth) + '} | ');
        }

        print(xmlDecode(file.source[line - 1]));
    }
}

if (typeof module == "object" && typeof require == "function") {
    exports.cli = cli;
}
if (module === require.main) {
    cli();
}

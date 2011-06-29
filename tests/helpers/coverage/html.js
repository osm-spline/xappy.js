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

    print('<html><head><style type="text/css"> \
        .source { white-space: pre; font-family: monospace; padding-left: 20px; } \
        .line { font-size: 1em; width: 50px; font-family: monospace; } \
        .source .comment { color: #998; font-style: italic } \
        .source .keyword, .source .javascript .title, .source .subst { color: #000; font-weight: bold } \
        .source .number, .source .hexcolor { color: #40a070 } \
        .source .string, .source .attribute .value { color: #d14 } \
        .source .title, .source .id { color: #900; font-weight: bold } \
        .source .literal { color: #00a8c9; } \
        .source .javascript .title, .source .subst { font-weight: normal } \
        .source .class .title { color: #458; font-weight: bold } \
        .source .tag, .source .tag .title { color: #000080; font-weight: normal } \
        .source .attribute, .source .variable, .source .instancevar { color: #008080 } \
        .source .regexp { color: #009926 } \
        .source .class { color: #458; font-weight: bold } \
        .source .symbol { color: #990073 } \
        .source .builtin, .source .built_in { color: #0086b3 } \
        .source .pi, .source .doctype, .source .shebang, .source .cdata { color: #999; font-weight: bold } \
        .zero { background: red; } \
        .zero, .zero * { color: white !important; } \
        </style></head><body>');

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
        var hljs = require(__dirname + "/highlight.js").hljs;
        require(__dirname + "/javascript.js").lang(hljs);
        hljs.initialize();

        for (var name in cov) {
            if (cov.hasOwnProperty(name)) {
                print('<h1>' + name + '</h1>');
                printSource(hljs, cov[name]);
            }
        }
    }

    print('</body></html>');
}

function printSource(hljs, file) {
    print('<table style="border-spacing: 0px;">');

    var source = file.source.join('\n');
    source = hljs.highlight('javascript', source).value.replace(/&amp;/g, '&');
    file.source = source.split('\n');

    print('<tr><td valign="top"><div class="line">');

    for (i = 1; i <= file.source.length; i++) {
        print(i + '<br>');
    }

    print('</div></td><td valign="top"><div class="line" style="color: green;">');

    for (i = 1; i <= file.source.length; i++) {
        if (file[i] === 0) {
            // highlight missed lines
            print('<span style="color: red;">0</span>');
        }
        else {
            print(file[i] || '');
        }
        print('<br>');
    }

    print('</div></td><td class="source" valign="top">');

    for (i = 0; i < file.source.length; i++) {
        if (file[i+1] === 0) {
            print('<span class="zero">');
        }

        print(file.source[i]);
        print('<br>');

        if (file[i+1] === 0) {
            print('</span>');
        }
    }

    print('</td></tr></table>');
}

if (typeof module == "object" && typeof require == "function") {
    exports.cli = cli;
}
if (module === require.main) {
    cli();
}

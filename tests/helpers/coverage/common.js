var path = require('path'),
fs = require('fs'),
_ = require('underscore');

function getCoverageFile() {
    return path.join(path.dirname(__filename),
                     '..', '..', '..', 'coverage.json');
}

function getCoverageData(filename) {
    var file = filename ? filename : getCoverageFile();
    var data = fs.readFileSync(file);
    return JSON.parse(data);
}

function sumCoverage(data, val) {
    return _(data).chain()
        .filter(function(value, key) { return val == (value > 0); })
        .filter(function(value, key) { return !_.isArray(value); })
        .size().value();
}

module.exports = {
    getCoverageData: getCoverageData,
    sumCoverage: sumCoverage
};

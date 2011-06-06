var path = require('path'),
fs = require('fs');

function getCoverageFile() {
    return path.join(path.dirname(__filename),
                     '..', '..', '..', 'coverage.json');
}

function getCoverageData() {
    var file = getCoverageFile();
    var data = fs.readFileSync(file);
    return JSON.parse(data);
}

module.exports = {
    getCoverageData: getCoverageData,
};

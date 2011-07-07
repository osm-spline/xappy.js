var path = require('path');
var fs = require('fs');

function readAbsJson(absPath, cb) {
    fs.readFile(absPath, function (err, dat) {
        if (err) {
            cb('Error while reading file ' + absPath, null);
        } else {
            var config = null;
            var error = null;
            try {
                config = JSON.parse(dat);
            }
            catch (e) {
                error = 'Error parsing the config file';
            }
            cb(error, config);
        }
    });
}

function readRelJson(relPath, cb) {
    var absPath = path.resolve(__dirname, '..', relPath);
    readAbsJson(absPath, cb);
}

if (typeof module === 'object' && typeof require === 'function') {
    exports.readAbsJson = readAbsJson;
    exports.readRelJson = readRelJson;
}

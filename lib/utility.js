var path = require('path');
var fs = require('fs');

function readAbsConfig(absPath, cb) {
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

function readRelConfig(relPath, cb) {
    var absPath = path.resolve(__dirname, '..', relPath);
    readAbsConfig(absPath, cb);
}

if (typeof module === 'object' && typeof require === 'function') {
    exports.readAbsJson = readAbsJson;
    exports.readRelJson = readRelJson;
}

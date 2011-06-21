var path = require('path');
var fs = require('fs');


function readRelConfig(relPath, cb) {
    var absPath = path.resolve(__dirname, '..',  relPath);
    readAbsConfig(absPath, cb);
}
function readAbsConfig(absPath, cb) {
    fs.readFile(absPath, function(err, dat) {
        if (err) {
            cb('Error while reading file ' + absPath, null);
        }
        else {
            var config = null;
            error = null;
            try {
                config = JSON.parse(dat);
            }
            catch(e) {
                error = 'Error parsing the config file';
            }
            cb(error, config);
        }
    });
}

if (typeof module == "object" && typeof require == "function") {
    exports.readAbsConfig = readAbsConfig;
    exports.readRelConfig = readRelConfig;
}

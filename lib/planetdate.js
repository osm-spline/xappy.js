var fs = require('fs');
var utility = require('./utility');
var readRelJson = utility.readRelJson;

function PlanetDate(planetPath, cb) {
    readRelJson(planetPath, function(err, json) {
        if (err) {
            cb(err, null);
        } else {
            cb(null, returnLatestJSON(planetPath, json.planetdate));
        }
    });
}

function returnLatestJSON(planetPath, planetDate) {
    modified(planetPath, function() {
        console.log('modified');
        readRelJson(planetPath, function(err, json) {
            if (!err) {
                console.log('received update %j', json);
                planetDate = json.planetdate;
            } else {
                console.log('Error reading planetdate: %j', err);
            }
        });
    });

    this.get = function() {
        return planetDate;
    }

    return this;
}

function modified(p, cb) {
    fs.watchFile(p, function(curr, prev) {
        var modified = curr.mtime.getTime() != prev.mtime.getTime()
        if (modified) cb();
    });
}

if (typeof module === 'object' && typeof require === 'function') {
    exports.PlanetDate = PlanetDate;
}

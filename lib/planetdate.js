var fs = require('fs');
var utility = require('./utility');
var readAbsJson = utility.readAbsJson;

function PlanetDate(planetPath, cb) {
    readAbsJson(planetPath, function(err, json) {
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
        readAbsJson(planetPath, function(err, json) {
            if (!err) {
                console.log('received update %j', json);
                planetDate = json.planetdate;
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

// var p = '/Users/Mark/Documents/osm/xappy/etc/planetdate.json';
// PlanetDate(p, function(err, planet) {
//     setInterval(function() {
//         console.log(planet.get());
//     }, 100);
// });

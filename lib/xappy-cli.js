var argv = require('optimist').argv;
var _ = require('underscore')._;
var Xappy = require('./xappy').Xappy;
var path = require('path');
var utility = require('./utility');
var log4js = require('log4js')();
var log = log4js.getLogger('xappy-cli');

var DEFAULT_CONFIG = {
    host: 'localhost',
    port: 8080,
    loglevel: 'ERROR',
    database:  'pg://osm@localhost/osm',
    copyright: '2011 OpenStreetMap constributers',
};

function cli() {
    argv.help? showUsage() : init();
}

function showUsage() {
   console.log("xappy usage");
   console.log("  --config      path to a json config");
   console.log("  --database    database credentials");
   console.log("  --port        listening port for xappy");
   console.log("  --host        listening host for xappy");
   console.log("  --loglevel");
}

function init() {
    var extAsync = argv.config? getExternalConfig : emptyExternal;
    extAsync(function(err, external) {
        if (err) {
            console.log(err);
        } else {
            var config =  merge(DEFAULT_CONFIG, external, getConfigFromFlags());
            log4js.setGlobalLogLevel(config.loglevel);
            console.log("start xappy with %j", config);
            Xappy(config);
        }
    });
}

function emptyExternal(cb) {
    cb(null, {});
}

function getExternalConfig(cb) {
    var externalConfigPath = path.resolve(argv.config);
    utility.readAbsConfig(externalConfigPath, cb);
}

function getConfigFromFlags() {
    var config = {};
    if (argv.database) { config.database = argv.database; }
    if (argv.port) { config.port = argv.port; }
    if (argv.host) { config.host = argv.host; }
    if (argv.loglevel) { config.loglevel = argv.loglevel; }
    return config;
}

// merges the attributes, obj_(n+1) has priority over obj_n
function merge () {
    var merged = {};
    _.each(arguments, function(obj) {
        for (attrname in obj) { merged[attrname] = obj[attrname]; }
    });
    return merged;
}

if (typeof module == "object" && typeof require == "function") {
    exports.cli = cli;
}
if (module === require.main) {
    cli();
}

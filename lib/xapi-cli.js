var argv = require('optimist').argv;
var path = require('path');
var fs = require('fs');
var _ = require('underscore')._;
var Xapi = require('./xapi.js').Xapi;

var DEFAULT_CONFIG = {
    connectionString:  'pg://osm@localhost/osm',
    port: 8080,
    host: 'localhost',
    loglevel: 'ERROR',
    version: 0.6,
    copyright: '2011 OpenStreetMap constributers',
    instance: 'node xapi',
    namespace: 'http://localhost/xapi/0.6'
};

function cli() {
    if (argv.help) {
        showUsage();
    } else {
        init();
    }
}

function showUsage() {
   console.log("xapi usage");
   console.log("  --config            path to a json config");
   console.log("  --connectionString  database credentials");
   console.log("  --port              listening port for xapi");
   console.log("  --host              listening host for xapi");
   console.log("  --loglevel");
}

function init() {
    var external = argv.config? getExternalConfig() : {};
    var config =  merge(DEFAULT_CONFIG, external, getConfigFromFlags());
    Xapi(config).init();
}

function getExternalConfig() {
    return JSON.parse(fs.readFileSync(externalConfigPath()));
}

function externalConfigPath() {
    return path.resolve(argv.config);
}

function getConfigFromFlags() {
    var config = {};
    if (argv.connectionString) { config.connectionString = argv.connectionString; }
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

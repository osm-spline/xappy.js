var argv = require('optimist').argv;
var _ = require('underscore')._;
var createXappy = require('./xappy').createXappy;
var path = require('path');
var utility = require('./utility');
var log4js = require('log4js');
var log = log4js.getLogger('xappy-cli');

var DEFAULT_CONFIG = {
    host: 'localhost',
    port: 8080,
    loglevel: 'ERROR',
    database: 'pg://osm@localhost/osm',
    copyright: '2011 OpenStreetMap constributors',
    planetJson: 'etc/planetdate.json',
    xapiVersion: 0.6,
    xappyVersion: 0.2
};

function cli() {
    if (argv.help) {
        showUsage();
    } else {
        init();
    }
}

function showUsage() {
   log.debug('xappy usage');
   log.debug('  --config      path to a json config');
   log.debug('  --database    database credentials');
   log.debug('  --port        listening port for xappy');
   log.debug('  --host        listening host for xappy');
   log.debug('  --loglevel');
}

function init() {
    var extAsync = argv.config ? getExternalConfig : emptyExternal;
    extAsync(function (err, external) {
        if (err) {
            log.debug(err);
        } else {
            var config =  merge(DEFAULT_CONFIG, external, getConfigFromFlags());
            log4js.setGlobalLogLevel(config.loglevel);
            createXappy(config);
        }
    });
}

function emptyExternal(cb) {
    cb(null, {});
}

function getExternalConfig(cb) {
    var externalConfigPath = path.resolve(argv.config);
    utility.readAbsJson(externalConfigPath, cb);
}

function getConfigFromFlags() {
    var config = {};
    if (argv.database) {
        config.database = argv.database;
    }
    if (argv.port) {
        config.port = argv.port;
    }
    if (argv.host) {
        config.host = argv.host;
    }
    if (argv.loglevel) {
        config.loglevel = argv.loglevel;
    }
    return config;
}

// merges the attributes, obj_(n+1) has priority over obj_n
// TODO use _.extend
function merge () {
    var values = _.values(arguments);
   return _.reduce(values, function(memo, v) {
        return _.extend(memo, v);
    }, {});
}

if (typeof module === 'object' && typeof require === 'function') {
    exports.cli = cli;
}

if (module === require.main) {
    cli();
}

#!/usr/bin/env node

var argv = require('optimist').argv;
var path = require('path');
var fs = require('fs');

function cli() {
    if (argv.help) {
        showUsage();
    } else {
        init();
    }
}

function showUsage() {
    console.log("usage message");
}

function init() {
    var config = argv.config? getCustomConfig() : getConfigFromFlags();
    console.log("Initialize with " + JSON.stringify(config));
}

function getCustomConfig() {
    return JSON.parse(fs.readFileSync(customConfigPath()));
}

function customConfigPath() {
    return path.resolve(argv.config);
}

function getConfigFromFlags() {
    var config = {};
    config.connectionString = argv.connectionString? argv.connectionString : 'pg://osm@localhost/osm';
    config.port = argv.port? argv.port : 8080;
    config.host = argv.host? argv.host : "localhost";
    config.loglevel = argv.loglevel? argv.loglevel : "ERROR";
    config.version = 0.6;
    config.copyright = "2011 OpenStreetMap constributers";
    config.instance = "node xapi";
    config.namespace = "http://" + config.host + "/xapi/" + config.version;
    return config;
}

if (typeof module == "object" && typeof require == "function") {
    exports.cli = cli;
}

#!/usr/bin/env node

var argv = require('optimist').argv;
var path = require('path');
var fs = require('fs');

var REL_PATH_DEFAULT_CONFIG = '../etc/config.json';

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
    var config = argv.config? getCustomConfig() : getDefaultConfig();
    var updatedConfig = updateConfigFromFlags(config);
    console.log("Initialize with: " + JSON.stringify(updatedConfig));
}

function getCustomConfig() {
    return JSON.parse(fs.readFileSync(customConfigPath()));
}

function customConfigPath() {
    return path.resolve(argv.config);
}

function getDefaultConfig() {
    return getConfigFromPath(defaultConfigPath());
}

function getConfigFromPath(path) {
    return JSON.parse(fs.readFileSync(path));
}

function defaultConfigPath() {
    pathToJsFile = process.argv[1];
    var dirNameOfJsFile = path.dirname(pathToJsFile);
    var configPath = REL_PATH_DEFAULT_CONFIG;
    var absolutePathToConfig = path.resolve(dirNameOfJsFile, configPath); 
    return absolutePathToConfig;
}

function updateConfigFromFlags(config) {
    if (argv.port) config.port = argv.port;
    if (argv.host) config.host = argv.host;
    if (argv.loglevel) config.loglevel = argv.loglevel;
    config.namespace = "http://" + config.host + "/xapi/" + config.version;
    return config;
}

if (typeof module == "object" && typeof require == "function") {
    exports.cli = cli;
}

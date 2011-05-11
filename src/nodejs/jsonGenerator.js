var config;

//var builder = require('xmlbuilder');

//set up logger
var log4js = require('log4js')(); //note the need to call the function
//log4js.addAppender(log4js.fileAppender('osm-xapi.log'), 'cheese');

var log = log4js.getLogger('jsonGenerator');
// TODO how to get log level from main's config?



exports.createNode = function (node) {
    log.debug(node);
    var x = JSON.stringify(node);
    return x;
};

// vim:set ts=4 sw=4 expandtab foldmethod=marker: autofold

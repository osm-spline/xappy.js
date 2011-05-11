var config;

//set up logger
var log4js = require('log4js')(); //note the need to call the function
//log4js.addAppender(log4js.fileAppender('osm-xapi.log'), 'cheese');

var log = log4js.getLogger('jsonGenerator');
// TODO how to get log level from main's config?



exports.createJson = function (node) {
    log.debug(node);
    return JSON.stringify(node);
};

// vim:set ts=4 sw=4 expandtab foldmethod=marker: autofold

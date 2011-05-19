var log4js = require('log4js')();
var log = log4js.getLogger('jsonGenerator');

exports.createJson = function (node) {
    log.debug(node);
    return JSON.stringify(node);
};

// vim:set ts=4 sw=4 expandtab foldmethod=marker: autofold

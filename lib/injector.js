var defaults = {
    // our modules
    'database' : require('./postgresdb/postgresdb.js').PostgresDb,
    'requestParser' : require('./parser/request'),
};

/**
 * Dropin Repalcemnt for the build in require, if requiered module doesn't 
 * exists the plain old require is called.
 *
 * @param moduleName name of the module or implementation binding
 * @return module or object (if bound this way)
 */

exports.require = function (moduleName) {

    if (defaults[moduleName] == undefined) {
        return require(moduleName);
    }

    return defaults[moduleName];
};

exports.getImplementations = function () {
    return defaults;
};

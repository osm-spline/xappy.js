var defaults = {
    'database' : require('./postgresdb/postgresdb.js')
};

exports.require = function (moduleName) {
    return defaults[moduleName];
};

exports.getImplementations = function () {
    return defaults;
};

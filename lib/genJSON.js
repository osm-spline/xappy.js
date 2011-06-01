
var JSONGenerator = function JSONGenerator() {
};

module.exports.JSONGenerator = JSONGenerator;


function genjson(type, elem) {
    return JSON.stringify(elem);
};

JSONGenerator.prototype.createNode = genjson;
JSONGenerator.prototype.createWay = genjson;
JSONGenerator.prototype.createRelation = genjson;

JSONGenerator.prototype.createHeader = function() {
    return "{";
};

JSONGenerator.prototype.createFooter = function() {
    return "}";
};

// vim:set ts=4 sw=4 expandtab:

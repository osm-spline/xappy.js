var config = {
	"uri" : "XXX",
	"planetDate" : "XXX",
	"copyright" : "XXX",
	"instance" : "XXX"
};

var JSONGenerator = function JSONGenerator() {
};

function genjson(type, elem) {
    elem.changeset = elem.changesetId; // XXX This ugs the ugly - but is neccessary
    delete elem.changesetId;  // because of our internal naming scheme
    elem.type = type;
    return JSON.stringify(elem);
}

JSONGenerator.prototype.create = genjson;

JSONGenerator.prototype.createHeader = function() {
    return '{"version":0.6,"generator":"xappy.js","xapi":{"uri":"'+
        config.uri+'","planetDate":"'+config.planetDate+'","copyright":"'+
        config.copyright+'","instance":"'+config.instance+'"},"elements":[';  //TODO
};

JSONGenerator.prototype.createFooter = function() {
    return "]}";
};

JSONGenerator.prototype.contentType = 'application/json';

module.exports.JSONGenerator = JSONGenerator;

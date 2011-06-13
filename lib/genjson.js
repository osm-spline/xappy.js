
var config = {
	"uri" : "XXX",
	"planetDate" : "XXX",
	"copyright" : "XXX",
	"instance" : "XXX"
}

var JSONGenerator = function JSONGenerator() {
};

module.exports.JSONGenerator = JSONGenerator;


function genjson(type, elem) {
    elem.type = type;
    return JSON.stringify(elem);
};

JSONGenerator.prototype.create = genjson;

JSONGenerator.prototype.createHeader = function() {
    return '{"version":0.6,"generator":"xappy.js","xapi":{"uri":"'+
		config.uri+'","planetDate":"'+config.planetDate+'","copyright":"'+
		config.copyright+'","instance":"'+config.instance+'"},"elements":[';  //TODO
};

JSONGenerator.prototype.createFooter = function() {
    return "]}";
};

var JSONGenerator = function JSONGenerator(config) {
    this.version = config.version;
    this.copyright = config.copyright;
    this.planetDate = config.planetDate;
    this.generator = config.generator;
    this.uri = config.uri;

};

function genjson(type, elem) {
    elem.type = type;
    return JSON.stringify(elem);
}

JSONGenerator.prototype.create = genjson;

JSONGenerator.prototype.createHeader = function() {
    return '{"version":'+this.version+',"generator":"'+this.generator+'","xapi":{"uri":"'+
        this.uri+'","planetDate":"'+this.planetDate+'","copyright":"'+
        this.copyright+'"},"elements":[';  //TODO
};

JSONGenerator.prototype.createFooter = function() {
    return "]}";
};

JSONGenerator.prototype.contentType = 'application/json';

module.exports.JSONGenerator = JSONGenerator;

var builder = require('xmlbuilder');
var log4js = require('log4js');
var log = log4js.getLogger('genXML');
var _ = require('underscore');

var XmlGenerator = function XmlGenerator(config) {
    this.version = config.version;
    this.generator = config.generator;
    this.copyright = config.copyright;
    this.planetDate = config.planetDate;
};

module.exports.XmlGenerator = XmlGenerator;

function genxml(type, elem) {
			var doc = builder.create()
    var xmlelem = doc.begin(type);
    var prop;
    for (prop in elem) {

        if(prop === 'tags') {
            elem[prop].forEach(function(tuple){
                xmlelem.ele('tag')
                    .att('k', tuple.key)
                    .att('v', tuple.value);
            });

        // ways have nodes
        } else if (prop === 'nodes') {
            _.each(elem[prop], function(elem){
                xmlelem.ele('nd')
                .att('ref', elem);
            });

        // relations have members
        } else if (prop === 'members') {
            elem[prop].forEach(function(member){
                xmlelem.ele('member')
                .att('type', member.type)
                .att('ref', member.reference)
                .att('role', member.role);
            });

        } else {
            xmlelem.att(prop, elem[prop]);
        }
    }
    return doc.toString();
}

XmlGenerator.prototype.create = genxml;

XmlGenerator.prototype.createHeader = function () {
    var header = '<?xml version="1.0" standalone="no"?>';
	 var doc = builder.create()
    var tmp = doc.begin('osm')
        .att('version', this.version)
        .att('generator', this.generator)
        .att('xapi:planetDate', this.planetDate)
        .att('xapi:copyright', this.copyright);

    header = header + tmp.toString();
    return header.substr(0, header.length - 2) + '>';

};

XmlGenerator.prototype.createFooter = function () {
    return '</osm>';
};

XmlGenerator.prototype.contentType = 'application/xml';

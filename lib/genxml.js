var builder = require('xmlbuilder');
var log4js = require('log4js')();
var log = log4js.getLogger('genXML');
var _ = require('underscore');

var XmlGenerator = function XmlGenerator(config) {
    this.version = config.version;
    this.generator = config.generator;
    this.namespace = config.namespace;
    this.copyright = config.copyright;
    this.instance = config.instance;
};

module.exports.XmlGenerator = XmlGenerator;

function genxml(type, elem) {
    var xmlelem = builder.begin(type);
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

    return builder.toString();
};

XmlGenerator.prototype.create = genxml;

XmlGenerator.prototype.createHeader = function(uri, planetDate) {
    var header = '<?xml version="1.0" standalone="no"?>';
    var tmp = builder.begin('osm')
        .att('version', this.version)
        .att('generator', this.generator)
        //.att('xmlns:xapi', this.namespace)
        .att('xapi:uri', uri)
        .att('xapi:planetDate', planetDate)
        .att('xapi:copyright', this.copyright)
        //.att('xapi:instance', this.instance);

    header = header + tmp.toString();
    log.debug(header);
    return header.substr(0,header.length-2) + '>';

};

XmlGenerator.prototype.createFooter = function() {
    return "</osm>";
};

// vim:set ts=4 sw=4 expandtab:

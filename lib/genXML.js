var xmlnsxapi = 'xmlns:xapi';
var xapiuri = 'xapi:uri';
var xapiplanetDate = 'xapi:planetDate';
var xapicopyright = 'xapi:copyright';
var xapiinstance = 'xapi:instance';

var config = {
    'version': '0.6',
    'generator': 'xapi: OSM Extended API',
    xmlnsxapi: '<nowiki>http://www.informationfreeway.org/xapi/0.6</nowiki>',
    xapiuri: '/api/0.6/node[amenity=hospital]',
    xapiplanetDate: '200803150826',
    xapicopyright: '2008 OpenStreetMap contributors',
    xapiinstance: 'zappy2'
};

var builder = require('xmlbuilder');
var log4js = require('log4js')();
var log = log4js.getLogger('genXML');

var XmlGenerator = function XmlGenerator() {};
module.exports.XmlGenerator = XmlGenerator;

function genxml(type, elem) {
    var xmlelem = builder.begin(type);

    for (var prop in elem) {
        //log.trace(typeof(elem[prop]) + ": " + prop + " " + elem[prop]);

        if(prop == 'tags') {
            elem[prop].forEach(function(tuple){
                xmlelem.ele('tag')
                .att('k', tuple.key)
                .att('v', tuple.value);
            });

        // ways have nodes
        } else if(prop == 'nodes') {
            elem[prop].forEach(function(elem){
                xmlelem.ele('nd')
                .att('ref', elem.id);
            });

        // relations have members
        } else if(prop == 'members') {
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

XmlGenerator.prototype.createNode = genxml;
XmlGenerator.prototype.createWay = genxml;
XmlGenerator.prototype.createRelation = genxml;

XmlGenerator.prototype.createHeader = function() {
    var header = "<?xml version='1.0' standalone='no'?>";
    var tmp = builder.begin('osm')
        .att('version', config.version)
        .att('generator',config.generator)
        .att('xmlns:xapi',config.xmlnsxapi)
        .att('xapi:uri',config.xapiuri)
        .att('xapi:planetDate',config.xapiplanetDate)
        .att('xapi:copyright',config.xapicopyright)
        .att('xapi:instance',config.xapiinstance);

    header = header + tmp.toString();
    log.debug(header);
    return header.substr(0,header.length-2) + " >";

};

XmlGenerator.prototype.createFooter = function() {
    return "</osm>";
};

// vim:set ts=4 sw=4 expandtab:

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


var _ = require('underscore');

var builder = require('xmlbuilder');
//set up logger
var log4js = require('log4js')(); //note the need to call the function
//log4js.addAppender(log4js.fileAppender('osm-xapi.log'), 'cheese');

var log = log4js.getLogger('xmlGenerator');
// TODO how to get log level from main's config?

var XmlGenerator = function XmlGenerator() {
};// Konstruktor(Protoyp)

module.exports.XmlGenerator = XmlGenerator;

XmlGenerator.prototype.createNode = function (node) {
    log.debug(node);
    var xmlNode = builder.begin('node')
        .att('id', node.id)
        .att('lat', node.lat)
        .att('lon', node.lon);
        if (node.version){
            xmlNode.att('version', node.version);
        }
        if (node.uid){
            xmlNode.att('uid', node.uid);
        }
        if (node.user){
            xmlNode.att('user', node.user);
        }
        if (node.changesetId){
            xmlNode.att('changesetId', node.changesetId);
        }
        if (node.timestamp){
            xmlNode.att('timestamp', node.timestamp);
        }

    if(node.tags) {
        node.tags.forEach(function(tuple){
            xmlNode.ele('tag')
            .att('k', tuple.key)
            .att('v', tuple.value);
        });
    }
    return builder.toString();
};

// FIXME: make this shit working
XmlGenerator.prototype.createWay = function (row) {
    var i;
    var xmlWay = builder.begin('way')
        .att('id', row.id);
        if (row.version){
            xmlWay.att('version', row.version);
        }
        if (row.uid){
            xmlWay.att('uid', row.uid);
        }
        if (row.user){
            xmlWay.att('user', row.user);
        }
        if (row.changesteId){
            xmlWay.att('changesetId', row.changesetId);
        }
        if (row.timestamp){
            xmlWay.att('timestamp', row.timestamp);
        }

        row.nodes.forEach(function(node){
            xmlWay.ele('nd')
            .att('ref', node.id);
        });
        
        if(row.tags) {
            row.tags.forEach(function(tuple){
                xmlWay.ele('tag')
                .att('k', tuple.key)
                .att('v', tuple.value);
            });
        }

    //temp = row.nodes.replace("{","").replace("}","").split(",");
    //for(var i=0;i<temp.length;i++) {
    //    way.ele('nd').att('ref',temp[i]);
    //}
    return builder.toString();
};

// new
XmlGenerator.prototype.createRelation = function (row) {
    var xmlRel = builder.begin('relation')
        .att('id', row.id);
        if (row.version){
            xmlRel.att('version', row.version);
        }
        if (row.uid){
            xmlRel.att('uid', row.uid);
        }
        if (row.user){
            xmlRel.att('user', row.user);
        }
        if (row.changesteId){
            xmlRel.att('changesetId', row.changesetId);
        }
        if (row.timestamp){
            xmlRel.att('timestamp', row.timestamp);
        }

        if(row.tags) {
            row.tags.forEach(function(tuple){
                xmlRel.ele('tag')
                .att('k', tuple.key)
                .att('v', tuple.value);
            });
        } 

        row.members.forEach(function(member){
            xmlRel.ele('member')
            .att('type', member.type)
            .att('ref', member.reference)
            .att('role', member.role);
        });

    return builder.toString();
};

//header for xml response with information about xapi instance...
XmlGenerator.prototype.createHeader = function createHeader() {

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
    return header.substr(0,header.length-2) + " >";

};

 // vim:set ts=4 sw=4 expandtab:

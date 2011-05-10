var config;

var builder = require('xmlbuilder');
//set up logger
var log4js = require('log4js')(); //note the need to call the function
//log4js.addAppender(log4js.fileAppender('osm-xapi.log'), 'cheese');

var log = log4js.getLogger('xmlGenerator');
// TODO how to get log level from main's config?

exports.createNode = function (node) {
    log.debug(node);
    var xmlNode = builder.begin('node')
    .att('id', node.id)
    .att('timestamp', node.timestamp)
    .att('version', node.version)
    .att('changeset', node.changeset)
    .att('lat', node.lat)
    .att('lon', node.lon);

    if(node.tags) {
        node.tags.forEach(function(tuple){
            xmlNode.ele('tag')
            .att('k',escape(tuple.key))
            .att('v',escape(tuple.value));
        });
    }
    return builder.toString({ pretty: true });
};

// FIXME: make this shit working
exports.createWay = function (row) {
    var xmlWay = builder.begin('way')
        .att('id', row.id)
        .att('timestamp', row.timestamp)
        .att('version', row.version)
        .att('changeset', row.changeset);

    if(row.tags) {
        row.tags.forEach(function(tuple){
            xmlWay.ele('tag')
            .att('k',escape(tuple.key))
            .att('v',escape(tuple.value));
        });
    }

    //temp = row.nodes.replace("{","").replace("}","").split(",");
    //for(var i=0;i<temp.length;i++) {
    //    way.ele('nd').att('ref',temp[i]);
    //}
    return builder.toString({pretty:'true'});
};

//header for xml response with information about xapi instance...
exports.createHeader = function createHeader() {
    var header = "<?xml version='1.0' standalone='no'?>";
    var tmp = builder.begin('osm')
        .att('version',this.config.version)
        .att('generator',this.config.generator)
        .att('xmlns:xapi',this.config.namespace)
        .att('xapi:uri','')
        .att('xapi:planetDate','')
        .att('xapi:copyright',this.config.copyright)
        .att('xapi:instance',this.config.instance);
    header = header + tmp.toString();
    return header.substr(0,header.length-2) + " >";
}

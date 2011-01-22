var config = require('./config.json');

var builder = require('xmlbuilder');
//set up logger
var log4js = require('log4js')(); //note the need to call the function
//log4js.addAppender(log4js.fileAppender('osm-xapi.log'), 'cheese');

var log = log4js.getLogger('xmlGenerator');
log.setLevel(config.logLevel);

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
    var way = builder.begin('way')
        .att('id', row.id)
        .att('timestamp', toISO8601(row.tstamp))
        .att('version', row.version)
        .att('changeset', row.changeset_id);
    if(row.tags != '{}') {
        temp = row.tags.replace("{","").replace("}","").split(",");
        for(var x=0;x<temp.length;x=x+2){
            way.ele('tag')
                .att('k',escape(temp[x]))
                .att('v',escape(temp[x+1]));
        }
    }
    temp = row.nodes.replace("{","").replace("}","").split(",");
    for(var i=0;i<temp.length;i++) {
        way.ele('nd').att('ref',temp[i]);
    }
    return builder.toString({pretty:'true'});
};


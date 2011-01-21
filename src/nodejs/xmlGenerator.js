var config = require('./config.json');

var builder = require('xmlbuilder');
//set up logger
var log4js = require('log4js')(); //note the need to call the function
//log4js.addAppender(log4js.fileAppender('osm-xapi.log'), 'cheese');

var log = log4js.getLogger('xmlGenerator');
log.setLevel(config.logLevel);

function toISO8601(date) {
    //2007-03-31T00:09:22+01:00
    var pad_two = function(n) {
        return (n < 10 ? '0' : '') + n;
    };

    return [
        date.getUTCFullYear(),
        '-',
        pad_two(date.getUTCMonth() + 1),
        '-',
        pad_two(date.getUTCDate()),
        'T',
        pad_two(date.getUTCHours()),
        ':',
        pad_two(date.getUTCMinutes()),
        ':',
        pad_two(date.getUTCSeconds()),
        '+01:00'	//FIX ME
            ].join('');
}

exports.createNode = function (row) {
    log.debug(row);
    var node = builder.begin('node')
        .att('id', row.id)
        .att('timestamp', toISO8601(row.tstamp))
        .att('version', row.version)
        .att('changeset', row.changeset_id)
        .att('lat', row.lat)
        .att('lon', row.lon);
    if(row.tags != '{}') {
        var temp = row.tags.replace("{","").replace("}","").split(",");
        for(var x=0;x<temp.length;x=x+2){
            node.ele('tag')
                .att('k',escape(temp[x]))
                .att('v',escape(temp[x+1]));
        }
    }
    return builder.toString({ pretty: true });
};

exports.createWay = function (row) {
    var temp;
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


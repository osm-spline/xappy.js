var clutch = require('clutch');
var pg = require('pg');
var builder = require('xmlbuilder');

// load config
var config = require('./config.json');
process.argv.forEach(
    function (val,index, array){
        if(val=="-c"){
            path = array[index+1];
            if( path[0] != '/'){
                path = __dirname + '/' + path;
            }
            config = require(path);
        }
    });
var connectionString = config['connectionString'];

//set up logger
var log4js = require('log4js')(); //note the need to call the function
//log4js.addAppender(log4js.fileAppender('osm-xapi.log'), 'cheese');

var logger = log4js.getLogger('global');
logger.setLevel('ALL');


var log = log4js.getLogger('global');
log.setLevel('ALL');

log.info("server starting...");

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
        '+01:00'    //FIX ME
    ].join('');
}

function createWayBboxQuery(key, value, left, bottom, right, top) {
    return "SELECT id,tstamp,version,changeset_id, nodes, user_id, hstore_to_array(tags) as tags FROM ways WHERE (tags @> hstore('" + key + "','" + value + "') AND linestring && st_setsrid(st_makebox2d(st_setsrid(st_makepoint(" +
    left + "," + bottom + "),4326), st_setsrid(st_makepoint(" + right + "," + top + "),4326)),4326));";
}

function createNodeBboxQuery(key, value, left, bottom, right, top) {
    return "SELECT id, user_id,tstamp,version,changeset_id, hstore_to_array(tags) as tags, X(geom) as lat, Y(geom) as lon FROM nodes WHERE (tags @> hstore('" + key + "','" + value + "') AND geom && st_setsrid(st_makebox2d(st_setsrid(st_makepoint(" +
    left + "," + bottom + "),4326), st_setsrid(st_makepoint(" + right + "," + top + "),4326)),4326));";
}

function createNodesForWayQuery(nodes) {
    return "SELECT id, tstamp, version, changeset_id, hstore_to_array(tags) as tags, X(geom) as lat, Y(geom) as lon FROM nodes WHERE id = ANY('" + nodes + "');";
}

function nodeWorldHandler(req, res, key, value) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(' key:' +key +' value:'+value+'\n');
}

function nodeBboxHandler(req, res, key, value, left, bottom, right, top) {
    log.error("nodeBboxHandler");
    db_connect(res, function(client) {
     log.info(createNodeBboxQuery(key, value, left, bottom, right, top));
    var success = false;
    var query = client.query(createNodeBboxQuery(key, value, left, bottom, right, top));

    query.on('error', function(err) {
        log.error(err);
        res.writeHead(404,{});
        res.end('\n');
    });

    query.on('end', function() {
        //console.log("end event\n");
        if(success) {
        res.write("</xml>");
              res.end();
        }
        else {
        //empty response
        res.writeHead(404,{});
        res.end();
        //perhaps write 404? is error also raised?
        }
    });

    query.on('row', function(row) {
        if(!success) {
        success = true;
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write("<xml>");
        }
        res.write(createXmlNode(row));
    });
    });
}

function createXmlNode(row) {
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
        for(var x=0;x<temp.length;x=x+2)
            node.ele('tag')
                .att('k',escape(temp[x]))
                .att('v',escape(temp[x+1]));
    }
    return builder.toString({ pretty: true });
}

function createXmlWay(row) {
    var way = builder.begin('way')
        .att('id', row.id)
        .att('timestamp', toISO8601(row.tstamp))
        .att('version', row.version)
        .att('changeset', row.changeset_id);
    if(row.tags != '{}') {
        var temp = row.tags.replace("{","").replace("}","").split(",");
        for(var x=0;x<temp.length;x=x+2)
            way.ele('tag')
                .att('k',escape(temp[x]))
        .att('v',escape(temp[x+1]));
    }

    var temp = row.nodes.replace("{","").replace("}","").split(",");
    for(var x=0;x<temp.length;x++) {
        way.ele('nd')
        .att('ref',temp[x]);
    }
    return builder.toString({pretty:'true'});
}

function wayWorldHandler(req, res, key, value) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
}

function connectionError(err, res) {
    log.error(err);
    log.fatal("connectionError not implemented");
}

function db_connect(res, callback) {
    pg.connect(connectionString, function(err, client) {
    if(err) {
        log.error('message');
        res.writeHead(404,{});
        res.end();
    } else {
              log.info("db connection was successfull");
        callback(client);
    }
    });
}

function wayBboxHandler(req, res, key, value, left, bottom, right, top) {
    db_connect(res, function(client) {
        var count = 0;
    var success = false;
    //console.log(createWayBboxQuery(key, value, left, bottom, right, top));
    var query = client.query(createWayBboxQuery(key, value, left, bottom, right, top));

    query.on('error', function(err) {
        log.error(err);
        res.writeHead(404,{});
        res.end();
    });

    query.on('end', function() {
        if(success) {
        if(count == 0) {
            res.write("</xml>");
            res.end();
        }
        //res.write("</xml>");
        //res.end();    //problem!!!
        }
        else {
        res.writeHead(404,{});
        res.end();
        //perhaps write 404?
        }
    });

    query.on('row', function(row) {
        if(!success) {
        success = true;
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write("<xml>");
        }
        //console.log(row);
        if(row.nodes != '{}') {
        count++;
        var subquery = client.query(createNodesForWayQuery(row.nodes));
        subquery.on('error',function(err) {});
        subquery.on('end', function() {
            count--;
            if(count==0)
            res.write("</xml>");
            res.end();
        });
        subquery.on('row', function(row) {
            res.write(createXmlNode(row));
        });

        //console.log(createNodesForWayQuery(row.nodes));
        }
            res.write(createXmlWay(row));
    });
    });
}

function relationWorldHandler(req, res, key, value) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(' key:' +key +' value:'+value+'!\n');
}

function relationBboxHandler(req, res, key, value, left, bottom, right, top) {

}

myRoutes = clutch.route404([
    //['GET /api/(\\w+)(\\[bbox=(\\d,\\d,\\d,\\d)\\])*\\[(\\w+)=(\\w+)\\]$', helloSomeone],
    ['GET /api/node\\[(\\w+)=(\\w+)\\]$',nodeWorldHandler],
    //['GET /api/node\\[(\\w+)=(\\w+)\\]\\[bbox=(\\d+(\\.\\d+)?),(\\d+),(\\d+),(\\d+)\\]$',nodeBboxHandler],
    ['GET /api/node\\[(\\w+)=(\\w+)\\]\\[bbox=(\\d+(?:\\.\\d+)?),(\\d+(?:\\.\\d+)?),(\\d+(?:\\.\\d+)?),(\\d+(?:\\.\\d+)?)\\]$',nodeBboxHandler],
    //['GET /api/node\\[(\\w+)=(\\w+)\\]\\[bbox=(\\d+\\.\\d+),(\\d+),(\\d+),(\\d+)\\]$',nodeBboxHandler],
    ['GET /api/way\\[(\\w+)=(\\w+)\\]$',wayWorldHandler],
    ['GET /api/way\\[(\\w+)=(\\w+)\\]\\[bbox=(\\d+(?:\\.\\d+)?),(\\d+(?:\\.\\d+)?),(\\d+(?:\\.\\d+)?),(\\d+(?:\\.\\d+)?)\\]$',wayBboxHandler],
    ['GET /api/relation\\[(\\w+)=(\\w+)\\]$',relationWorldHandler],
    //['GET /api/relation\\[(\\w+)=(\\w+)\\](\\[bbox=(\\d),(\\d),(\\d),(\\d)\\])$',relationBboxHandler],
]);


var http = require('http');
http.createServer(myRoutes).listen(config.port, config.host);
log.info("Started server at " + config.host + ":" + config.port );

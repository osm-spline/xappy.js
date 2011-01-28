var clutch = require('clutch');
var http = require('http');
var fs = require('fs');
var pg = require('pg');
var xmlGenerator = require('./xmlGenerator.js');
var opts = require('opts');
var osmRes = require('./response');
var log4js = require('log4js')(); 
var log = log4js.getLogger('global');
var config;

// #################### MAY be put to different module later

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

function rowToNode(row){
    var node = {
        'id' : row.id,
        'timestamp': toISO8601(row.tstamp),
        'version': row.version,
        'changeset': row.changeset_id,
        'lat' : row.lat,
        'lon' : row.lon
    };

    if(row.tags != '{}') {
        node.tags = [];
        temp = row.tags.replace("{","").replace("}","").split(",");
        for(var x=0;x<temp.length;x=x+2){
            node.tags.push({
                'key' : temp[x],
                'value' : temp[x+1]
            });
        }   
    }   
    return node;
}

//FIXME: parsing of ways is meesed up
function rowToWay(row){
    var way = {
        'id' : row.id,
        'timestamp' : toISO8601(row.tstamp),
        'version' : row.version,
        'changeset' : row.changeset_id
    };
    if(row.tags != '{}') {
        node.tags = [];
        // FIXME: something doesnt work at all
        temp = row.tags.replace("{","").replace("}","").split(",");
        for(var x=0;x<temp.length;x=x+2){
            node.tags.push({
                'k' : temp[x],
                'v' : temp[x+1]
            });
        }   
    }   
    return way;
}

// #################### MAY be put to different module later

var options = [
      { short       : 'c',
        long        : 'config',
        description : 'Select configuration file',
        value       : true
      }
];

function createWayBboxQuery(key, value, left, bottom, right, top) {
    return {
        text: 'SELECT id,tstamp,version,changeset_id,nodes,user_id,hstore_to_array(tags) as tags ' +
              'FROM ways ' +
              'WHERE ( ' +
              '    tags @> hstore($1, $2) AND ' +
              '    linestring && st_setsrid(st_makebox2d( ' +
              '        st_setsrid(st_makepoint($3, $4), 4326), ' +
              '        st_setsrid(st_makepoint($5, $6), 4326) ' +
              '    ), 4326) ' +
              ')', 
        values: [key, value, left, bottom, right, top],
        name: 'way bbox query'
    };
}

function createNodeBboxQuery(key, value, left, bottom, right, top) {
    return {
        text: 'SELECT id,user_id,tstamp,version,changeset_id,hstore_to_array(tags) as tags, X(geom) as lat, Y(geom) as lon ' +
              'FROM nodes ' +
              'WHERE ( ' +
              '    tags @> hstore($1, $2) AND ' +
              '    geom && st_setsrid(st_makebox2d( ' +
              '        st_setsrid(st_makepoint($3, $4), 4326), ' +
              '        st_setsrid(st_makepoint($5, $6), 4326) ' +
              '    ), 4326) ' +
              ')',
        values: [key, value, left, bottom, right, top],
        name: 'node bbox query'
    };
}

function createNodesForWayQuery(nodes) {
    return {
        text: 'SELECT id,tstamp,version,changeset_id,hstore_to_array(tags) as tags, X(geom) as lat, Y(geom) as lon ' +
              'FROM nodes ' +
              'WHERE (id = ANY($1))',
        values: [nodes],
        name: 'nodes for way'
    };
}

function dbConnect(res, callback) {
    pg.connect(config.connectionString, function(err, client) {
        if(err) {
            log.error(err.message);
            console.log(config.connectionString);
            console.log(err);
            res.writeHead(404,{});
            res.end();
        } else {
            log.info("db connection was successfull");
            callback(client);
        }
    });
}

function nodeWorldHandler(req, res, key, value) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(' key:' +key +' value:'+value+'\n');
}

function nodeBboxHandler(req, res, key, value, left, bottom, right, top) {
    res = osmRes.mkXmlRes(res);
    
    dbConnect(res, function(client) {
        var success = false;
        var query = client.query(createNodeBboxQuery(key, value, left, bottom, right, top));

        query.on('error', function(err) {
            res.endWith500();
        });

        query.on('end', function() {
            res.atEnd();
        });

        query.on('row', function(row) {
            var pojo = rowToNode(row);    
            res.putNode(pojo);
        });
    });
}

function wayWorldHandler(req, res, key, value) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
}

function connectionError(err, res) {
    log.error(err);
    log.fatal("connectionError not implemented");
}


function wayBboxHandler(req, res, key, value, left, bottom, right, top) {
    dbConnect(res, function(client) {
        var count = 0;
        var success = false;
        //console.log(createWayBboxQuery(key, value, left, bottom, right, top));
        var query = client.query(createWayBboxQuery(key, value, left, bottom, right, top));

        query.on('error', function(err) {
            res.endWith500();
        });

        query.on('end', function() {
            if(count === 0) {
                res.atEnd();
            }
        });

        query.on('row', function(row) {
            if(row.nodes != '{}') {
                count++;
                var subquery = client.query(createNodesForWayQuery(row.nodes));
                subquery.on('error',function(err) {});
                subquery.on('end', function() {
                    count--;
                    if(count === 0){
                        res.atEnd();
                    }
                });
                subquery.on('row', function(row) {
                    res.putNode(rowToNode(row));
                });
            }
            res.putRow(rowToWay(row));
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
    ['GET /api/relation\\[(\\w+)=(\\w+)\\]$',relationWorldHandler]
    //['GET /api/relation\\[(\\w+)=(\\w+)\\](\\[bbox=(\\d),(\\d),(\\d),(\\d)\\])$',relationBboxHandler],
]);

function getConfig(configPath, callback) {
    if( configPath[0] != '/'){
            configPath = __dirname + '/' + configPath;
    }
    fs.readFile(configPath, function(err, data) {
        if (err) {
            throw err;
        }
        callback(JSON.parse(data));
    });
}

function init(newConfig) {
    config = newConfig;
    xmlGenerator.config = config;
    log.setLevel(config.logLevel);
    log.info("server starting...");
    log.info("loaded config from " + configPath);
    http.createServer(myRoutes).listen(config.port, config.host);
    log.info("Started server at " + config.host + ":" + config.port );   
}

opts.parse(options, true);
configPath = opts.get('config') || "config.json";
console.log("loading config " + configPath);
config = getConfig(configPath, init);

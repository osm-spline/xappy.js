#!/usr/bin/env node
var http = require('http');
var fs = require('fs');
var pg = require('pg');
var xmlGenerator = require('./xmlGenerator.js');
var opts = require('opts');
var osmRes = require('./response');
var log4js = require('log4js')();
var log = log4js.getLogger('global');
var parser = require('./parse');
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
    node.tags = []
    if(row.tags.length != 0) {
        for(var i=0;i<row.tags.length;i=i+2) {
            node.tags.push({
                'key'   :   row.tags[i],
                'value' :   row.tags[i+1]
            })
        }
    }
    return node;
}

function rowToWay(row){
    var way = {
        'id' : row.id,
        'timestamp' : toISO8601(row.tstamp),
        'version' : row.version,
        'changeset' : row.changeset_id
    };
    way.tags = []
    if(row.tags.length != 0) {
        for(var i=0;i<row.tags.length;i=i+2) {
            way.tags.push({
                'key'   :   row.tags[i],
                'value' :   row.tags[i+1]
            })
        }
    }
    //TODO return nodes of way
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

//
// {
// object = node/way/relation/* ,
// bbox = { left : 1.0 , right : 1.0 , top : 1.0, bottom : 1.0 }
// tag = { key : [ ], value [ ] }
// }


function buildMainQuery(reqJso){

    var id = 1;
    var replacements = Array();

    var selectMap = {
        'node' : 'id,user_id,tstamp,version,changeset_id,hstore_to_array(tags) as tags, ' +
                    'X(geom) as lat, Y(geom) as lon',
        'way' :  'id,tstamp,version,changeset_id,nodes,user_id,hstore_to_array(tags) as tags ',
        'relation' : '' //FIXME: plz
    }

    // FIXME: help me i am not side effect free
    function buildTagsQuery(map){

        tagQueries = new Array();

        for(tagkey in map){
            tagQueries.push("tags @> hstore($" + id++  +  ",$" + id++ + ")");
            replacements.push(tagkey);
            replacements.push(map[tagkey]);
        }

        return tagQueries.join(" OR  \n");
    }

    // FIXME: help me i am not side effect free
    function buildBbox(object,bbox){

        var colName = {
            node : 'geom',
            way : 'linestring',
            relation : '' // FIXME: whats my name
        }

        bboxQueryStr =  colName[object] + ' && st_setsrid(st_makebox2d( ' +
              ' st_setsrid(st_makepoint($' + id++ + ', $' + id++ + '), 4326), ' +
              ' st_setsrid(st_makepoint($' + id++ + ', $' + id++ + '), 4326) ' +
              ' ), 4326) ';

        for( direction in bbox ) {
            replacements.push(bbox[direction]);
        }

        return bboxQueryStr;
    }

    function explodeTags(keys,values){
        var map = {};
        for(key in keys) {
            for(value in values) {
                map[keys[key]]=values[value]; // FIXME: das ist scheiße
            }
        }
        return map;
    }

    query = "SELECT " + selectMap[reqJso.object] + " FROM " + reqJso.object + "s";

    whereClauses = Array();

    if(reqJso.bbox != undefined){
        whereClauses.push(buildBbox(reqJso.object,reqJso.bbox));
    }

    // FIXME: rename tag to tags key to keys value to values
    if(reqJso.tag != undefined){
        tags = explodeTags(reqJso.tag.key,reqJso.tag.value);
        whereClauses.push(buildTagsQuery(tags));
    }

    if(whereClauses.length > 0) {
        query += ' WHERE (' + whereClauses.join(' AND ') + ')';
    }

    query += ';'

    return {
        text    :   query,
        values  :   replacements,
        name    :   query,
        binary  :   true
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
        console.log(createWayBboxQuery(key, value, left, bottom, right, top));
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


function myFunction(req,res){
    // FIXIT: if send head with 200, the following endWith500() call has no effect
    res.writeHead(200);

    try {
        var reqObj = parser.urlToXpathObj(req.url);
        var queryDict = buildMainQuery(reqObj);
        var resXml = osmRes.mkXmlRes(res);

        log.debug(JSON.stringify(queryDict));
        log.debug(JSON.stringify(reqObj));
        dbConnect(resXml, function(client) {
            var success = false;
            var query = client.query(queryDict);

            query.on('error', function(err) {
                log.error(err.message);
                res.endWith500();
            });

            query.on('end', function() {
                log.trace('end');
                res.atEnd();
            });

            query.on('row', function(row) {
                log.trace('next row');
                log.debug(JSON.stringify(row));

                if(reqObj.object == "node") {
                    var pojo = rowToNode(row);
                    res.putNode(pojo);
                }
                    else if(reqObj.object == "way") {
                    var pojo = rowToWay(row);
                    res.putWay(pojo);}
           });
       });
    }
    catch (err) {
        log.error(err);
    }
}

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
    http.createServer(myFunction).listen(config.port, config.host);
    log.info("Started server at " + config.host + ":" + config.port );
}

opts.parse(options, true);
configPath = opts.get('config') || "config.json";
console.log("loading config " + configPath);
config = getConfig(configPath, init);

var clutch = require('clutch');
var pg = require('pg');
var xmlGenerator = require('./xmlGenerator.js');

// load config
var config = require('./config.json');
process.argv.forEach(function (val,index, array){
    if(val=="-c"){
        path = array[index+1];
        if( path[0] != '/'){
            path = __dirname + '/' + path;
        }
        config = require(path);
    }
});
var connectionString = config.connectionString;

//set up logger
var log4js = require('log4js')(); //note the need to call the function
//log4js.addAppender(log4js.fileAppender('osm-xapi.log'), 'cheese');

var log = log4js.getLogger('global');
log.setLevel(config.logLevel);

log.info("server starting...");

function createWayBboxQuery(key, value, left, bottom, right, top) {
    return {
        text: 'SELECT id,tstamp,version,changeset_id,nodes,user_id,hstore_to_array(tags) as tags \
               FROM ways \
               WHERE ( \
                   tags @> hstore($1, $2) AND \
                   linestring && st_setsrid(st_makebox2d( \
                       st_setsrid(st_makepoint($3, $4), 4326), \
                       st_setsrid(st_makepoint($5, $6), 4326) \
                   ), 4326) \
               )',
        values: [key, value, left, bottom, right, top],
        name: 'way bbox query'
    };
}

function createNodeBboxQuery(key, value, left, bottom, right, top) {
    return {
        text: 'SELECT id,user_id,tstamp,version,changeset_id,hstore_to_array(tags) as tags, X(geom) as lat, Y(geom) as lon \
               FROM nodes \
               WHERE ( \
                   tags @> hstore($1, $2) AND \
                   geom && st_setsrid(st_makebox2d( \
                       st_setsrid(st_makepoint($3, $4), 4326), \
                       st_setsrid(st_makepoint($5, $6), 4326) \
                   ), 4326) \
               )',
        values: [key, value, left, bottom, right, top],
        name: 'node bbox query'
    };
}

function createNodesForWayQuery(nodes) {
    return {
        text: 'SELECT id,tstamp,version,changeset_id,hstore_to_array(tags) as tags, X(geom) as lat, Y(geom) as lon \
               FROM nodes \
               WHERE (id = ANY($1))',
        values: [nodes],
        name: 'nodes for way'
    };
}

function nodeWorldHandler(req, res, key, value) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(' key:' +key +' value:'+value+'\n');
}

function nodeBboxHandler(req, res, key, value, left, bottom, right, top) {
    db_connect(res, function(client) {
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
            res.write(xmlGenerator.createNode(row));
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

function db_connect(res, callback) {
    pg.connect(connectionString, function(err, client) {
        if(err) {
            log.error(err.message);
            res.writeHead(500,{});
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
                    res.write(xmlGenerator.createNode(row));
                });

                //console.log(createNodesForWayQuery(row.nodes));
            }
            res.write(xmlGenerator.createWay(row));
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

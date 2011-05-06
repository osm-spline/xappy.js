#!/usr/bin/env node
var http = require('http');
var fs = require('fs');
var pg = require('pg');
var xmlGenerator = require('./xmlGenerator.js');
var opts = require('opts');
var osmRes = require('./response');
var log4js = require('log4js')();
var log = log4js.getLogger('global');
var parser = require('./requestParser');
var config;
var database;

// #################### MAY be put to different module later
//TODO move into xmlGenerator
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

var httpHandler = function(req, res) {
    // FIXIT: if send head with 200, the following endWith500() call has no effect
    res.writeHead(200);

    try {
        var reqObj = parser.parse(req.url);

		database.executeRequest(reqObj, function(error, eventEmitter) {
			if(error) {
				log.error(error);
				res.writeHead(500);
			}
			else {
				//connection successful
				//TODO check for first event -> send xmlHeader to client, perhaps put this into RepsonseXml?
				var responseHandler = osmRes.mkXmlRe(res); //TODO rename responseHandler?

				eventEmitter.on('node', function(node) {
					responseHandler.putNode(node);
				});
				eventEmitter.on('way', function(way) {
					responseHandler.putWay(way);
				});
				eventEmitter.on('relation', function(relation) {
					responseHandler.putRelation(relation);
				});
				eventEmitter.on('error', function(error) {
					res.write(500);
				});
				eventEmitter.on('end', function() {
					responseHandler.finish();
				});
			}
		});
    }
    catch (err) {
        log.error(err);
    }
};

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
	database = new require('./postgresdb/postgresdb').PostgresDb();
    http.createServer(httpHandler).listen(config.port, config.host);
    log.info("Started server at " + config.host + ":" + config.port );
}

opts.parse(options, true);
configPath = opts.get('config') || "config.json";
console.log("loading config " + configPath);
config = getConfig(configPath, init);

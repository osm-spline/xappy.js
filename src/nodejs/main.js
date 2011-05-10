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

/**
 * Array of possible options values that are exxpeted by the application
 *
 * @type array
 */
var options = [
      { short       : 'c',
        long        : 'config',
        description : 'Select configuration file',
        value       : true
      }
];


/**
 * Main http handler, is called at every client request by node http server.
 *
 * @param req   node request object
 * @param res   node response object
 * 
 */
var httpHandler = function(req, res) {
    // FIXIT: if send head with 200, the following endWith500() call has no effect
    res.writeHead(200);

    parser.parse(req.url, function requestParserCallback(err, xapiRequestObj) {
        
        if(error){
            log.error(error);
            res.writeHead(500);
            res.end();
        }   

        database.executeRequest(xapiRequestObj, function(error, eventEmitter) {
            if(error) {
                log.error(error);
                res.writeHead(500);
                res.end();
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
    });
};

/**
 * Function that loads config file from specified path 
*
* @parameter configPath    either relative or absolut path
 * @parameter callback      callback with error parameter and dict containing parsed options
 */

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

/**
 * TODO: describe please!
 * @parameter newConfig 
 */
function init(newConfig) {
    config = newConfig;
    xmlGenerator.config = config;
    log.setLevel(config.logLevel);
    log.info('server starting...');
    log.info('loaded config from ' + configPath);
	database = new require('./postgresdb/postgresdb').PostgresDb();
    http.createServer(httpHandler).listen(config.port, config.host);
    log.info('Started server at ' + config.host + ':' + config.port );
}

// parse options, results can be retrived via opts.get('name') 
opts.parse(options, true);
configPath = opts.get('config') || 'config.json';
console.log('loading config ' + configPath);
config = getConfig(configPath, init);

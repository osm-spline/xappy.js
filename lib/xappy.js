var injector = require('./injector');
var http = injector.require('http');
var parse = injector.require('requestParser').parse;
var database = injector.require('database');
var log = injector.require('log4js')().getLogger('xapi');
var fs = require('fs');
var path = require('path');
var URL = require('url');

var JSONGenerator = require('./genjson').JSONGenerator;
var XmlGenerator = require('./genxml').XmlGenerator;

var XAPI_VERSION = 0.6;
var XAPPY_VERSION = 0.2;

/**
 * Purpose of this module:
 *  - create http server
 *  - call parser
 *  - retrieve object from db
 */
function Xapi(config) {
    log.info("Starting Xapi with config: " + JSON.stringify(config));
    db = new database(config.database);
    var parsedHandler = parsedRequest(db, getGenerator(config.copyright), emitHandler);
    var handler = httpHandler(parse, parsedHandler);
    http.createServer(handler).listen(config.port, config.host);
}

/**
 * @description generic error handler for processing error objects
 * @param error {code = <HTTP Response Code>, message = <HTTP Response Body>}
 * @param res node.js HTTP response object
 */

function errorHandler(res, error){
    var body = error.message;
    if(error.code >= 500 || error.code === 204){
        body = '';
    }
    res.writeHead(error.code, error.message, {'Content-Length' : body.length, 'Content-Type' : 'text/plain'});
    res.end(body);
}

// TODO make this more abstract, inject Generators
// need a default value and a mapping
function getGenerator(copyright) {
    return function(contentType, uri) {
        var isJson = (contentType == "application/json");
        var Generator =  isJson? JSONGenerator : XmlGenerator;

        var parameters = {
            version : XAPI_VERSION,
            generator :"xappy.js v"+XAPPY_VERSION,
            uri : uri,
            planetDate : "SELECT planetDate from DATABASE!!!!", // TODO XXX TODO
            copyright: copyright
        };


        return new Generator(parameters);
    };
}

// Connects a Http RequestListener over a request parser and callbacks 
// callback(http.ServerResponse, pathname, contentType, xapiRequest)
function httpHandler(parse, callback) {
    return function(req, res) {
        var url = URL.parse(req.url);
        var pathname = url.pathname;
        log.info("Send " + pathname + " to Parser");
        parse(pathname, function(err, xapiReq) {
            var content = req.headers['content-type'];
            callback(res, pathname, content, err, xapiReq);
        });
    };
}

// Handles xapiRequest: Returns error to the stream or creates a OutputGenerator
// and runs the request against db
function parsedRequest(db, getGen, callback) {
    return function parsedRequest(res, url, contentType, err, xapiRequest) {
        if (err) {
            log.error('Error parsing request', err);
            res.writeHead(400); // Bad Request
            res.end();
        } else {
            var generator = getGen(contentType, url);
            db.executeRequest(xapiRequest, callback(res, generator));
        }
    };
}

// Connects a Database Emitter through a Output Generator with an
// http.ServerResponse (Writeable Stream)
function emitHandler(res, generator) {
    return function(err, emitter) {
        if (err) {
            log.error("Error executing db request:", err);
            res.writeHead(500);
            res.end();
        } else {
            emitter.once('start', function() {
                res.writeHead(200, {'Content-Type': generator.contentType});
                headerSend = true;
                res.write(generator.createHeader());
            });
            emitter.on('node', function(node) { res.write(generator.create('node', node)); });
            emitter.on('way',  function(way) { res.write(generator.create('way', way)); });
            emitter.on('relation', function(rel) { res.write(generator.create('relation', rel)); });
            emitter.once('end', function() {
                res.write(generator.createFooter());
                res.end();
            });
            emitter.once('error', function(error) {
                if (!headerSend) {
                    res.writeHead(500);
                }
                log.error("Error from db:" + JSON.stringify(error));
                res.end();
            });
        }
    };
}

if (typeof module == "object" && typeof require == "function") {
    exports.Xapi = Xapi;
    exports.emitHandler = emitHandler;
    exports.httpHandler = httpHandler;
    exports.getGenerator = getGenerator;
    exports.parsedRequest = parsedRequest;
    exports.errorHandler = errorHandler;
}

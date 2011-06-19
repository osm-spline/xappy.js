var injector = require('./injector');
var http = injector.require('http');
var parse = injector.require('requestParser').parse;
var database = injector.require('database');
var log = injector.require('log4js')().getLogger('xapi');
var path = require('path');
var URL = require('url');

var JSONGenerator = require('./genjson').JSONGenerator;
var XmlGenerator = require('./genxml').XmlGenerator;

var XAPI_VERSION = 0.6;
var XAPPY_VERSION = 0.2;

/**
 * Purpose of this module:
 *  - create http server
 *  - select parser based on content-type field
 *  - sanatize url (remove get-parameters etc)
 *  - call parser
 *  - retrieve object from db
 */

/**
 * @description the constructors purpose is to create an httpHandler, by
 *              injecting other handler functions for db and parser into
 *              a handle.
 * @constructor
 */
function Xapi(config) {
    log.info("Starting Xapi with config: " + JSON.stringify(config));
    db = new database(config.database);
    var parsedHandler = getXapiRequestHandler(db, getGeneratorSelector(config.copyright), emitHandler);
    var handler = getHttpHandler(parse, parsedHandler);
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


/**
 * @description this function is called by the http handler to choose an
 *              generator implmentation.
 */
// TODO make this more abstract, inject Generators
// need a default value and a mapping
// TODO whats about miltiple content types and $NOT_APPLICATION/json
function getGeneratorSelector(copyright) {
    return function generatorSelector(contentType) {
        var isJson = (contentType == "application/json");
        var Generator =  isJson? JSONGenerator : XmlGenerator;

        var parameters = {
            version : XAPI_VERSION,
            generator :"xappy.js v"+XAPPY_VERSION,
            uri : "",
            planetDate : "SELECT planetDate from DATABASE!!!!", // TODO XXX TODO
            copyright: copyright
        };

        return new Generator(parameters);
    };
}

/**
 * @descritpion get a http request handler, that sanatizes and calls a parser
 * @returns callback(http.ServerResponse, pathname, contentType, xapiRequest)
 */
function getHttpHandler(parse, callback) {
    return function httpHandler(req, res) {

        // sanatize url by removing getParameters
        var url = URL.parse(req.url);
        var pathname = url.pathname;

        // call parser
        log.info("Send " + pathname + " to Parser");
        parse(pathname, function(err, xapiReq) {
            var content = req.headers['content-type'];
            callback(res, pathname, content, err, xapiReq);
        });
    };
}

/**
 * @description  Creates a callback, that is called after parsing of the request,
 *               to handle eventual errors or execute the database request.
 * @param err    error returend by parser
 * @param contentTyp Contenttype header field as string
 */
function getXapiRequestHandler(db, getGen, callback) {
    return function xapiRequestHandler(res, url, contentType, err, xapiRequest) {
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
    exports.errorHandler = errorHandler;
    exports.getHttpHandler = getHttpHandler;
    exports.getGeneratorSelector = getGeneratorSelector;
    exports.getXapiRequestHandler = getXapiRequestHandler;
}

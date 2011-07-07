var http = require('http');
var parse = require('./parser/request').parse;
var database = require('./postgresdb/postgresdb').PostgresDb;
var log = require('log4js')().getLogger('xappy');
var path = require('path');
var URL = require('url');
var validate = require('./validator').validate;

var getGeneratorSelector = require('./generatorFactory').factory;

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
function Xappy(config) {
    log.info('Starting Xappy with config: ' + JSON.stringify(config));
    db = new database(config.database);
    var parsedHandler = getXappyRequestHandler(
            db, getGeneratorSelector(config.copyright), getEmitterHandler
    );
    var handler = getHttpHandler(parse, parsedHandler);
    http.createServer(handler).listen(config.port, config.host);
}

/**
 * @description generic error handler for processing error objects
 * @param error {code = <HTTP Response Code>, message = <HTTP Response Body>}
 * @param res node.js HTTP response object
 */

function writeError(res, error){
    log.error(JSON.stringify(error));

    res.writeHead(error.code, error.message, {'Content-Type': 'text/plain'});
    if (error.code !== 204) {
        res.write(error.message);
    }
    res.end();
}

/**
 * @descritpion get a http request handler, that sanatizes and calls a parser
 * @returns callback(http.ServerResponse, pathname, contentType, xappyRequest)
 */
function getHttpHandler(parse, callback) {
    return function httpHandler(req, res) {

        // sanatize url by removing getParameters
        var url = URL.parse(req.url);
        var pathname = url.pathname;

        // call parser
        log.info('Send ' + pathname + ' to Parser');
        parse(pathname, function (err, xappyReq) {
            var content = req.headers['content-type'];
            if (err) {
                callback(res, content, err, xappyReq);
            } else {
                validate(xappyReq, function (err, xappyReq) {
                   callback(res, content, err, xappyReq);
                });
            }
        });
    };
}

/**
 * @description  Creates a callback, that is called after parsing of the request,
 *               to handle eventual errors or execute the database request.
 * @param err    error returend by parser
 * @param contentTyp Contenttype header field as string
 */
function getXappyRequestHandler(db, getGen, callback) {
    return function xappyRequestHandler(res, contentType, err, xappyRequest) {

        if (err) {
            //log.error('Error parsing request', err);
            writeError(res,err);
        } else {
            var generator = getGen(contentType);
            db.executeRequest(xappyRequest, callback(res, generator));
        }
    };
}

/**
 * @description: this functions creates a callback that shall be called from
 *               the db module after createing the handler.
 *
 *               The generated callback takes the emitter or an error as result.
 *               Its task is to bind handlers to the event.
 *
 */
function getEmitterHandler(res, generator) {
    return function emitterHandler(err, emitter) {

        var headerSend = false;

        if (err) {
            //log.error('Error executing db request:', err);
            error.code = 500;
            writeError(res,err);
            //res.writeHead(500);
            //res.end();
        } else {
            emitter.once('start', function () {
                res.writeHead(200, {'Content-Type': generator.contentType});
                headerSend = true;
                res.write(generator.createHeader());
            });
            emitter.on('node', function (node) {
                res.write(generator.create('node', node));
            });
            emitter.on('way',  function (way) {
                res.write(generator.create('way', way));
            });
            emitter.on('relation', function (rel) {
                res.write(generator.create('relation', rel));
            });
            emitter.once('end', function () {
                if (headerSend) {
                    res.write(generator.createFooter());
                }
                res.end();
            });
            emitter.once('error', function(error) {
                //log.error('Error from db:' + JSON.stringify(error));
                if (!headerSend) {
                    error.code = 500;
                    writeError(res,error);
                    //res.writeHead(500);
                }
                res.end();
            });
        }
    };
}

if (typeof module === 'object' && typeof require === 'function') {
    exports.Xappy = Xappy;
    exports.getEmitterHandler = getEmitterHandler;
    exports.writeError = writeError;
    exports.getHttpHandler = getHttpHandler;
    exports.getXappyRequestHandler = getXappyRequestHandler;
}

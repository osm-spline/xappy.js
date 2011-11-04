var http = require('http');
var path = require('path');
var URL = require('url');
var _ = require('underscore')

var log = require('log4js')().getLogger('xappy');

var parse = require('./parser/request').parse;
var database = require('./postgresdb/postgresdb').PostgresDb;
var validate = require('./validator').validate;
var getGeneratorSelector = require('./generatorFactory').factory;
var PlanetDate = require('./planetdate').PlanetDate;

/**
 * Purpose of this module:
 *  - create http server
 *  - select parser based on content-type field
 *  - sanatize url (remove get-parameters etc)
 *  - call parser
 *  - retrieve object from db
*/

function createXappy(config) {
    modifiers = [
        getGenFactory,
        getDb,
        getHttpHandler
    ]
    var xapiSetupState = {
        'config' : config,
        'httpHandler' : null,
        'db' : null
    }

}

// Executors
module.exports.execList = function execListOn(obj,list){
    return (_.reduceRight(
        list,
        function(accFun,nextFun){
            return (function(){
                nextFun(obj,accFun);
            });
        },
        obj));
}

// Generator Factory

function writeParameters(config, planet) {
     return {
        version: config.xapiVersion,
        generator: 'xappy.js v' + config.xappyVersion,
        planetDate: planet.get(),
        copyright: config.copyright
    };
}

function getGenFactory(xss,next){
    PlanetDate(config.planetJson, function(err, planet) {
        if (err) throw err;
        var parameters = writeParameters(config, planet);
        xss = getGeneratorSelector(parameters);
        next();
    });
}

// DB

function getDb(xss,next){
    xss.db = new database(config.database);
    next();
}

// HTTP HANDLER

/**
 * @description the constructors purpose is to create an httpHandler, by
 *              injecting other handler functions for db and parser into
 *              a handle.

function Xappy(config) {
    log.info('Starting Xappy with config: ' + JSON.stringify(config));
        var parsedHandler = getXappyRequestHandler(
            db, genFactory, getEmitterHandler
        );
        var handler = getHttpHandler(parse, parsedHandler);
        http.createServer(handler).listen(config.port, config.host);
    });
}
*/

/**
 * @descritpion get a http request handler, that sanatizes and calls a parser
 * @returns callback(http.ServerResponse, pathname, contentType, xappyRequest)
*/
function getHttpHandler(parse, callback) {
    return function httpHandler(req, res) {

        // sanatize url by removing getParameters
        var url = URL.parse(req.url);
        log.info('receive request ' + req.url);
        var pathname = url.pathname;

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
            res.writeHead(400, 'Error parsing request');
            res.end();
        } else {
            try {
                var generator = getGen(contentType);
            } catch (err) {
                res.writeHead(400, 'Unknown content type');
                res.end();
                return;
            }
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
            log.error('Database error: ' + JSON.stringify(err));
            res.writeHead(500, 'Error executing database request');
            res.end();
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
                res.write(generator.createFooter());
                res.end();
            });
            emitter.once('error', function(error) {
                log.error('Database error: ' + JSON.stringify(error));
                if (!headerSend) {
                    res.writeHead(500, 'Error executing database request');
                }
                res.end();
            });
        }
    };
}

if (typeof module === 'object' && typeof require === 'function') {
    // exports.Xappy = Xappy;
    exports.getEmitterHandler = getEmitterHandler;
    exports.getHttpHandler = getHttpHandler;
    exports.getXappyRequestHandler = getXappyRequestHandler;
}

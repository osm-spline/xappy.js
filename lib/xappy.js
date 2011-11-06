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

var xapiSetupState = {
    'config' : null,
    'httpHandler' : null,
    'db' : null,
    'generatorSelector' : null,
    'parse' : parse,
    'validate' : validate,
}

function errorHandler(err,xss){
    if (!err.code) {
        err = { code: 500, msg: err}
    }

    xss.res.writeHead(err.code,err.msg);
    xss.res.end();
}

function createXappy(config) {
    stages = [
        getGenFactory,
        getDb,
 //       getHttpHandler
    ];

    execute(xapiSetupState,stages,function (err,xrs){
        if (err) {
            log.error("Couldn't setup xappy, because of: " + err);
        } else {
            log.info("Xappy succsefull setup.");
        }
    });
}

/*

function httpHandler
        if (err) {
            log.error("Request finished with erroar");
            errorHandler(err,xss);
        } else {
            log.info("Request finished successfull: " ü
    });

*/

// Executors
var execute = function execute(obj,list,callback){
    var next = function executeNext(err) {

        if(err){
            callback(err,null);
        } else {

            if (list.length != 0){
                fun = list.pop();
                log.info(fun.name + " is about to be executed");
                fun(obj,next);
            } else {
                callback(null,obj);
            }

        }
    }

    list.reverse();
    next();
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
    var config = xss.config;
    PlanetDate(config.planetJson, function(err, planet) {
        if (err) throw err;
        var parameters = writeParameters(config, planet);
        xss.genratorSelector = getGeneratorSelector(parameters);
        next();
    });
}

// DB

function getDb(xss,next){
    xss.db = new database(config.database);
    next();
}

// HTTP HANDLER
// TODO: setup http server

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

// on request

xapiRequestState = {
    'xss' : xapiSetupState,
    'req' : null,
    'res' : null,
    'xapiReq' : null,
    'saneUrl' : null,
    'generator' : null,
    'emitter' : null,
}


// sanatize url by removing getParameters
var sanatizeUrl = function sanatizeUrl(xrs,next){
        var url = URL.parse(xrs.req.url);
        log.info('receive request ' + xrs.req.url);
        xrs.saneUrl = url.pathname;
        next();
};

// select output generator
var getGenerator = function getGenerator(xrs,next){
    var contentType = xrs.req.headers['content-type'];
    try {
        xrs.generator = xrs.generatorSelector(contentType);
        next();
    } catch (_exeption) {
        next({ code: 400, msg: 'Unknown content type'});
    }
};


// call validator and parser
var callParse = function callParse(xrs,next) {
    xrs.parse(xrs.saneUrl, function parseCallback(err, xappyReq) {
            if (err) {
                // TODO: what kind of error is returned?
                next(err);
            } else {
                xrs.xapiReq = xappyReq;
                next();
            }
    });
}

var callValidate = function callValidate(xrs,next) {
    xrs.validate(xrs.xapiReq, function validateCallback(err, xappyReq) {
        if (err) {
            // TODO: same as above
            next(err);
        } else {
            // TODO: not sure, weather this should go in other member of xrs
            xrs.xapiReq = xappyReq;
            next();
        }
    });
};

// execute query on db
var execQuery = function execQuery(xrs, next) {
    xrs.db.executeRequest(xrs.xapiReq,function(err,emitter){
        if (err) {
            next(err);
        } else {
            xrs.emitter = emitter;
            next();
        }
    });
}

// add handlers and wait till finished
var writeRes = function writeRes(xrs, next) {
    var emitter = xrs.emitter;
    var generator = xrs.generator;
    var res = xrs.res;
    var headerSend =  false;

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
        next();
    });
    emitter.once('error', function(error) {
        log.error('Database error: ' + JSON.stringify(error));
        if (!headerSend) {
            next({ code: 500, msg:'Error executing database request'});
        }
        res.end();
    });
}

// end reimplmentation

if (typeof module === 'object' && typeof require === 'function') {
    exports.execute = execute;
    exports.sanatizeUrl = sanatizeUrl;
    exports.getGenerator = getGenerator;
    exports.callParse = callParse;
    exports.callValidate = callValidate;
    exports.execQuery = execQuery;
    exports.writeRes = writeRes;
    // exports.getHttpHandler = getHttpHandler;
    // exports.getXappyRequestHandler = getXappyRequestHandler;
}

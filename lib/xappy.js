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

// Executors
var execute = function execute(obj,list,callback){
    var next = function executeNext(err) {

        if(err){
            callback(err,obj);
        } else {

            if (list.length != 0){
                fun = list.pop();
                log.debug(fun.name + " is about to be executed");
                fun(obj,next);
            } else {
                callback(null,obj);
            }

        }
    }

    list.reverse();
    next();
};

/**
 * All folowing functions are use to configure the xapi, when starting. They
 * work on the xapiSetupState (xss) and use the execute function to execute, to
 * apply these state transitions
 */

var xapiSetupState = {
    'config' : null,
    'db' : null,
    'generatorSelector' : null,
};

// Generator Factory
// this is a helper function
var writeParameters = function writeParameters(config, planet) {
     return {
        version: config.xapiVersion,
        generator: 'xappy.js v' + config.xappyVersion,
        planetDate: planet.get(),
        copyright: config.copyright
    };
};

var getGenFactory = function getGenFactory(xss,next){
    var config = xss.config;
    PlanetDate(config.planetJson, function(err, planet) {
        if (err) throw err;
        var parameters = writeParameters(config, planet);
        xss.generatorSelector = getGeneratorSelector(parameters);
        next();
    });
};


 /* var function startHttpServer(xss,next){
    var config = xss.config;
    log.info('Starting Xappy with config: ' + JSON.stringify(config));
    http.createServer(httpHandler).listen(config.port, config.host);
} */


/*
 * on request ******************
 *
 * all of the following functions are invoked upon each request, they work on
 * the xapiRequestState (or xrs).
 */

var xapiRequestState = {
    'req' : null,
    'res' : null,
    'xapiReq' : null,
    'saneUrl' : null,
    'generator' : null,
    'emitter' : null,
    'parse' : parse,
    'validate' : validate,
};


// sanatize url by removing getParameters
var sanatizeUrl = function sanatizeUrl(xrs,next){
        log.info('receive request ' + xrs.req.url);
        var url = URL.parse(xrs.req.url);
        xrs.saneUrl = url.pathname;
        next();
};

// select output generator
var getGenerator = function getGenerator(xrs,next){
    //console.log(typeof xrs.generatorSelector);
    //console.log(typeof xrs.db);
    var contentType = xrs.req.headers['content-type'];
    try {
        xrs.generator = xrs.generatorSelector(contentType);
        next();
    } catch (exe) {
        if(!exe.code){
            exe = next({ code: 500, msg: 'Error evaluate contenttyp'});
        }
        next(exe);
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
};

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
};

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
};

/**
 * Starters:
 *
 * those are the functions, that start all other functions operating on the tow
 * state objects using execute() from above.
 */

var errorHandlerRequest = function errorHandler(err,xrs){
    if (err) {
        if (!err.code) {
            err = { code: 500, msg: err}
        }
        xrs.res.writeHead(err.code,err.msg);
        xrs.res.end();
    };
};

var httpHandler = function httpHandler(req,res) {

    stages = [
        sanatizeUrl,
        getGenerator,
        callParse,
        callValidate,
        execQuery,
        writeRes
    ]

    console.log(typeof xapiRequestState.db);
    console.log(typeof xapiSetupState.db);

    myXrs = Object.create(xapiRequestState);
    myXrs.req = req;
    myXrs.res = res;

    execute(myXrs,stages,errorHandlerRequest);
};

var createXappy = function createXappy(config) {

    xapiSetupState.config = config;
    xapiSetupState.db = new database(config.database);

    stages = [
        getGenFactory,
    ];

    execute(xapiSetupState,stages,function (err,xss){
        if (err) {
            log.error("Couldn't setup xappy, because of: " + err);
        } else {
            _.defaults(xapiRequestState,xapiSetupState);
            http.createServer(httpHandler).listen(config.port, config.host);
            log.info("Xappy succsefull setup at " + config.host + ":" + config.port);
        }
    });
};

/*
 * Exports
 */

if (typeof module === 'object' && typeof require === 'function') {
    exports.execute = execute;
    exports.sanatizeUrl = sanatizeUrl;
    exports.getGenerator = getGenerator;
    exports.callParse = callParse;
    exports.callValidate = callValidate;
    exports.execQuery = execQuery;
    exports.writeRes = writeRes;
    exports.createXappy = createXappy;
};

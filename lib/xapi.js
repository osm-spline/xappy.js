var injector = require('./injector');
var http = injector.require('http');
var parse = injector.require('requestParser').parse;
var database = injector.require('database');
var log = injector.require('log4js')().getLogger('xapi');
var fs = require('fs');
var path = require('path');

var JSONGenerator = require('./genjson').JSONGenerator;
var XmlGenerator = require('./genxml').XmlGenerator;

/**
 * Purpose of this module:
 *  - create http server
 *  - call parser
 *  - retrieve object from db
 */

function Xapi(config) {
    return function() {
        log.info("Starting Xapi with config: " + JSON.stringify(config));
        db = new database(config.connectionString);
        var handler = httpHandler(parse, db, config);
        http.createServer(handler).listen(config.port, config.host);
    }
}

function emitHandler(res, generator, contentType) {
    return function(err, emitter) {
        if (err) {
            log.error("Error executing db request:", err);
            res.end();
        } else {
            emitter.once('start', function() {
                res.writeHead(200, {'Content-Type': contentType});
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

function httpHandler(parse, db, config) {
    return function(req, res) {
        req.url = req.url.split("?")[0];
        log.info("Send " + req.url + " to Parser");
        parse(req.url, parsedRequest);

        function parsedRequest(err, xapiRequest) {
            if (err) {
                log.error('Error parsing request', err);
                res.writeHead(400); // Bad Request
                res.end();
            } else {
                var planetDate = config.xmlConfig.planetDate;
                var isJson = (req.headers['content-type'] == "application/json");
                var generator = isJson? new JSONGenerator() : new XmlGenerator(config.xmlConfig, req.url, planetDate);
                var contentType = isJson? 'application/json' : 'application/xml';
                db.executeRequest(xapiRequest, emitHandler(res, generator, contentType));
            }
        }
    }
}


if (typeof module == "object" && typeof require == "function") {
    exports.Xapi = Xapi;
    exports.emitHandler = emitHandler;
    exports.httpHandler = httpHandler;
}

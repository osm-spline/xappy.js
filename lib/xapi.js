var http = require('http');
var parse = require('./requestParser').parse;
var Postgresdb = require('./postgresdb/postgresdb').PostgresDb;
var log4js = require('log4js')();
var log = log4js.getLogger('xapi');

function Xapi(config) {
    var db;
    var generator;

    function init() {
        log.setLevel(config.loglevel);
        log.info("Starting Xapi with config: " + JSON.stringify(config));
        db = new Postgresdb(config.connectionString);
        http.createServer(httpHandler).listen(config.port, config.host);
    }

    function httpHandler(req, res) {
        log.info("Send " + req.url + " to Parser");

        parse(req.url, parsedRequest);

        function parsedRequest(err, xapiRequest) {
            if (err) {
                log.error("Error parsing request",err);
                res.writeHead(400); // Bad Request
                res.end();
            } else {
                db.executeRequest(xapiRequest, handleEmitter);
            }
        }

        function handleEmitter(err, emitter) {
            if (err) {
                log.error("Error executing db request",err);
                res.end();
            } else {
                var headerSend = false;

                if (req.headers['content-type'] == "application/json") {
                    var JSONGenerator = require('./genJSON').JSONGenerator;
                    generator = new JSONGenerator();
                } else {
                    var XmlGenerator = require('./genXML').XmlGenerator;
                    generator = new XmlGenerator();
                }

                emitter.once('start', function() {
                    res.writeHead(200, {'Content-Type': 'application/xml'});
                    headerSend = true;
                    res.write(generator.createHeader());
                });
                emitter.on('node', function(node) { res.write(generator.createNode('node', node)); });
                emitter.on('way',  function(way) { res.write(generator.createWay('way', way)); });
                emitter.on('relation', function(rel) { res.write(generator.createRelation('relation', rel)); });
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
        }
    }

    return {
        init: init
    };
}

if (typeof module == "object" && typeof require == "function") {
    exports.Xapi = Xapi;
}

// vim:set ts=4 sw=4 expandtab:

var injector = require('./injector');
var http = injector.require('http');
var parse = injector.require('requestParser').parse;
var database = injector.require('database');
var log = injector.require('log4js')().getLogger('xapi');


function Xapi(config) {
    var db;
    var generator;

    function init() {
        log.info("Starting Xapi with config: " + JSON.stringify(config));
        db = new database(config.connectionString);
        http.createServer(httpHandler).listen(config.port, config.host);
    }

    function httpHandler(req, res) {
        req.url = req.url.split("?")[0];
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
                log.error("Error executing db request:", err);
                res.end();
            } else {
                var headerSend = false;

                if (req.headers['content-type'] == "application/json") {
                    this.json_output = true;
                }

                if (this.json_output) {
                    var JSONGenerator = require('./genjson').JSONGenerator;
                    generator = new JSONGenerator();
                } else {
                    var XmlGenerator = require('./genxml').XmlGenerator;
                    generator = new XmlGenerator();
                }

                emitter.once('start', function() {
                    if (this.json_output) {
                        res.writeHead(200, {'Content-Type': 'application/json'});
                    } else {
                        res.writeHead(200, {'Content-Type': 'application/xml'});
                    }
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

var http = require('http');
var parse = require('./requestParser').parse;
var XmlGenerator = require('./xmlGenerator').XmlGenerator;
var osmRes = require('./response');
var Postgresdb = require('./postgresdb/postgresdb').PostgresDb;

function Xapi(config) {
    var db;
    var xmlGenerator;
    
    function init() {
        // TODO: set log level 
        console.log("Starting Xapi with config: " + JSON.stringify(config));
        db = new Postgresdb(config.connectionString);
        xmlGenerator = new XmlGenerator();
        http.createServer(httpHandler).listen(config.port, config.host);
    }

    function httpHandler(req, res) {
        var raw = '';
        req.on('response', function(chunk) {
            raw += chunk;
        });
        req.once('end', function() {
            parse(raw, parsedRequest);
        });

        function parsedRequest(err, xapiRequest) {
            if (err) {
                console.log("Error parsing request");
                res.writeHead(400); // Bad Request
                res.end();
            } else {
                db.executeRequest(xapiRequest, handleEmitter);
            }
        }

        function handleEmitter(err, emitter) {
            if (err) {
                console.log("Error executing db request");
                res.end();
            } else {
                var headerSend = false;

                emitter.once('start', function() { 
                    res.writeHead(200, {'Content-Type': 'application/xml'});
                    headerSend = true;
                    res.write(generator.createHeader()); 
                });
                emitter.on('node', function(node) { res.write(generator.createNode(node)); });
                emitter.on('way',  function(way) { res.write(generator.createWay(way)); });
                emitter.on('relation', function(rel) { res.write(generator.createRelation(rel)); });
                emitter.once('end', function() { 
                    res.write(generator.end()); 
                    res.end();
                });
                emitter.once('error', function(error) {
                    if (!headerSend) {
                        res.writeHead(500);
                    }
                    console.log("Error from db");
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

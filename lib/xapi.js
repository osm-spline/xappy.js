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
        console.log("Starting Xapi with config: " + util.inspect(config));
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
                req.abort();
            } else {
                db.executeRequest(xapiRequest, handleEmitter);
            }
        }

        function handleEmitter(err, emitter) {
            if (err) {
                console.log("Error executing db request");
                req.abort();
            } else {
                // we assume everything is okay
                res.writeHead(200);

                emitter.once('start', function() { res.write(generator.createHeader()); });
                emitter.on('node', function(node) { res.write(generator.createNode(node)); });
                emitter.on('way',  function(way) { res.write(generator.createWay(way)); });
                emitter.on('relation', function(rel) { res.write(generator.createRelation(rel)); });
                emitter.once('end', function() { res.write(generator.end()); });
                emitter.once('error', function(error) {
                    console.log("Error from db");
                    req.abort();
                });
            }
        }
    };
}

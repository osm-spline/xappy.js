var clutch = require('clutch');

function helloSomeone(req, res, name,bbox, key, value) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('obj:'+name+ ' bbox: '+ bbox + ' key:' +key +' value:'+value+'!\n');
}

function helloWorld(req, res) {
    helloSomeone(req, res, 'World');
}

myRoutes = clutch.route404([['GET /hello/(\\w+)(\\[bbox=(\\d,\\d,\\d,\\d)\\])*\\[(\\w+)=(\\w+)\\]$', helloSomeone],
                                ['GET /hello/$', helloWorld]]);


var http = require('http');
http.createServer(myRoutes).listen(3000, '127.0.0.1');

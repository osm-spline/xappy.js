
var clutch = require('clutch');
var pg = require('pg')

var connectionString = "pg://user:password@host/database";


function createNodeBboxQuery(key, value, left, bottom, right, top) {
	return "SELECT * from nodes WHERE (tags @> '\"" + key
				+ "\"=>\"" + value + "\"'" +  
				" AND POINT(geom) @ polygon(box('(" + left
				 + "," + bottom +")'::point,'(" + 
				+ right + "," + top + ")'::point)));";
}



function nodeWorldHandler(req, res, key, value) {

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(' key:' +key +' value:'+value+'\n');
}
function nodeBboxHandler(req, res, key, value, left, bottom, right, top) {
	pg.connect(connectionString, function(err,client) {
		
		if (err) {
			console.log(err);	
		}
		else {
			console.log(createNodeBboxQuery(key, value, left, bottom, right, top));
			/*client.query(createNodeBboxQuery(key, value, left, bottom, right, top), function(err,result) {
				
				if (err) {
					console.log(err);
				}
				else {
					console.log(result.rows);
					for(row in result.rows.length) {
						console.log(row);
					}
				}
			});*/
		}
			
		
		
	});
	
	
	
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end( 'bbox: '+ left + bottom + right + top + ' key:' +key +' value:'+value+'!\n');
}

function wayWorldHandler(req, res, key, value) {

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(' key:' +key +' value:'+value+'!\n');
}
function wayBboxHandler(req, res, key, value, bbox, left, bottom, right, top) {
}

function relationWorldHandler(req, res, key, value) {
	
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(' key:' +key +' value:'+value+'!\n');
}
function relationBboxHandler(req, res, key, value, left, bottom, right, top) {

}

myRoutes = clutch.route404([
				//['GET /api/(\\w+)(\\[bbox=(\\d,\\d,\\d,\\d)\\])*\\[(\\w+)=(\\w+)\\]$', helloSomeone],
				['GET /api/node\\[(\\w+)=(\\w+)\\]$',nodeWorldHandler],
				['GET /api/node\\[(\\w+)=(\\w+)\\]\\[bbox=(\\d+(\\.\\d+)?),(\\d+),(\\d+),(\\d+)\\]$',nodeBboxHandler],
				['GET /api/node\\[(\\w+)=(\\w+)\\]\\[bbox=(\\d+\\.\\d+),(\\d+),(\\d+),(\\d+)\\]$',nodeBboxHandler],
				['GET /api/way\\[(\\w+)=(\\w+)\\]$',wayWorldHandler],
				['GET /api/way\\[(\\w+)=(\\w+)\\]\\[bbox=(\\d),(\\d),(\\d),(\\d)\\]$',wayBboxHandler],
				['GET /api/relation\\[(\\w+)=(\\w+)\\]$',relationWorldHandler],
				['GET /api/relation\\[(\\w+)=(\\w+)\\](\\[bbox=(\\d),(\\d),(\\d),(\\d)\\])$',relationBboxHandler],
				]);


var http = require('http');
http.createServer(myRoutes).listen(8080, 'localhost');

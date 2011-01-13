
var clutch = require('clutch');
var pg = require('pg')
var builder = require('xmlbuilder')

var connectionString = "pg://user:password@host/database";


function createNodeBboxQuery(key, value, left, bottom, right, top) {
	/*
	 * return "SELECT * from nodes WHERE (tags @> '\"" + key
				+ "\"=>\"" + value + "\"'" +  
				" AND POINT(geom) @ polygon(box('(" + left
				 + "," + bottom +")'::point,'(" + 
				+ right + "," + top + ")'::point)));";
	*/
	
	return "SELECT id,tstamp,version,changeset_id, X(geom) as lat, Y(geom) as lon FROM nodes WHERE (tags @> hstore('" + key + "','" + value + "') AND geom && st_setsrid(st_makebox2d(st_setsrid(st_makepoint(" + 
	left + "," + bottom + "),4326), st_setsrid(st_makepoint(" + right + "," + top + "),4326)),4326));";
}



function nodeWorldHandler(req, res, key, value) {

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(' key:' +key +' value:'+value+'\n');
}
function nodeBboxHandler(req, res, key, value, left, bottom, right, top) {
	pg.connect(connectionString, function(err,client) {
		
		if (err) {
			console.log(err);	
			res.writeHead(404,{});
					res.end('\n');
		}
		else {
			console.log(createNodeBboxQuery(key, value, left, bottom, right, top));
			client.query(createNodeBboxQuery(key, value, left, bottom, right, top), function(err,result) {
				
				if (err) {
					console.log(err);
					res.writeHead(404,{});
					res.end('\n');
				}
				else {
					console.log(result.rows);
					
					res.writeHead(200, {'Content-Type': 'text/plain'});
					//res.write("lala");
					res.write("<xml>");
					for(var i=0; i<result.rows.length;i++) {
						/*//res.write(result.rows[i].id);
						res.write("<node id='" + result.rows[i].id + "'" +
						" timestamp='" + result.rows[i].tstamp + "'" +
						+ " version='" + result.rows[i].version + "'" +
						//+ " changeset='" + result.rows[i].changeset_id + "'" +
						">");
						res.write("</node>");
						//console.log(result.rows[i].id);
						*/
						var node = builder.begin('node')
							.att('id', result.rows[i].id)
							.att('timetamp', result.rows[i].tstamp)
							.att('version', result.rows[i].version)
							.att('changeset', result.rows[i].changeset_id)
							.att('lat', result.rows[i].lat)
							.att('lon', result.rows[i].lon);
							
							
							
							res.write(builder.toString());
						
					}
					res.write("</xml>");
    				res.end();
				}
			});
		}
			
		
		
	});
		
	//console.log(createNodeBboxQuery(key, value, left, bottom, right, top));
	
    //res.writeHead(200, {'Content-Type': 'text/plain'});
    //res.end( 'bbox: '+ left + bottom + right + top + ' key:' +key +' value:'+value+'!\n');
}

function wayWorldHandler(req, res, key, value) {

    res.writeHead(200, {'Content-Type': 'text/plain'});
    
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
				//['GET /api/node\\[(\\w+)=(\\w+)\\]\\[bbox=(\\d+(\\.\\d+)?),(\\d+),(\\d+),(\\d+)\\]$',nodeBboxHandler],
				['GET /api/node\\[(\\w+)=(\\w+)\\]\\[bbox=(\\d+(?:\\.\\d+)?),(\\d+(?:\\.\\d+)?),(\\d+(?:\\.\\d+)?),(\\d+(?:\\.\\d+)?)\\]$',nodeBboxHandler],
				//['GET /api/node\\[(\\w+)=(\\w+)\\]\\[bbox=(\\d+\\.\\d+),(\\d+),(\\d+),(\\d+)\\]$',nodeBboxHandler],
				['GET /api/way\\[(\\w+)=(\\w+)\\]$',wayWorldHandler],
				['GET /api/way\\[(\\w+)=(\\w+)\\]\\[bbox=(\\d),(\\d),(\\d),(\\d)\\]$',wayBboxHandler],
				['GET /api/relation\\[(\\w+)=(\\w+)\\]$',relationWorldHandler],
				['GET /api/relation\\[(\\w+)=(\\w+)\\](\\[bbox=(\\d),(\\d),(\\d),(\\d)\\])$',relationBboxHandler],
				]);


var http = require('http');
http.createServer(myRoutes).listen(8080, 'localhost');

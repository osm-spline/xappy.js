
var clutch = require('clutch');
var pg = require('pg')
var builder = require('xmlbuilder')

var connectionString = "pg://user:password@host/database";

function createDateString(date) {
	
	//2006-09-11T16:28:25+01:00 time format
	date = Date(date);
	return date.getUTCFullYear() + "-" + date.getUTCDate() + "-" + date.getUTCDate() + "T";
}

function createWayBboxQuery(key, value, left, bottom, right, top) {
	return "SELECT id,tstamp,version,changeset_id, nodes, user_id, hstore_to_array(tags) as tags FROM ways WHERE (tags @> hstore('" + key + "','" + value + "') AND linestring && st_setsrid(st_makebox2d(st_setsrid(st_makepoint(" + 
		left + "," + bottom + "),4326), st_setsrid(st_makepoint(" + right + "," + top + "),4326)),4326));";
}

function createNodeBboxQuery(key, value, left, bottom, right, top) {
	return "SELECT id, user_id,tstamp,version,changeset_id, hstore_to_array(tags) as tags, X(geom) as lat, Y(geom) as lon FROM nodes WHERE (tags @> hstore('" + key + "','" + value + "') AND geom && st_setsrid(st_makebox2d(st_setsrid(st_makepoint(" + 
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
			//console.log(createNodeBboxQuery(key, value, left, bottom, right, top));
			var success = false;
			var query = client.query(createNodeBboxQuery(key, value, left, bottom, right, top));
			
			query.on('error', function(err) {
				
				console.log(err);
				res.writeHead(404,{});
				res.end('\n');
			});
			
			query.on('end', function() {
				if(success) {
					res.write("</xml>");
    				res.end();
				}
				else {
					//perhaps write 404? is error also raised?
				}
			});
			
			query.on('row', function(row) {
					
					if(!success) {
						success = true;
						res.writeHead(200, {'Content-Type': 'text/plain'});
						res.write("<xml>");
					}
					
					console.log(row);
					
					var node = builder.begin('node')
						.att('id', row.id)
						.att('timetamp', row.tstamp)
						.att('version', row.version)
						.att('changeset', row.changeset_id)
						.att('lat', row.lat)
						.att('lon', row.lon);
					var temp = row.tags.replace("{","").replace("}","").split(",");
					for(var x=0;x<temp.length;x=x+2)
						node.ele('tag')
							.att('k',escape(temp[x]))
							.att('v',escape(temp[x+1]));
							
							//for(var x=0; x< tags.length;x++)
								//console.log(tags[x]);
								/*node.ele('tag')
									.att('k',tags[x][0])
									.att('v',tags[x][1]);			
							*/
					res.write(builder.toString({ pretty: true }));
					//res.write(builder.toString());
					});
		}
	});
}

function wayWorldHandler(req, res, key, value) {

    res.writeHead(200, {'Content-Type': 'text/plain'});
    
}
function wayBboxHandler(req, res, key, value, left, bottom, right, top) {
	pg.connect(connectionString, function(err,client) {
		if(err) {
			console.log(err);
			res.writeHead(404,{});
			res.end();
		}
		else {
			var success = false;
			console.log(createWayBboxQuery(key, value, left, bottom, right, top));
			var query = client.query(createWayBboxQuery(key, value, left, bottom, right, top));
			
			query.on('error', function(err) {
				console.log(err);
				res.writeHead(404,{});
				res.end();
			});
			
			query.on('end', function() {
				if(success) {
					res.write("</xml>");
					res.end();
				}
				else {
					res.end();
					//perhaps write 404?
				}
			});
			
			query.on('row', function(row) {
				if(!success) {
					success = true;
					res.writeHead(200, {'Content-Type': 'text/plain'});
					res.write("<xml>");
				}
				console.log(row);
				
				builder.begin('way')
					.att('id', row.id)
					.att('timetamp', row.tstamp)
					.att('version', row.version)
					.att('changeset', row.changeset_id);
				
				res.write(builder.toString());
			});
		
		}
		
	});
	
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
				['GET /api/way\\[(\\w+)=(\\w+)\\]\\[bbox=(\\d+(?:\\.\\d+)?),(\\d+(?:\\.\\d+)?),(\\d+(?:\\.\\d+)?),(\\d+(?:\\.\\d+)?)\\]$',wayBboxHandler],
				['GET /api/relation\\[(\\w+)=(\\w+)\\]$',relationWorldHandler],
				//['GET /api/relation\\[(\\w+)=(\\w+)\\](\\[bbox=(\\d),(\\d),(\\d),(\\d)\\])$',relationBboxHandler],
				]);


var http = require('http');
http.createServer(myRoutes).listen(8080, 'localhost');

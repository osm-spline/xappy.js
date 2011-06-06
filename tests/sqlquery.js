var pg = require('pg');

var SqlQuery = function() {
};

SqlQuery.prototype.createQuery = function(xapiRequestObject) {
	
	var db_row;
	
	var query = {
		name : "blub",
		text : "SELECT n.id FROM nodes n LIMIT 1;", //"SELECT n.id, n.version, u.name FROM nodes n, users u WHERE n.user_id = u.id LIMIT 2;",
		binary : true //funktioniert nur mit dem pg-module von alex
	};

	var client = new pg.Client({
		user : 'xapi',
		password : '***',
		database : 'xapi_petra', //datenbank name
		host : 'db.osm.spline.de' //server dns
	});

	client.connect();
	client
		.query(query)
		.on('row', function(row) {
			db_row = row;
			console.log(row);
			console.log('---');
			client.end();
		});
		
	return db_row;
};

exports.SqlQuery = SqlQuery;







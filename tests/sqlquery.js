var pg = require('pg');

var SqlQuery = function() {
};

SqlQuery.prototype.createQuery = function(xapiRequestObject, callback) {
	var client = new pg.Client({
		user : 'xapi',
		password : '***',
		database : 'xapi_petra', //datenbank name
		host : 'db.osm.spline.de' //server dns
	});

	client.connect();
	
	/*
	client
		.query(xapiRequestObject)
		.on('row', function(row) {
			console.log(row);
			console.log('---');
			client.end();
		});
    */
    client.query(xapiRequestObject, function(error, result){
        if(error) {
            callback(error, null);
        } else {
            callback(null, result);
        }
		client.end();
    });

};

exports.SqlQuery = SqlQuery;







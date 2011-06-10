var pg = require('pg');

var SqlQuery = function() {
};

SqlQuery.prototype.createQuery = function(queryPlan, callback) {
	var client = new pg.Client({
		user : 'xapi',
		password : '***',
		database : 'xapi_petra', //datenbank name
		host : 'db.osm.spline.de' //server dns
	});

	var queryObject = {
		name : "nodes",
		text : queryPlan.node.text,
		values : queryPlan.node.values,
		binary : true //funktioniert nur mit dem pg-module von alex
	};

	client.connect();
    client.query(queryObject, function(error, result){
        if(error) {
            callback(error, null);
        } else {
            callback(null, result);
        }
		client.end();
    });

};

exports.SqlQuery = SqlQuery;







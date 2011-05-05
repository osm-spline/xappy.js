var pg = require('pg');
var QueryBuilder = require('./querybuilder').QueryBuilder;

var PostgresDb = function(connectionString) {
	this.connectionString = connectionString;
};

var rowToNode = function(row) {
};

var rowToWay = function(row) {
};

var rowToRelation = function(row) {
};

//TODO change callback to return error?
PostgresDb.prototype.executeRequest = function(xapiRequest, callback) {
	var queryBuilder = new QueryBuilder();
	var queryPlan = queryBuilder.createQueryPlan(xapiRequest);

	//request client connection from the pg_pool
	pg.connect(this.connectionString, function(error, client) {
		if(error) {
			//TODO log error
			callback(error, null);
		}
		else {
			var dbEventEmitter = new events.EventEmitter();
			//TODO add on.error for every subquery; use for loop?
			if(queryPlan.nodes) {
				var nodesQuery = client.query(queryPlan.nodes);
				nodesQuery.on('row', function(row) {
					dbEventEmitter.emit('node',rowToNode(row));
				});
				nodesQuery.on('error', function(error) {
					dbEventEmitter.emit('error', error);
				});
			}
			if(queryPlan.ways) {
				var waysQuery = client.query(queryPlan.ways);
				waysQuery.on('row', function(row) {
					dbEventEmitter.emit('way',rowToWay(row));
				});
				waysQuery.on('error', function(error) {
					dbEventEmitter.emit('error', error);
				});
			}
			if(queryPlan.relations) {
				var relationsQuery = client.query(queryPlan.relations);
				relationsQuery.on('row', function(row) {
					dbEventEmitter.emit('relation',rowToRelation(row));
				});
				relationsQuery.on('error', function(error) {
					dbEventEmitter.emit('error', error);
				});
			}
			client.on('error', function(error) {
				//TODO log error
				dbEventEmmiter.emit('error', error);
			});
			client.on('drain', function() {
				dbEventEmitter.emit('end');
			});

			callback(null, dbEventEmitter);
		}
	});
};

exports.PostgresDb = PostgresDb;


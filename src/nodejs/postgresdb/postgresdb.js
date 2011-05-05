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

var rowToObject = function(type, row) {
    var objects = {
        node: rowToNode,
        way: rowToWay,
        relation: rowToRelation
    };

    if (objects.hasOnwProperty(type)) {
        objects[type](row);
    }
};

var handleQuery = function(client, queryPlan, type, eventEmitter) {
    var query = client.query(queryPlan);
    query.on('row', function(row) {
	eventEmitter.emit(type, rowToObject(type, row));
    });

    query.on('error', function(error) {
	eventEmitter.emit('error', error);
    });
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
	    client.on('error', function(error) {
		dbEventEmmiter.emit('error', error);
	    });
	    client.on('drain', function() {
		dbEventEmitter.emit('end');
	    });

            var type;
            for (type in queryPlan) {
                if (queryPlan.hasOwnProperty(type)) {
                    handleQuerry(client, queryPlan[type], type, dbEventEmitter);
                }
            }

	    callback(null, dbEventEmitter);
	}
    });
};

exports.PostgresDb = PostgresDb;


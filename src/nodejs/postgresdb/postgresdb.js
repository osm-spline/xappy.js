var pg = require('pg');
var QueryBuilder = require('./querybuilder').QueryBuilder;

// logging
var log4js = require('log4js')();
var log = log4js.getLogger('postgresdb');

var PostgresDb = function(connectionString) {
    this.connectionString = connectionString;
};

var rowToNode = function(row) {
    log.debug('New node: ' + JSON.stringify(row));

    return {
        id: 0,
        lat: 0,
        long: 0
    };
};

var rowToWay = function(row) {
    log.debug('New way: ' + JSON.stringify(row));

    return {
        id: 0,
        nodes: []
    };
};

var rowToRelation = function(row) {
    log.debug('New relation: ' + JSON.stringify(row));

    return {
        id: 0,
        members: []
    };
};

var rowToObject = function(type, row) {
    var objects = {
        node: rowToNode,
        way: rowToWay,
        relation: rowToRelation
    };

    if (type in objects) {
        return objects[type](row);
    }

    log.warn('Invalid row type: ' + type);
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
	if (error) {
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
                handleQuerry(client, queryPlan[type], type, dbEventEmitter);
            }

	    callback(null, dbEventEmitter);
	}
    });
};

exports.PostgresDb = PostgresDb;


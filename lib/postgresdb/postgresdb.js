var events = require('events');
var pg = require('pg');
var QueryBuilder = require('./querybuilder').QueryBuilder;

/**
 * Constructor for the postgres database module.
 *
 * @constructor
 * @param connectionString The connection string for the database
 * e.g. pg://user:password@host/database
 * @param backend Introduced for testing
 */
var PostgresDb = function(connectionString, backend) {
    this.backend = backend || pg;
    this.connectionString = connectionString;
};

/**
 * Start a subquery from the queryPlan and add eventListerns for each subquery
 * Each eventListener emits events on the dbEventEmitter e.g. node event.
 * Emits a start event before the the first row.
 *
 * @param client The node-postgres client (connection)
 * @param queryPlan The subquery to execute
 * @param type The type of the subquery [node,way,relation]
 * @param eventEmitter The dbEventEmiter where we emit events
 */
var handleQuery = function(client, queryPlan, type, eventEmitter) {
    var query = client.query(queryPlan);
    query.on('row', function(row) {
        //TODO handle relations different as the structure of the query is different
        //multiple rows for each relation, each row represents one member
        if(eventEmitter.first) {
            eventEmitter.first=false;
            eventEmitter.emit('start');
        }
        eventEmitter.emit(type, require('./rowparser').rowToObject(type, row));
    });

    query.on('error', function(error) {
        eventEmitter.emit('error', error);
    });
};

/**
 * Function for processing an xapiRequest object. Calls the given callback
 * function.
 *
 * @param xapiRequest
 * @param {function} callback(error,dbEventEmitter)
 */
//TODO change callback to return error?
PostgresDb.prototype.executeRequest = function(xapiRequest, callback) {
    var queryBuilder = new QueryBuilder();
    var queryPlan = queryBuilder.createQueryPlan(xapiRequest);

    //request client connection from the pg_pool
    this.backend.connect(this.connectionString, function(error, client) {
    if (error) {
        callback(error, null);
    }
    else {
        var dbEventEmitter = new events.EventEmitter();
        dbEventEmitter.first = true;
        client.on('error', function(error) {
            dbEventEmitter.emit('error', error);
        });
        client.on('drain', function() {
            dbEventEmitter.emit('end');
        });

            var type;
            for (type in queryPlan) {
                handleQuery(client, queryPlan[type], type, dbEventEmitter);
            }

        callback(null, dbEventEmitter);
    }
    });
};

exports.PostgresDb = PostgresDb;

var events = require('events');
var pg = require('pg');
var QueryBuilder = require('./querybuilder').QueryBuilder;

// logging
var log4js = require('log4js')();
var log = log4js.getLogger('postgresdb');

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

var parseRowTags = function(rowTags) {
    var tags = [];
    var i;
    for(i=0; i<tags.length; i++) {
        tags.push({k:rowTags[i], v:rowTags[i+1]});
    }
    return tags;
};

/**
 * Function to convert a row from the database into a node object.
 *
 * @param row
 * @returns a node object
 */
var rowToNode = function(row) {
    log.debug('New node: ' + JSON.stringify(row));
    //TODO some values are optional e.g. version
    return {
        id: row.id,
        lat: row.lat,
        lon: row.lon,
        version: row.version,
        uid: row.user_id,
        user : row.user_name,
        changesetId: row.changeset_id,
        timestamp: row.tstamp,
        tags : parseRowTags(row.tags)
    };
};

/**
 * Function to convert a row from the database into a way object.
 *
 * @param row
 * @returns a way object
 */
var rowToWay = function(row) {
    log.debug('New way: ' + JSON.stringify(row));

    return {
        id: 0,
        nodes: []
    };
};

/**
 * Function to convert a row from the database into a relation object.
 *
 * @param row
 * @returns a relation object
 */
var rowToRelation = function(row) {
    log.debug('New relation: ' + JSON.stringify(row));

    return {
        id: 0,
        members: []
    };
};

/**
 * Function to convert row with given type into an appropriate object.
 *
 * @param type The type of the row
 * @param row The row from the database
 */
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

/**
 * Start a subquery from the queryPlan and add eventListerns for each subquery
 * Each eventListener emits events on the dbEventEmitter e.g. node event.
 *
 * @param client The node-postgres client (connection)
 * @param queryPlan The subquery to execute
 * @param type The tpye of the subquery [node,way,relation]
 * @param eventEmitter The dbEventEmiter where we emit events
 */
var handleQuery = function(client, queryPlan, type, eventEmitter) {
    var query = client.query(queryPlan);
    query.on('row', function(row) {
        eventEmitter.emit(type, rowToObject(type, row));
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


var events = require('events');
var pg = require('pg');
var QueryBuilder = require('./querybuilder').QueryBuilder;
var queryBuilder = require('./querybuilder');
var rowparser = require('./rowparser');

/**
 * Constructor for the postgres database module.
 *
 * @constructor
 * @param connectionString The connection string for the database
 * e.g. pg://user:password@host/database
 * @param backend Introduced for testing
 */
var PostgresDb = function (connectionString, backend) {
    this.backend = backend || pg;
    this.connectionString = connectionString;
};

/**
 * Start a subquery from the queryPlan and add eventListerns for each subquery
 * Each eventListener emits events e.g. node event.
 * Emits a start event before the the first row.
 *
 * @param client The node-postgres client (connection)
 * @param queryPlan The subquery to execute
 * @param type The type of the subquery [node,way,relation]
 * @param eventEmitter The emitter where we emit events
 */
var handleQuery = function (client, queryPlan, type, eventEmitter) {
    var query = client.query(queryPlan);
    query.on('row', function (row) {
        //TODO handle relations different as the structure of the query is different
        //multiple rows for each relation, each row represents one member
        //DONE
        if (eventEmitter.first) {
            eventEmitter.first = false;
            eventEmitter.emit('start');
        }
        var obj = rowparser.rowToObject(type, row);
        if (type === 'relation') {
            //handle relation
            if (eventEmitter.relation) {
                if (eventEmitter.relation.id === obj.id) {
                    //add memebers to relation
                    eventEmitter.relation.members.concat(obj.members);
                } else {
                    //emit relation and add obj as new relation
                    eventEmitter.emit(type,eventEmitter.relation);
                    eventEmitter.relation = obj;
                }
            } else {
                //add obj as new relation
                eventEmitter.relation = obj;
            }
        } else {
            eventEmitter.emit(type, obj);
        }
    });

    query.on('error', function (error) {
        eventEmitter.emit('error', error);
    });
};

/**
 * Function for processing an xapiRequest object. Calls the given callback
 * function.
 *
 * @param xapiRequest
 * @param {function} callback(error,emitter)
 */
PostgresDb.prototype.executeRequest = function (xapiRequest, callback) {
    var queryPlan = queryBuilder.createQueryPlan(xapiRequest);

    //request client connection from the pg_pool
    this.backend.connect(this.connectionString, function (error, client) {
        if (error) {
            callback(error, null);
        } else {
            var emitter = new events.EventEmitter();
            emitter.first = true;
            client.on('error', function (error) {
                emitter.emit('error', error);
            });
            client.on('drain', function () {
                if (emitter.relation) {
                    //emit last relation
                    emitter.emit('relation',emitter.relation);
                }
                emitter.emit('end');
            });

            // queryPlan has an element for each request it wants to execute
            // but all requests have the type (eg "node") as the key
            for (var type in queryPlan) {
                handleQuery(client, queryPlan[type], type, emitter);
            }
            callback(null, emitter);
        }
    });
};

PostgresDb.prototype.end = function() {
    this.backend.end();
};

exports.PostgresDb = PostgresDb;

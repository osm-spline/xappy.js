var sinon = require('sinon');

if (module == require.main) {
    require('async_testing').run(__filename, process.argv);
}

var PostgresDb = require('../../lib/postgresdb/postgresdb').PostgresDb;
var events = require('events');
module.exports = {
    'postgresdb.end()': function(test) {
        var backend = { end: function() {} };
        var end = sinon.spy(backend, "end");

        var db = new PostgresDb("connString", backend);
        db.end();
        test.ok(end.called);
        test.finish();
    },
    'test emitter functionality of query/client': function(test) {
        //test.numAssertions = 2;
        var myQueryObject = {
            object : 'node'
        };
        var backend = {
            connect : function(connectionString, callback) {
                var client = new events.EventEmitter();
                client.query = function(query) {
                    var queryEventEmitter = new events.EventEmitter();
                    setTimeout(function() {
                        //emit row event for this query
                        queryEventEmitter.emit('row', {
                            id: 1,
                            lat: 42.0,
                            lon: 23.0,
                            user_name: 'Ms. Testing',
                            user_id: 1234,
                            version: 23,
                            changeset_id: 234567,
                            tstamp: new Date()

                        });
                    },100);
                    setTimeout(function() {
                        //emit drain event for this client (end of all queries)
                        client.emit('drain', {});
                    },110);
                    return queryEventEmitter;
                };
                callback(null, client);
            }
        };
        var databaseModule = new PostgresDb('',backend);
        databaseModule.executeRequest(myQueryObject,function(error, ev){
            console.log(ev);
            ev.on('node', function(node) {
                //console.log(node);
                require('./../helpers/helper-data-structures').testnode(test,node);
                test.ok(true);
            });
            ev.on('end', function() {
                test.ok(true);
                test.finish();
            });
        });
    },
    'test for connection error': function(test) {
        test.numAssertions = 1;
        var myQueryObject = {
            object : 'node'
        };
        var backend = {
            connect : function(connectionString, callback) {
                callback("Simulated error", null);
            }
        };
        var databaseModule = new PostgresDb('',backend);
        databaseModule.executeRequest(myQueryObject,function(error, ev){
            test.ok(error);
            test.finish();
        });
    },
    'test emitter functionality for client/query errors': function(test) {
        test.numAssertions = 2;
        var myQueryObject = {
            object : 'node'
        };
        var backend = {
            connect : function(connectionString, callback) {
                var client = new events.EventEmitter();
                client.query = function(query) {
                    var queryEventEmitter = new events.EventEmitter();
                    setTimeout(function() {
                        //emit error event for client
                        client.emit('error', "clientError");
                    },110);setTimeout(function() {
                        //emit error event for query; perhaps this should be an own testcase?
                        queryEventEmitter.emit('error', "queryError");
                    },120);
                    return queryEventEmitter;
                };
                callback(null, client);
            }

        };
        var databaseModule = new PostgresDb('',backend);
        databaseModule.executeRequest(myQueryObject,function(error, ev){
            console.log(ev);
            ev.on('error', function(error) {
                if(error === "clientError") {
                    test.ok(true);
                }
                else if(error === "queryError") {
                    test.ok(true);
                    test.finish();
                }
            });
        });
    },
    'test all request cancel related operations' : function(test){
        var myQueryObject = {
            object : 'node'
        };
        var query = {
            on : sinon.spy(),
            once : sinon.spy(),
            removeAllListeners : sinon.spy(),
        }
        var client = {
            once : sinon.spy(),
            on : sinon.spy(),
            query : sinon.stub(),
            cancel : sinon.stub()

        }
        var backend = {
            connect : function(connectionString, callback) {

                client.query.returns(query);

                callback(null,client);
            }
        };
        var databaseModule = new PostgresDb('',backend);

        databaseModule.executeRequest(myQueryObject,function(err,emitter){
            test.equal(typeof emitter.cancel,'function');
            test.equal(emitter._runningQueries.length,1);

            emitter.cancel();
            client.cancel.calledWith(emitter._runningQueries[0]);

            for( i in query.once.args) {
                if(query.once.args[i][0] == 'end'){
                    query.once.args[i][1]();
                }
            }
            test.equal(emitter._runningQueries.length,0);


            test.finish();
        });

    },
};

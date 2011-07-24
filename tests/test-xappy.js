var sinon = require('sinon');
var Xapi = require('../lib/xappy');
var errorModule = require('../lib/error');
var getHttpHandler = Xapi.getHttpHandler;
var _ = require('underscore')._;

if (module == require.main) {
  require('coverage_testing').run(__filename, process.ARGV);
}


module.exports = {
    'httpHandler check uri': function(test) {
        var parse = sinon.spy();
        var uri = '/foo/bar';
        var req = { url: uri + '?thisshouldberemoved' };
        var res = sinon.spy();
        var cb = function(err, emitter) {};
        var handler = getHttpHandler(parse, cb)(req, res);
        // parser should get uri in first argument of first call
        test.equal(parse.args[0][0], uri);
        test.finish();
    },
    'httpHandler callback': function(test) {
        var callback = sinon.spy();
        var req = { url: '/xapi/node', headers: { 'content-type': 'test/test' } };
        var sampleRequest = require('./helpers/helper-samplexapirequestobjects.js');
        var parse = sinon.spy();
        var res = { an : "object" };

        var httpHandler = getHttpHandler(parse, callback);
        httpHandler(req,res);

        parse.args[0][1](null,sampleRequest.node);

        test.ok(callback.calledOnce);

        test.equal(res,callback.args[0][0]);
        test.equal(req.headers['content-type'],callback.args[0][1]);
        test.equal(null,callback.args[0][2]);
        test.equal(sampleRequest.node,callback.args[0][3]);

        test.finish();
    },
    'xapiRequestHandler': function(test){
        var generator =  sinon.spy();
        var emitterCallback = function() {};
        var getGen = sinon.stub().returns(generator);
        var callback = sinon.stub().returns(emitterCallback);
        var res = { an : "object" };
        var contentType = "bla/foo";
        var sampleRequest = require('./helpers/helper-samplexapirequestobjects.js').node;

        var db = {
            executeRequest : sinon.spy()
        };

        var reqHandler = Xapi.getXappyRequestHandler(db,getGen,callback);
        reqHandler(res,contentType,null,sampleRequest);

        test.ok(getGen.calledOnce,'getGen was not called');
        test.ok(getGen.calledWith(contentType),'getGen with wrong parameters');

        test.ok(db.executeRequest.calledOnce,'database request not executed');
        test.ok(db.executeRequest.calledWith(sampleRequest,emitterCallback),'database query started with wrong parameters');

        test.ok(callback.called);
        test.ok(callback.calledWith(res,generator));

        test.finish();
    },
    'xapiRequestHandler with error': function(test){
        var generator =  sinon.spy();
        var emitterCallback = function() {};
        var getGen = sinon.stub().returns(generator);
        var res = {
            writeHead : sinon.spy(),
            write : sinon.spy(),
            end : sinon.spy()
        };
        var db = {
            executeRequest : sinon.spy()
        };
        var contentType = "bla/foo";
        var sampleRequest = require('./helpers/helper-samplexapirequestobjects.js').node;

        var reqHandler = Xapi.getXappyRequestHandler(db,getGen,null);
        reqHandler(res, contentType,{ code : 400, message : 'blabla'}, null);

        test.ok(!getGen.called);
        test.ok(!db.executeRequest.called);
        test.ok(res.writeHead.calledWith(400));

        test.finish();
    },
    'emitterHandlers' : function(test){
        var res;
        var gen;

        emitterCallback = Xapi.getEmitterHandler(res,gen);

        var emitter = {
            on : sinon.spy(),
            once : sinon.spy()
        };

        emitterCallback(null,emitter);

        test.ok(emitter.once.calledWith('start'));
        test.ok(emitter.on.calledWith('node'));
        test.ok(emitter.on.calledWith('way'));
        test.ok(emitter.on.calledWith('relation'));
        test.ok(emitter.once.calledWith('end'));

        test.finish();
    },
    'emitterHandler callbacks' : function(test) {

        var res = {
            writeHead : sinon.spy(),
            write : sinon.spy(),
            end : sinon.spy()
        };
        var gen = {
            createHeader : sinon.stub().returns('header|'),
            createFooter : sinon.stub().returns('footer'),
            create : sinon.stub().returns('element|')
        };

        var callbacks = {};
        var mock = function(anEvent, callback) {
            callbacks[anEvent]=callback
        };
        var emitter = {
            on : mock,
            once : mock
        };

        emitterCallback = Xapi.getEmitterHandler(res,gen);
        emitterCallback(null,emitter);

        // start request
        callbacks.start();
        test.ok(res.writeHead.calledWith(200));
        test.ok(gen.createHeader.called);
        test.ok(res.write.calledWith('header|'));

        // write node
        callbacks.node('aNode');
        test.ok(res.write.calledWith('element|'));
        test.ok(gen.create.calledWith('node','aNode'));

        // write way
        callbacks.way('aWay');
        test.ok(res.write.calledWith('element|'));
        test.ok(gen.create.calledWith('way','aWay'));

        // write way
        callbacks.relation('aRel');
        test.ok(res.write.calledWith('element|'));
        test.ok(gen.create.calledWith('relation','aRel'));

        // end request
        callbacks.end();
        test.ok(gen.createFooter.called);
        test.ok(res.end.called);

        test.finish();
    },
    'emitterHandler with error' : function(test) {
         var res = {
            writeHead : sinon.spy(),
            write : sinon.spy(),
            end : sinon.spy()
        };

        var error = {};

        emitterCallback = Xapi.getEmitterHandler(res,null);
        emitterCallback(error,null);

        // error issued
        test.ok(res.writeHead.calledWith(500));

        test.finish();
    }
};


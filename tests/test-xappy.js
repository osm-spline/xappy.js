var sinon = require('sinon');
var Xapi = require('../lib/xappy');
var getGeneratorSelector = Xapi.getGeneratorSelector;
var getHttpHandler = Xapi.getHttpHandler;
var _ = require('underscore')._;

if (module == require.main) {
  require('async_testing').run(__filename, process.ARGV);
}

var xml = 'application/xml';
var json = 'application/json';

module.exports = {
    'errorHandler' : function(test,error){
        var error = {code : 400,message : 'blabla'};
        var body = error.message;
        var res = {
            writeHead : sinon.spy(),
            write : sinon.spy(),
            end : sinon.spy()
        };
        Xapi.errorHandler(res, error);
        test.ok(res.end.calledOnce);
        test.ok(res.writeHead.calledOnce);
        test.ok(res.writeHead.calledWith(400));
        test.ok(res.write.calledWith(body) || res.end.calledWith(body));
        test.finish();
    },
    'errorHandler with 500' : function(test,error){
        var error = {code : 500,message : 'blabla'};
        var body = error.message;
        var res = {
            writeHead : function(){},
            write : sinon.spy(),
            end : sinon.spy()
        };
        Xapi.errorHandler(res, error);
        test.ok(!res.write.calledWith(body) && !res.end.calledWith(body));
        test.finish();
    },

    'getGenerator': function(test) {
        var config = {};
        var gen = getGeneratorSelector(config)("content-type", "uri");
        test.equal(gen.contentType, xml);
        test.finish();
    },
    'getGenerator, get Json': function(test) {
        var config = {};
        var gen = getGeneratorSelector(config)(json, 'uri');
        test.equal(gen.contentType, json);
        test.finish();
    },
    'getGenerator, get Xml': function(test) {
        var config = {};
        var gen = getGeneratorSelector(config)(xml, 'uri');
        test.equal(gen.contentType, xml);
        test.finish();
    },
    'httpHandler check uri': function(test) {
        var parse = sinon.spy();
        var uri = '/foo/bar';
        var req = { url: uri + '?thisshouldberemoved' }
        var res = sinon.spy();
        var cb = function(err, emitter) {
        }
        var handler = getHttpHandler(parse, cb)(req, res);
        // parser should get uri in first argument of first call
        test.equal(parse.args[0][0], uri);
        test.finish();
    },
    /* 'httpHandler callback': function(test) {
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
        test.equal(req.url,callback.args[0][1]);
        test.equal(req.headers['content-type'],callback.args[0][2]);
        test.equal(null,callback.args[0][3]);
        test.equal(sampleRequest.node,callback.args[0][4]);

        test.finish();
    },*/
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
    // },
    // 'testHttpHandleCall': function(test) {

    //     fakeConfig = {
    //         host : "localhost",
    //         port : 90
    //     };

    //     // create spies
    //     var ebSpy = sinon.spy(db);

    //     var http = require('http'); 
    //     var httpStub = sinon.stub(http,'createServer');
    //     var httpSpy = sinon.spy();
    //     httpStub.returns({ listen : httpSpy });


    //     var xapi = Xapi.Xapi(fakeConfig);

    //     test.ok(httpStub.called);
    //     test.ok(httpSpy.calledWithExactly(fakeConfig.port,fakeConfig.host));

    //     http.createServer.restore();
    //     test.finish();
    }
};


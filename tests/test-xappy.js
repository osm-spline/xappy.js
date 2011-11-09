var sinon = require('sinon');
var xapi = require('../lib/xappy');
var _ = require('underscore')._;

if (module == require.main) {
  require('coverage_testing').run(__filename, process.argv);
}

module.exports = {

    'execute one function' : function(test){

        var obj = {};
        var spy = function spy(myobj,next){
            test.equal(obj,myobj);
            myobj.mark=true;
            next();
        }

        xapi.execute(obj,[spy],function callback(err,myobj){
            test.ok(myobj.mark);
            test.finish();
        });

    },

    'execute more functions' : function(test){

        var obj = {};
        var fun = function spy(myobj,next){
            sinon.assert.calledOnce(spy1);
            next();
        };

        var spy1 = sinon.spy(fun);
        var spy2 = sinon.spy(fun);

        xapi.execute(obj,[spy1,spy2],function callback(err,myobj){
            sinon.assert.calledOnce(spy2);
            test.finish();
        });
    },

    'execute abort with error' : function(test){

        var err = "some error";
        var obj = {};
        var fun = function fun(myobj,next){
            next(err);};

        var spy1 = sinon.spy(fun);
        var spy2 = sinon.spy(fun);

        xapi.execute(obj,[spy1,spy2],function callback(myerr,myobj){
            test.equal(err,myerr);
            sinon.assert.calledOnce(spy1);
            sinon.assert.notCalled(spy2);
            test.finish();
        });
    },

    'remove parameters from uri': function(test) {
        var uri = '/foo/bar';
        var xrs = { 'req' : { 'url' : uri + '?thisshouldberemoved'}};

        xapi.sanatizeUrl(xrs,function verifier(){
            test.equal(xrs.saneUrl, uri);
            test.finish();
        });
    },

    'call generator factory, to get generator' : function(test) {
        var stub = sinon.stub();
        stub.returns('anFunction');
        var xrs = { 'generatorSelector' : stub,
                    req : { headers : { 'content-type' : 'jsonEG'} } };

        xapi.getGenerator(xrs,function verifier(){
            test.ok(stub.calledWith('jsonEG'));
            test.equal(xrs.generator,'anFunction');
            test.finish();
        });
    },

    'call generator factory with invalid contenttype' : function(test) {
        var stub = sinon.stub();
        stub.throws('unknown content type');
        var xrs = { 'generatorSelector' : stub,
                    req : { headers : { 'content-type' : 'jsonEG'} } };

        xapi.getGenerator(xrs,function verifier(err){
            test.deepEqual(err,{ code: 500, msg: 'Error evaluate contenttyp'});
            test.finish();
        });
    },


    'parser is called correctly' : function(test) {
        var stub = sinon.stub();
        var xrs = { 'parse' : stub,
                    'saneUrl' : '/sane/url' };

        xapi.callParse(xrs,function verifier(){
            test.ok(xrs.xapiReq,'xapiRequest');
            test.finish();
        });

        // execute call back by hand, not so cool
        test.ok(stub.calledWith('/sane/url'));
        stub.getCall(0).args[1](null,'xapiRequest');
    },

    'parser retruned error' : function(test) {
        var stub = sinon.stub();
        var xrs = { 'parse' : stub,
                    'saneUrl' : '/sane/url' };

        xapi.callParse(xrs,function verifier(err){
            test.ok(err,'err'); // TODO: be more specific test this error
            test.finish();
        });

        // execute call back by hand, not so cool
        stub.getCall(0).args[1]('err');
    },

    'validater is called correctly' : function(test) {
        var stub = sinon.stub();
        var xrs = { 'validate' : stub,
                    'xapiReq' : 'xapiRequest' };

        xapi.callValidate(xrs,function verifier(){
            test.ok(xrs.xapiReq,'validRequest');
            test.finish();
        });

        // execute call back by hand, not so cool
        test.ok(stub.calledWith('xapiRequest'));
        stub.getCall(0).args[1](null,'validRequest');
    },

    'validater retruned error' : function(test) {
        var stub = sinon.stub();
        var xrs = { 'validate' : stub };

        xapi.callValidate(xrs,function verifier(err){
            test.equal(err,'err'); // TODO: be more specific test this error
            test.finish();
        });

        // execute call back by hand, not so cool
        stub.getCall(0).args[1]('err');
    },

    'db query started and event emitter recieved' : function(test) {
        var stub = sinon.stub();
        var xrs = { 'db': { 'executeRequest' : stub},
                    'xapiReq' : 'xapiRequest' };

        xapi.execQuery(xrs,function verifier(){
            test.equal(xrs.emitter,'emitter');
            test.finish();
        });

        // execute call back by hand, not so cool
        test.ok(stub.calledWith('xapiRequest'));
        stub.getCall(0).args[1](null,'emitter');
    },
/*
    'httpHandler callback': function(test) {
    //     var callback = sinon.spy();
    //     var req = { url: '/xapi/node', headers: { 'content-type': 'test/test' } };
    //     var sampleRequest = require('./helpers/helper-samplexapirequestobjects.js');
    //     var parse = sinon.spy();
    //     var res = { an : "object" };

    //     var httpHandler = getHttpHandler(parse, callback);
    //     httpHandler(req,res);

    //     parse.args[0][1](null,sampleRequest.node);

    //     test.ok(callback.calledOnce);

    //     test.equal(res,callback.args[0][0]);
    //     test.equal(req.headers['content-type'],callback.args[0][1]);
    //     test.equal(null,callback.args[0][2]);
    //     test.equal(sampleRequest.node,callback.args[0][3]);

    //     test.finish();
    // },
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
    },*/
    'enough and regesitered to correct event' : function(test){
        var res;
        var gen;

        var emitter = {
            on : sinon.spy(),
            once : sinon.spy()
        };

        xrs = {
            'emitter' : emitter
        }

        xapi.writeRes(xrs,function(){});

        // WARNING: i assume this works syncronous, doesn't have to stay like this

        test.ok(emitter.once.calledWith('start'));
        test.ok(emitter.on.calledWith('node'));
        test.ok(emitter.on.calledWith('way'));
        test.ok(emitter.on.calledWith('relation'));
        test.ok(emitter.once.calledWith('end'));

        test.finish();
    },
    'are emitter callbacks bound to rigth parser and res' : function(test) {

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

        // complex  mock of emitter
        var callbacks = {};
        var mock = function(anEvent, callback) {
            callbacks[anEvent]=callback
        };
        var emitter = {
            on : mock,
            once : mock
        };

        var xrs = {
            'res' : res,
            'generator' : gen,
            'emitter' : emitter
        }
        xapi.writeRes(xrs,function(){
            test.ok(gen.createFooter.called);
            test.ok(res.end.called);
            test.finish();
        });

        //emitterCallback = Xapi.getEmitterHandler(res,gen);
        //emitterCallback(null,emitter);

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
    },
};


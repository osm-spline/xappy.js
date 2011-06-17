var sinon = require('sinon'); 
var injector = require('../lib/injector.js');
var Xapi = require('../lib/xapi');
var getGenerator = Xapi.getGenerator;
var _ = require('underscore')._;

if (module == require.main) {
  require('async_testing').run(__filename, process.ARGV);
}

var xml = 'application/xml';
var json = 'application/json';

module.exports = {
    'getGenerator': function(test) {
        var config = {};
        var gen = getGenerator("content-type", config, "uri");
        test.equal(gen.contentType, xml);
        test.finish();
    },
    'getGenerator, get Json': function(test) {
        var config = {};
        var gen = getGenerator(json, config, 'uri');
        test.equal(gen.contentType, json);
        test.finish();
    },
    'getGenerator, get Xml': function(test) {
        var config = {};
        var gen = getGenerator(xml, config, 'uri');
        test.equal(gen.contentType, xml);
        test.finish();
    // },
    // 'testHttpHandleCall': function(test) {

    //     fakeConfig = {
    //         host : "localhost",
    //         port : 90
    //     };

    //     // create spies
    //     var db = injector.require('database');
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


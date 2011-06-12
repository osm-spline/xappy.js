var sinon = require('sinon'); 
var injector = require('../lib/injector.js');

if (module == require.main) {
  return require('async_testing').run(__filename, process.ARGV);
}

module.exports = {
  'testHttpHandleCall': function(test) {

    fakeConfig = {
        host : "localhost",
        port : 90
    };

    // create spies
    var db = injector.require('database');
    var ebSpy = sinon.spy(db);

    var http = require('http'); 
    var httpStub = sinon.stub(http,'createServer');
    var httpSpy = sinon.spy();
    httpStub.returns({ listen : httpSpy });
    
    
    var xapi = new require('../lib/xapi.js').Xapi(fakeConfig);
    
    xapi.init();

    test.ok(httpStub.called);
    test.ok(httpSpy.calledWithExactly(fakeConfig.port,fakeConfig.host));
    
    test.finish();
  },

  'test B': function(test) {
    test.ok(true);
    test.finish();
  },

  'test C': function(test) {
    test.ok(true);
    test.finish();
  },

  'test D': function(test) {
    test.ok(true);
    test.finish();
  }
};


var sinon = require('sinon');
var Xapi = require('../lib/xappy');
var getHttpHandler = Xapi.getHttpHandler;
var _ = require('underscore')._;

if (module == require.main) {
  require('coverage_testing').run(__filename, process.ARGV);
}


module.exports = {
    'writeError' : function(test,error){
        var error = {code : 400,message : 'blabla'};
        var body = error.message;
        var res = {
            writeHead : sinon.spy(),
            write : sinon.spy(),
            end : sinon.spy()
        };
        Xapi.writeError(res, error);
        test.ok(res.end.calledOnce);
        test.ok(res.writeHead.calledOnce);
        test.ok(res.writeHead.calledWith(400));
        test.ok(res.write.calledWith(body) || res.end.calledWith(body));
        test.finish();
    },
    'writeError with 204' : function(test,error){
        var error = { code : 204, message : 'blabla'};
        var res = {
            writeHead : function(){},
            write : sinon.spy(),
            end : sinon.spy()
        };
        Xapi.writeError(res, error);
        test.ok(!res.write.calledWith(error.message) && !res.end.calledWith(error.message));
        test.finish();
    }
};

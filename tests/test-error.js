var sinon = require('sinon');
var errorModule = require('../lib/error');
var _ = require('underscore')._;

if (module == require.main) {
  require('async_testing').run(__filename, process.argv);
}

module.exports = {
/*    'createError with empty parameters' : function(test) {
        var error = {
            createError : sinon.spy()
        };
        errorModule.createError();
        test.finish();
    },
*/
    'createError with code and message' : function(test) {
        var code = 401;
        var message = 'yagayagayo';
        var error = {
            code : code,
            message : message
        };
        test.deepEqual(errorModule.createError(code,message),error);
        test.finish();
    },

    'writeError' : function(test, error) {
        error = {code : 400,message : 'blabla'};
        var body = error.message;
        var res = {
            writeHead : sinon.spy(),
            write : sinon.spy(),
            end : sinon.spy()
        };
        errorModule.writeError(res, error);
        test.ok(res.end.calledOnce);
        test.ok(res.writeHead.calledOnce);
        test.ok(res.writeHead.calledWith(400));
        test.ok(res.write.calledWith(body) || res.end.calledWith(body));
        test.finish();
    },

    'writeError with 204' : function(test,error){
        error = { code : 204, message : 'blabla'};
        var res = {
            writeHead : function(){},
            write : sinon.spy(),
            end : sinon.spy()
        };
        errorModule.writeError(res, error);
        test.ok(!res.write.calledWith(error.message) && !res.end.calledWith(error.message));
        test.finish();
    }
};

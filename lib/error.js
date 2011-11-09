var log = require('log4js').getLogger('error');

/**
 * Purpose of this module
 * is to allow consistent error handling through :
 * - constructor of an error object
 * - handler function.
 *
 */

module.exports = {
/**
 * @description generic error handler for processing error objects
 * @param error {code = <HTTP Response Code>, message = <HTTP Response Body>}
 * @param res node.js HTTP response object
*/

    'createError' : function(code, message) {
        var error = {
            code : code,
            message : message
        };
        return error;
    },

    'writeError' : function(res, error){
        log.warn(JSON.stringify(error));

        res.writeHead(error.code || 400 , error.message || '', {'Content-Type': 'text/plain'});
        if (error.code !== 204) {
            res.write(error.message);
        }
        res.end();
    }
};

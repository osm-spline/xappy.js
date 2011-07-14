/**
 * @description generic error handler for processing error objects
 * @param error {code = <HTTP Response Code>, message = <HTTP Response Body>}
 * @param res node.js HTTP response object
*/
function writeError(res, error){
    log.warn(JSON.stringify(error));

    res.writeHead(error.code || 400 , error.message || '', {'Content-Type': 'text/plain'});
    if (error.code !== 204) {
        res.write(error.message);
    }
    res.end();
}

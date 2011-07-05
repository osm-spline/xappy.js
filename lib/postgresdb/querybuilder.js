var log4js = require('log4js')();
var log = log4js.getLogger('postgresdb/querybuilder');

var queryBuilders = {
    node: require('./nodequerybuilder'),
    way: require('./wayquerybuilder'),
    relation: require('./relationquerybuilder'),
    star: require('./starquerybuilder')
};

var createQueryPlan = function (xapiRequestObject) {
        return queryBuilders[xapiRequestObject.object].createQueryPlan(xapiRequestObject);
};

exports.createQueryPlan = createQueryPlan;

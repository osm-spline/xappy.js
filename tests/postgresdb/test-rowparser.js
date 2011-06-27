//make this test standalone
if (module == require.main) {
	require('async_testing').run(__filename, process.ARGV);
}
var _ = require('underscore');
var rowParser = require('../../lib/postgresdb/rowparser');
var helper = require('../helpers/helper-data-structures');
var testObjects = {
        node : {
            id: 1,
            version: 23,
            user_id: 42,
            user_name: 'Blub',
            tstamp: new Date(),
            changeset_id: 2342,
            tags: ['name','blub'],
            lat: 10.0,
            lon: 12.0
        },
        way : {
            id: 1,
            version: 23,
            user_id: 42,
            user_name: 'Blub',
            tstamp: new Date(),
            changeset_id: 2342,
            tags: ['name','blub'],
            nodes: [1,2,3,4]
        },
        relation : {
            id: 1,
            version: 23,
            user_id: 42,
            user_name: 'Blub',
            tstamp: new Date(),
            changeset_id: 2342,
            tags: ['name','blub'],
            member_id : 1234,
            member_role : 'blub',
            member_type : 'W'
        }
};

module.exports = {
    'parse row to node' : function(test) {
        helper.testnode(test,rowParser.rowToNode(testObjects.node));
        test.finish();
    },
    'parse row to way' : function(test) {
        helper.testway(test,rowParser.rowToWay(testObjects.way));
        test.finish();
    },
    'parse row to relation' : function(test) {
        console.log(rowParser.rowToRelation(testObjects.relation));
        helper.testrelation(test,rowParser.rowToRelation(testObjects.relation));
        test.finish();
    }/*,
    'test rowToObject' : function(test) {
        _.each(testObjects,function(value, key) {
            rowParser.rowToObject(key,value); //TODO THINK ABOUT IT
            test.finish();
        });
    }*/

};

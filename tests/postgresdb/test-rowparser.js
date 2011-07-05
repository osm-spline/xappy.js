//make this test standalone
if (module == require.main) {
	require('async_testing').run(__filename, process.ARGV);
}
var _ = require('underscore');
var sinon = require('sinon');

var rowParser = require('../../lib/postgresdb/rowparser');
var helper = require('../helpers/helper-data-structures');

var DATE = new Date();

var ROWS = {
        node : {
            id: 1,
            version: 23,
            user_id: 42,
            user_name: 'Blub',
            tstamp: DATE,
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
            tstamp: DATE,
            changeset_id: 2342,
            tags: ['name','blub'],
            nodes: [1,2,3,4]
        },
        relation : {
            id: 1,
            version: 23,
            user_id: 42,
            user_name: 'Blub',
            tstamp: DATE,
            changeset_id: 2342,
            tags: ['name','blub'],
            member_id : 1234,
            member_role : 'blub',
            member_type : 'W'
        }
};

var EXPECTED = {
    node: {
            id: 1,
            version: 23,
            uid: 42,
            user: 'Blub',
            timestamp: ROWS.node.tstamp,
            changeset: 2342,
            lat: 10.0,
            lon: 12.0,
            tags: [{key:'name',value:'blub'}]
        },
        way : {
            id: 1,
            version: 23,
            uid: 42,
            user: 'Blub',
            timestamp: DATE,
            changeset: 2342,
            tags: [{key:'name',value:'blub'}],
            nodes: [1,2,3,4]
        },
        relation : {
            id: 1,
            version: 23,
            uid: 42,
            user: 'Blub',
            timestamp: DATE,
            changeset: 2342,
            tags: [{key:'name',value:'blub'}],
            members: [
                {
                    type: 'way',
                    reference: 1234,
                    role: 'blub'
                }]
        }


};

module.exports = {
    'parse row to node' : function(test) {
        var result = rowParser.rowToNode(ROWS.node);
        helper.testnode(test,result);
        test.deepEqual(EXPECTED.node,result);
        test.finish();
    },
    'parse row to way' : function(test) {
        var result = rowParser.rowToWay(ROWS.way);
        helper.testway(test,result);
        test.finish();
    },
    'parse row to relation' : function(test) {
        var result = rowParser.rowToRelation(ROWS.relation);
        helper.testrelation(test,result);
        test.finish();
    }/*,
    'test rowToObject' : function(test) {
        var spies = {
            node: sinon.spy(rowParser,'rowToNode'),
            way: sinon.spy(rowParser, 'rowToWay'),
            relation: sinon.spy(rowParser, 'rowToRelation')
        };

        _.each(ROWS,function(value, key) {
            rowParser.rowToObject(key,value);
            test.ok(spies[key].called);
        });

        test.finish();
    }*/

};

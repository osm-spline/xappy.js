//make this test standalone
if (module == require.main) {
    require('coverage_testing').run(__filename, process.ARGV);
}

var SqlQuery = require(__dirname + '/sqlquery').SqlQuery;
var queryBuilder = require('../../lib/postgresdb/querybuilder');
//var _ = require('underscore');

module.exports = {
    //api/0.6/node
    '//api/0.6/node': function(test) {
        var xapiRequestObject = {
            name : "nodes",
            text : "SELECT n.id, n.version, n.user_id, n.changeset_id FROM nodes n;",
            binary : true
        };

        var xapiQueryObject = {
            object : 'node'
        };

        var expected = {
            0 : {
                id: 1,
                version: 1,
                user_id: 291857,
                changeset_id: 123456
            },
            1 : {
                id: 2,
                version: 1,
                user_id: 291857,
                changeset_id: 123456
            },
            2 : {
                id: 3,
                version: 1,
                user_id: 291857,
                changeset_id: 123456
            },
            3 : {
                id: 4,
                version: 1,
                user_id: 291857,
                changeset_id: 123456
            },
            4 : {
                id: 5,
                version: 1,
                user_id: 291857,
                changeset_id: 123456
            },
            5 : {
                id: 6,
                version: 1,
                user_id: 291857,
                changeset_id: 123456
            },
            6 : {
                id: 7,
                version: 1,
                user_id: 291857,
                changeset_id: 123456
            }

        };
            /*
            //TODO
            //id, version, user, user_id, tstamp, changeset_id, tags, latitude, longitude
            node : {
                {1, 1, sladda, 291857, 2011-05-26T16:47:48+00:00, {'amenity': 'hospital', 'name': 'Wilhelminenspital'}, 51.415, 9.427},
                {2, 1, sladda, 291857, 2011-05-26T16:47:48+00:00, {}, 53.6, 7.2},
                {3, 1, sladda, 291857, 2011-05-26T16:47:48+00:00, {'amenity': 'hotel', 'name': 'HomeSweetHome'}, 47.999, 7.8526},
                {4, 1, sladda, 291857, 2011-05-26T16:47:48+00:00, {'amenity': 'hotel', 'name': 'WalthersTruckStop'}, 47.999, 7.8526},
                {5, 1, sladda, 291857, 2011-05-26T16:47:48+00:00, {'amenity': 'bar', 'name': 'Lucies'}, 49.7, 13.4},
                {6, 1, sladda, 291857, 2011-05-26T16:47:48+00:00, {'building': 'emblem', 'name': 'brandenburgerTor'}, 53.33, 11.52},
                {7, 1, sladda, 291857, 2011-05-26T16:47:48+00:00, {'amenity': 'hospital', 'name': 'HeisseSchwestern'}, 48.13, 11.7}
            },

            way : {
                {}
            },

            relation : {
                {}
            }
            */

        var areEqual = function(objA, objB){
            for (var p in objA) {
                if(typeof(objA[p]) !== typeof(objB[p])) return false;
                if((objA[p]===null) !== (objB[p]===null)) return false;
                switch (typeof(objA[p])) {
                    case 'undefined':
                        if (typeof(objB[p]) != 'undefined') return false;
                        break;
                    case 'object':
                        if(objA[p]!==null && objB[p]!==null && (objA[p].constructor.toString() !== objB[p].constructor.toString() || !objA[p].equals(objB[p]))) return false;
                        break;
                    case 'function':
                        if (p != 'equals' && objA[p].toString() != objB[p].toString()) return false;
                        break;
                    default:
                        if (objA[p] !== objB[p]) return false;
                    }
                }
                return true;
            };

        var queryPlan = queryBuilder.createQueryPlan(xapiQueryObject);

        var input = new SqlQuery().createQuery(queryPlan,function(error, result){
            if(error) {
                test.ok(false);
                test.finish();
                return;
            } else {
                //Number of rows in result
                var length = Object.keys(expected).length;

                //If I don't get the expected number of rows, quit.
                if(length !== result.rows.length) {
                    console.log('WRONG LENGTH! ' + result.rows.length + " != " + Object.keys(expected).length + "(Expected)");
                    test.ok(false);
                    test.finish();
                    return;
                }

                var row;
                var true_count = 0;

                for(var i = 0; i < length; i++) {
                    row = result.rows[i];

                    for(var j = 0; j < length; j++) {
                        //TODO: check for more than ID?
                        if(row['id'] === expected[j]['id']) {
                            true_count++;
                            break;
                        }
                    }
                }

                if(true_count == length) {
                    test.ok(true);
                    test.finish();
                } else {
                    test.ok(false);
                    test.finish();
                }
            }
        }); //END callback function
    }   //END function(test)
};  //END exports

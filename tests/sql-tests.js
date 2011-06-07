//make this test standalone
if (module == require.main) {
	require('async_testing').run(__filename, process.ARGV);
}

var SqlQuery = require(__dirname + '/sqlquery').SqlQuery;
//var _ = require('underscore');

module.exports = {
	//api/0.6/node
	'//api/0.6/node': function(test) {
		var xapiRequestObject = {
			name : "blub",
			text : "SELECT n.id, n.version FROM nodes n LIMIT 2;", //"SELECT n.id, n.version, u.name FROM nodes n, users u WHERE n.user_id = u.id LIMIT 2;",
			binary : true //funktioniert nur mit dem pg-module von alex
		};
		
		var expected = {
			0 : {
				id: 1,
				version: 1
			},
			1 : {
				id: 2,
				version: 1
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

		var input = new SqlQuery().createQuery(xapiRequestObject,function(error, result){
            if(error) {
                console.log(error);
                test.ok(false);
            } else {
				var length = Object.keys(expected).length;
				
				//If I don't get the expected number of rows, quit.
				if(length !== result.rows.length) {
					console.log('WRONG LENGTH! ' + Object.keys(expected).length + " != " + result.rows.length);
					test.ok(false);
					test.finish();
					return;
				}
				
				var row;
				var true_count = 0;
				
				for(var i = 0; i < length; i++) {
					row = result.rows[i];
					
					for(var j = 0; j < length; j++) {
						if(areEqual(row, expected[j])) {
							//console.log('EQUAL: ' + i + ' & ' + j);
							true_count++;
							break;
						} else {
							//console.log('NOT EQUAL: ' + i + ' & ' + j);
						}
					}
					
					//test.deepEqual(row, expected[i], 'Nodes Query on DB');
					//^ doesn't work, because test.deepEqual doesn't return anything
				}
				
				//console.log('TRUE COUNT: ' + true_count);
				
				//If we find all the returned rows in the expected object: SUCCESS
				//Possible problem: if the same row gets returned twice
				//Possible solution: keep array of checked rows || select distinct
				if(true_count == length) {
					test.ok(true);
					test.finish();
				} else {
					test.ok(false);
					test.finish();
				}
            }
        });	//END callback function
	}	//END function(test)
};	//END exports

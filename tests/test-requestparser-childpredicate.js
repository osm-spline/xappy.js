/**
 * Softwareproject: osm-spline-xapi
 * author: Mohamed Keita
 * Test for request parser using child elements predicates
 */
/*
 * All Child elements predicates
 * /api/0.6/way[nd] - selects ways that have at least one node
 * /api/0.6/way[tag] - selects ways that have at least one tag
 * /api/0.6/way[not(nd)] - only selects ways that do not have any nodes
 * /api/0.6/way[not(tag)] - only selects ways that do not have any tags
 * /api/0.6/node[way] - selects nodes that belong to at least one way
 * /api/0.6/node[not(way)] - selects nodes that do not belong to any way
 * /api/0.6/node[not(tag)] - selects nodes that do not have any tags
 * /api/0.6/relation[node] - selects relations that have at least one node member
 * /api/0.6/relation[way] - selects relations that have at least one way member
 * /api/0.6/relation[relation] - selects relations that have at least one relation member
 * /api/0.6/relation[not(node)] - selects relations that do not have any node members
 * /api/0.6/relation[not(way)] - selects relations that do not have any way members
 * /api/0.6/relation[not(relation)] - selects relations that do not have any relation members
 */

// var parser = require('../lib/requestParser');
var parser= require('./tmp-requestparser.js');
var underscore = require('underscore');

// example data for child predicates
// Datastructure
// child*: {
//        has: <boolean>,
//        attribute: "node" | "way" | "relation" | "tag"
//    }

// tests
module.exports = {
	'"Child predicate:" /way[nd]': function(test) {
		var elem= 
		{xpath_expr: '/way[nd]', 
		 object: 'way',
		 child:{has: true, attribute: 'nd'}
		};
		var xpath_expr= elem.xpath_expr;
                var obj= elem.object;
                var child= elem.child;
                var p= parser.Parser(xpath_expr);
                var xapi_obj= p.xpath(); // return json object (object, predicates)
                // check each returned object
                test.deepEqual(xapi_obj.object, obj, 'Expected Object:' + obj + ':xpath object:' + xapi_obj.object);
                test.deepEqual(xapi_obj.predicates[0],child, 'Expected Child predicate object:'+ child + 'xpath object:' + xapi_obj.predicates[0]);
                test.finish();
	},
	'"Child predicate:" /way[tag]': function(test) {
		var elem=
		{xpath_expr: '/way[tag]', 
		 object: 'way', 
		 child:{has: true, attribute: 'tag'}
		};
		var xpath_expr= elem.xpath_expr;
                var obj= elem.object;
                var child= elem.child;
                var p= parser.Parser(xpath_expr);
                var xapi_obj= p.xpath(); // return json object (object, predicates)
                // check each returned object
                test.deepEqual(xapi_obj.object, obj, 'Expected Object:' + obj + ':xpath object:' + xapi_obj.object);
                test.deepEqual(xapi_obj.predicates[0],child, 'Expected Child predicate object:'+ child + 'xpath object:' + xapi_obj.predicates[0]);
                test.finish();

	},
	'"Child predicate:" /way[not(nd)]': function(test) {
		var elem=
		{xpath_expr: '/way[not(nd)]', 
		 object: 'way',
		 child:{has: false, attribute: 'nd'}
		};
		var xpath_expr= elem.xpath_expr;
                var obj= elem.object;
                var child= elem.child;
                var p= parser.Parser(xpath_expr);
                var xapi_obj= p.xpath(); // return json object (object, predicates)
                // check each returned object
                test.deepEqual(xapi_obj.object, obj, 'Expected Object:' + obj + ':xpath object:' + xapi_obj.object);
                test.deepEqual(xapi_obj.predicates[0],child, 'Expected Child predicate object:'+ child + 'xpath object:' + xapi_obj.predicates[0]);
                test.finish();
	
	},
	'"Child predicate:" /way[not(tag)]': function(test) {
		var elem=
		{xpath_expr: '/way[not(tag)]', 
		 object: 'way',
		 child:{has: false, attribute: 'tag'}
		};
		var xpath_expr= elem.xpath_expr;
                var obj= elem.object;
                var child= elem.child;
                var p= parser.Parser(xpath_expr);
                var xapi_obj= p.xpath(); // return json object (object, predicates)
                // check each returned object
                test.deepEqual(xapi_obj.object, obj, 'Expected Object:' + obj + ':xpath object:' + xapi_obj.object);
                test.deepEqual(xapi_obj.predicates[0],child, 'Expected Child predicate object:'+ child + 'xpath object:' + xapi_obj.predicates[0]);
                test.finish();
	} ,
	'"Child predicate:" /node[way]': function(test) {
		var elem=
		{xpath_expr: '/node[way]', 
		 object: 'node',
		 child:{has: true, attribute: 'way'}
		};
		var xpath_expr= elem.xpath_expr;
                var obj= elem.object;
                var child= elem.child;
                var p= parser.Parser(xpath_expr);
                var xapi_obj= p.xpath(); // return json object (object, predicates)
                // check each returned object
                test.deepEqual(xapi_obj.object, obj, 'Expected Object:' + obj + ':xpath object:' + xapi_obj.object);
                test.deepEqual(xapi_obj.predicates[0],child, 'Expected Child predicate object:'+ child + 'xpath object:' + xapi_obj.predicates[0]);
                test.finish();
	},
	'"Child predicate:" /node[not(way)]': function(test) {
		var elem=
		{xpath_expr: '/node[not(way)]', 
		 object: 'node',
		 child:{has:false, attribute: 'way'}
		};
		var xpath_expr= elem.xpath_expr;
                var obj= elem.object;
                var child= elem.child;
                var p= parser.Parser(xpath_expr);
                var xapi_obj= p.xpath(); // return json object (object, predicates)
                // check each returned object
                test.deepEqual(xapi_obj.object, obj, 'Expected Object:' + obj + ':xpath object:' + xapi_obj.object);
                test.deepEqual(xapi_obj.predicates[0],child, 'Expected Child predicate object:'+ child + 'xpath object:' + xapi_obj.predicates[0]);
                test.finish();
	},
	'"Child predicate:" /node[not(tag)]': function(test) {
		var elem=
		{xpath_expr: '/node[not(tag)]', 
		 object: 'node', 
		 child: {has: false, attribute: 'tag'}
		};
		var xpath_expr= elem.xpath_expr;
                var obj= elem.object;
                var child= elem.child;
                var p= parser.Parser(xpath_expr);
                var xapi_obj= p.xpath(); // return json object (object, predicates)
                // check each returned object
                test.deepEqual(xapi_obj.object, obj, 'Expected Object:' + obj + ':xpath object:' + xapi_obj.object);
                test.deepEqual(xapi_obj.predicates[0],child, 'Expected Child predicate object:'+ child + 'xpath object:' + xapi_obj.predicates[0]);
                test.finish();
	},
	'"Child predicate:" /relation[node]': function(test) {
		var elem= 
		{xpath_expr: '/relation[node]', 
		 object: 'relation',
		 child: {has: true, attribute: 'node'}
		};
		var xpath_expr= elem.xpath_expr;
                var obj= elem.object;
                var child= elem.child;
                var p= parser.Parser(xpath_expr);
                var xapi_obj= p.xpath(); // return json object (object, predicates)
                // check each returned object
                test.deepEqual(xapi_obj.object, obj, 'Expected Object:' + obj + ':xpath object:' + xapi_obj.object);
                test.deepEqual(xapi_obj.predicates[0],child, 'Expected Child predicate object:'+ child + 'xpath object:' + xapi_obj.predicates[0]);
                test.finish();
	} ,
	'"Child predicate:" /relation[way]': function(test) {
		var elem=
		{xpath_expr: '/relation[way]', 
		 object: 'relation', 
		 child: {has: true, attribute: 'way'}
		};
		var xpath_expr= elem.xpath_expr;
                var obj= elem.object;
                var child= elem.child;
                var p= parser.Parser(xpath_expr);
                var xapi_obj= p.xpath(); // return json object (object, predicates)
                // check each returned object
                test.deepEqual(xapi_obj.object, obj, 'Expected Object:' + obj + ':xpath object:' + xapi_obj.object);
                test.deepEqual(xapi_obj.predicates[0],child, 'Expected Child predicate object:'+ child + 'xpath object:' + xapi_obj.predicates[0]);
                test.finish();
	},
	'"Child predicate:" /relation[relation]': function(test) {
		var elem= 
		{xpath_expr: '/relation[relation]', 
		 object: 'relation', 
		 child: {has: true, attribute: 'relation'}
		};
		var xpath_expr= elem.xpath_expr;
                var obj= elem.object;
                var child= elem.child;
                var p= parser.Parser(xpath_expr);
                var xapi_obj= p.xpath(); // return json object (object, predicates)
                // check each returned object
                test.deepEqual(xapi_obj.object, obj, 'Expected Object:' + obj + ':xpath object:' + xapi_obj.object);
                test.deepEqual(xapi_obj.predicates[0],child, 'Expected Child predicate object:'+ child + 'xpath object:' + xapi_obj.predicates[0]);
                test.finish();

	},
	'"Child predicate:" /relation[not(node)]': function(test) {
		var elem=
		{xpath_expr: '/relation[not(node)]', 
		 object: 'relation', 
		 child: {has: false, attribute: 'node'}
		};
		var xpath_expr= elem.xpath_expr;
                var obj= elem.object;
                var child= elem.child;
                var p= parser.Parser(xpath_expr);
                var xapi_obj= p.xpath(); // return json object (object, predicates)
                // check each returned object
                test.deepEqual(xapi_obj.object, obj, 'Expected Object:' + obj + ':xpath object:' + xapi_obj.object);
                test.deepEqual(xapi_obj.predicates[0],child, 'Expected Child predicate object:'+ child + 'xpath object:' + xapi_obj.predicates[0]);
                test.finish();
	},
	'"Child predicate:" /relation[not(way)]': function(test) {
		var elem=
		{xpath_expr: '/relation[not(way)]', 
		 object: 'relation', 
		 child: {has: false, attribute: 'way'}
		};
		var xpath_expr= elem.xpath_expr;
                var obj= elem.object;
                var child= elem.child;
                var p= parser.Parser(xpath_expr);
                var xapi_obj= p.xpath(); // return json object (object, predicates)
                // check each returned object
                test.deepEqual(xapi_obj.object, obj, 'Expected Object:' + obj + ':xpath object:' + xapi_obj.object);
                test.deepEqual(xapi_obj.predicates[0],child, 'Expected Child predicate object:'+ child + 'xpath object:' + xapi_obj.predicates[0]);
                test.finish();
	},
	'"Child predicate:" /relation[not(relation)]': function(test) {
		var elem=
		{xpath_expr: '/relation[not(relation)]',
		 object: 'relation',  
		 child: {has: false, attribute: 'relation'}
		};
		var xpath_expr= elem.xpath_expr;
                var obj= elem.object;
                var child= elem.child;
                var p= parser.Parser(xpath_expr);
                var xapi_obj= p.xpath(); // return json object (object, predicates)
                // check each returned object
                test.deepEqual(xapi_obj.object, obj, 'Expected Object:' + obj + ':xpath object:' + xapi_obj.object);
                test.deepEqual(xapi_obj.predicates[0],child, 'Expected Child predicate object:'+ child + 'xpath object:' + xapi_obj.predicates[0]);
                test.finish();
	}
}
if (module === require.main) {
    require('async_testing').run(__filename, process.ARGV);
}

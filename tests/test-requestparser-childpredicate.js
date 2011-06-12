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
// feature: 'child=nd|not(nd)|way|not(way)|tag|not(tag)|node|not(node)|relation|not(relation)'
// attributes: node, way, relation, tag
// tests
// -----
module.exports = {
 // author (Mohamed Keita)
 'child element predicates': function(test) {
	// example data for child predicates
	// feature: 'child=nd|not(nd)|way|not(way)|tag|not(tag)|node|not(node)|relation|not(relation)'
	// attributes: node, way, relation, tag
	// xpath expression for child element predicates

	// test
	var xpath_child_predicates= [  '/way[nd]',
                               '/way[tag] ',
                               '/way[not(nd)]',
                               '/way[not(tag)]',
                               '/node[way]',
                               '/node[not(way)]',
                               '/node[not(tag)]',
                               '/relation[node]',
                               '/relation[way]',
                               '/relation[relation]',
                               '/relation[not(node)]',
                               '/relation[not(way)]',
                               '/relation[not(relation)]'];
	//
	var success= 0 ;
	var failed= 0 ;
	underscore.each(xpath_child_predicates, function(xpath_expr) {
        	try {
			var p= parser.Parser(xpath_expr);
            		var obj= p.xpath(); // array of json object
            		// object and predicates
       		} catch (error) {
            	     failed++;
       		}
       		success++;
   	 });
	test.finish();
  }
}
if (module === require.main) {
    require('async_testing').run(__filename, process.ARGV);
}

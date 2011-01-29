var assert = require('assert');
var test = require('../parse.js');


//TODO function does not exist yet
var toTest = test.urlToXpathObj;


// test all simple objects { node, way, relation }

var simpleNodeString = "/node";
var expected = { object: "node" };
assert.deepEqual(toTest(simpleNodeString), expected);

var simpleNodeStringTrail = "/node/";
var expected = { object: "node" };
assert.deepEqual(toTest(simpleNodeStringTrail), expected);

var simpleWayString = "/way";
var expected = { object: "way" };
assert.deepEqual(toTest(simpleWayString), expected);

var simpleWayStringTrail = "/way/";
var expected = { object: "way" };
assert.deepEqual(toTest(simpleWayStringTrail), expected);

var simpleRelationString = "/relation";
var expected = { object: "relation" };
assert.deepEqual(toTest(simpleRelationString), expected);

var simpleRelationStringTrail = "/relation/";
var expected = { object: "relation" };
assert.deepEqual(toTest(simpleRelationStringTrail), expected);

// TODO invalid object eg not (node, way, relation)

var nodeWithBbox = "/node[bbox=0,51.5,0.25,51.75]";
var expected = { object: "node", bbox: {left:0, bottom:51.5, right:0.25, top:51.75} };
assert.deepEqual(toTest(nodeWithBbox), expected);

var nodeWithSimpleTag = "/node[key=value]";
var expected = { object: "node", tag: { key:["key"], value:["value"]}}; 
assert.deepEqual(toTest(nodeWithSimpleTag), expected);

var nodeWithTwoValues = "/node[tag=foo|bar]";
var expected = { object: "node", tag: { key:["key"], value:["foo", "bar"]}};
assert.deepEqual(toTest(nodeWithTwoValues), expected);

var nodeWithTwoKeys = "/node[foo,bar=value]";
var expected = { object: "node", tag: { key:["foo", "bar"], value:["value"]}};
assert.deepEqual(toTest(nodeWithTwoKeys), expected);

var tagCrossProduct = "/node[key1,key2=value1,value2]";
var expected = { object: "node", tag: {key:["key1", "key2"], value:["value1", "value2"]}};
assert.deepEqual(toTest(tagCrossProduct), expected);

var nodeBboxTag = "/node[bbox=0,0,0,0][key=value]";
var nodeTagBbox = "/node[bbox=0,0,0,0][key=value]";
var expected = { object: "node", bbox: {left:0,bottom:0,right:0,top:0}, tag: {key:["key"], value:["value"]}};
assert.deepEqual(toTest(nodeBboxTag), expected);
assert.deepEqual(toTest(nodeTagBbox), expected);



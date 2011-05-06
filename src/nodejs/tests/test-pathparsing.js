if (module == require.main) {
  async_testing = require('async_testing');
  return async_testing.run(__filename, process.ARGV);
}
var assert = require('assert');

var test = require('../parse.js');
//TODO function does not exist yet
var toTest = test.urlToXpathObj;

// TODO invalid object eg not (node, way, relation)

module.exports =

  // simple tests
  { 'simple node': function(test) {
    test.ok(true);
    var simpleNodeString = "/node";
    var expected = { object: "node" };
    assert.deepEqual(toTest(simpleNodeString), expected);
    test.finish();
  }
  , 'simple way': function(test) {
    test.ok(true);
    var simpleWayString = "/way";
    var expected = { object: "way" };
    assert.deepEqual(toTest(simpleWayString), expected);
    test.finish();
  }
 , 'simple relation': function(test) {
    test.ok(true);
    var simpleRelationString = "/relation";
    var expected = { object: "relation" };
    assert.deepEqual(toTest(simpleRelationString), expected);
    test.finish();
  }

  // simple tests with trailing /
 , 'simple node string with trailing /': function(test) {
    test.ok(true);
    var simpleNodeStringTrail = "/node/";
    var expected = { object: "node" };
    assert.deepEqual(toTest(simpleNodeStringTrail), expected);
    test.finish();
  }
 , 'simple way string with trailing /': function(test) {
    test.ok(true);
    var simpleWayStringTrail = "/way/";
    var expected = { object: "way" };
    assert.deepEqual(toTest(simpleWayStringTrail), expected);
    test.finish();
  }
  , 'simple relation string with trailing /': function(test) {
    test.ok(true);
    var simpleRelationStringTrail = "/relation/";
    var expected = { object: "relation" };
    assert.deepEqual(toTest(simpleRelationStringTrail), expected);
    test.finish();
  }

  // bbox tests
 , 'simple bbox test': function(test) {
    test.ok(true);
    var nodeWithBbox = "/node[bbox=0,51.5,0.25,51.75]";
    var expected = { object: "node", bbox: {left:0, bottom:51.5, right:0.25, top:51.75} };
    assert.deepEqual(toTest(nodeWithBbox), expected);
    test.finish();
  }

  // tag tests
 , 'simple tag': function(test) {
    test.ok(true);
    var nodeWithSimpleTag = "/node[key=value]";
    var expected = { object: "node", tag: { key:["key"], value:["value"]}}; 
    assert.deepEqual(toTest(nodeWithSimpleTag), expected);
    test.finish();
  }
 , 'tag with two values': function(test) {
    test.ok(true);
    var nodeWithTwoValues = "/node[tag=foo|bar]";
    var expected = { object: "node", tag: { key:["tag"], value:["foo", "bar"]}};
    assert.deepEqual(toTest(nodeWithTwoValues), expected);
    test.finish();
  }
   , 'tag with two keys': function(test) {
   test.ok(true);
   var nodeWithTwoKeys = "/node[foo|bar=value]";
   var expected = { object: "node", tag: { key:["foo", "bar"], value:["value"]}};
   assert.deepEqual(toTest(nodeWithTwoKeys), expected);
   test.finish();
  }
   , 'tags with cross product': function(test) {
    test.ok(true);
    var tagCrossProduct = "/node[key1|key2=value1|value2]";
    var expected = { object: "node", tag: {key:["key1", "key2"], value:["value1", "value2"]}};
    assert.deepEqual(toTest(tagCrossProduct), expected);
    test.finish();
  }
     , 'bbox before tag': function(test) {
    test.ok(true);
    var nodeBboxTag = "/node[bbox=0,0,0,0][key=value]";
    var expected = { object: "node", bbox: {left:0,bottom:0,right:0,top:0}, tag: {key:["key"], value:["value"]}};
    assert.deepEqual(toTest(nodeBboxTag), expected);
    test.finish();
  }
     , 'tag before bbox': function(test) {
    test.ok(true);
    var nodeTagBbox = "/node[bbox=0,0,0,0][key=value]";
    var expected = { object: "node", bbox: {left:0,bottom:0,right:0,top:0}, tag: {key:["key"], value:["value"]}};
    assert.deepEqual(toTest(nodeTagBbox), expected);
    test.finish();
  }
};

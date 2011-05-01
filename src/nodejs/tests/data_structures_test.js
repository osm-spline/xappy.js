if (module == require.main) {
  async_testing = require('async_testing');
  return async_testing.run(__filename, process.ARGV);
}
var assert = require('assert');

//Datei data_structure_prototypes.js does not exist yet
var test = require('../data_structure_prototypes.js');
//TODO function does not exist yet
var toTest = test.node;

module.exports = {
 
   // is-it-a-valid-object tests
 'node': function(test) {
    // test.ok(true);
    //var simpleNodeString = "/node";
    //var expected = { object: "node" };

    //necessary attributes
    test.deepEqual(typeof toTest.id, "number");
    test.deepEqual(typeof toTest.lat, "number");
    // assert.deepEqual(typeof toTest.lat, "number");
    test.deepEqual(typeof toTest.lon, "number");

    //optional attributes
    if(typeof toTest.version != "undefined"){
        assert.deepEqual(typeof toTest.version, "number");
    }
    if(typeof toTest.uid != "undefined"){
        assert.deepEqual(typeof toTest.uid, "number");
    }
    if(typeof toTest.changesetId != "undefined"){
        assert.deepEqual(typeof toTest.changesetId, "number");
    }
    /* if(typeof toTest.tags != "undefined"){
        var expected = {string , string};
        for (var x=0; x<toTest.tags.length; x++){
            assertdeeoEqual(toTest.tags[x], expected);
        }
    }*/
    test.finish();
 }
}



var XmlGenerator = require('../xmlGenerator').XmlGenerator; // Konstruktor aufrufen
var underscore = require('underscore');
var async_testing = require('async_testing');

var expected_xmlObj='';
var xmlGenerator = new XmlGenerator();

var thisTimeStamp = new Date().getTime();

// Samples
var sample_node = {
    id: 4,
    lat: 4,
    lon: 4,
    version: 4,
    uid: 4,
    user: "et'ti",
    changeset: 4,
    timestamp: thisTimeStamp,
}

var sample_way = {
    id: 45,
    version: 3,
    uid: 35,
    user: "irena",
    changeset: 7,
    timestamp: thisTimeStamp,
}

var sample_rel = {
    id: 655,
    version: 34,
    uid: 45,
    user: "kl",
    changeset: 765,
    timestamp: thisTimeStamp
}


//var regexpr_id = {{}

module.exports = {

    'test_node':function(test){
        //test.ok(false);
        var expected_xmlnode = '<node id="4" timestamp="' + thisTimeStamp + '" version="4" changeset="4" lat="4" lon="4"/>'; // regular expression bauen
        var created_node = xmlGenerator.createNode(sample_node);
        test.deepEqual(expected_xmlnode,created_node,"\n\texpected: " + expected_xmlnode + "\n\tcreated:  " + created_node+ "\n");
        test.finish();
    },

    'test_way':function(test){
        var expected_xmlway = '<way id="45" timestamp="' + thisTimeStamp + '" version="3" changeset="7"/>';
        var created_way = xmlGenerator.createWay(sample_way);
        test.strictEqual(expected_xmlway,created_way,"\n\texpected: " + expected_xmlway + "\n\tcreated:  " + created_way + "\n");
        test.finish;
    },

    'test_rel':function(test){
        var expected_xmlrel = '<relation id="655" timestamp="' + thisTimeStamp + '" version="34" changeset="765"/>';
        var created_rel = xmlGenerator.createRelation(sample_rel);
        test.equal(expected_xmlrel,created_rel,"\n\texpected: " + expected_xmlrel + "\n\tcreated:  " + created_rel + "\n");
        test.finish();
    }

}

if (module === require.main) {
    require('async_testing').run(__filename, process.ARGV);
}

// vim:set ts=4 sw=4 expandtab:

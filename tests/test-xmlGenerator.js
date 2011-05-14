var XmlGenerator = require('../lib/xmlGenerator').XmlGenerator; // Konstruktor aufrufen
var underscore = require('underscore');
var async_testing = require('async_testing');

//var expected_xmlObj='';
var xmlGenerator = new XmlGenerator();

function toISO8601(date) {
    //2007-03-31T00:09:22+01:00
    var pad_two = function(n) {
        return (n < 10 ? '0' : '') + n;
    };

    return [
        date.getUTCFullYear(),
        '-',
        pad_two(date.getUTCMonth() + 1),
        '-',
        pad_two(date.getUTCDate()),
        'T',
        pad_two(date.getUTCHours()),
        ':',
        pad_two(date.getUTCMinutes()),
        ':',
        pad_two(date.getUTCSeconds()),
        '+01:00' //FIX ME
            ].join('');
}

var thisTimeStamp = toISO8601(new Date());

// Samples
var sample_node = {
    id: 4,
    lat: 4,
    lon: 4,
 //   version: 4,
  //  uid: 4,
 //   user: "et'ti",
    changesetId: 4,
 //   timestamp: thisTimeStamp
};

var sample_way = {
    id: 45,
//    version: 3,
    uid: 35,
//    user: "irena",
//    changesetId: 7,
    timestamp: thisTimeStamp
};

var sample_rel = {
    id: 655,
//    version: 34,
//    uid: 45,
    user: "kl",
//    changesetId: 765,
//    timestamp: thisTimeStamp
};


//var regexpr_id = {{}

module.exports = {

    'test_node':function(test){
        test.ok(true);
        var expected_xmlnode = '<node id="4" timestamp="' + thisTimeStamp + '" version="4" changesetId="4" lat="4" lon="4"/>'; // regular expression bauen
        var created_node = xmlGenerator.createNode(sample_node);
        test.equal(expected_xmlnode,created_node,"\n\texpected: " + expected_xmlnode + "\n\tcreated:  " + created_node+ "\n");
        test.finish();
    },

    'test_way':function(test){
        var expected_xmlway = '<way id="45" timestamp="' + thisTimeStamp + '" version="3" changesetId="7"/>';
        var created_way = xmlGenerator.createWay(sample_way);
        test.equal(expected_xmlway,created_way,"\n\texpected: " + expected_xmlway + "\n\tcreated:  " + created_way + "\n");
        test.finish();
    },

    'test_rel':function(test){
        var expected_xmlrel = '<relation id="655" timestamp="' + thisTimeStamp + '" version="34" changesetId="765"/>';
        var created_rel = xmlGenerator.createRelation(sample_rel);
        test.equal(expected_xmlrel,created_rel,"\n\texpected: " + expected_xmlrel + "\n\tcreated:  " + created_rel + "\n");
        test.finish();
    }

};

if (module === require.main) {
    require('async_testing').run(__filename, process.ARGV);
}

// vim:set ts=4 sw=4 expandtab:

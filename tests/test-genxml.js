var XmlGenerator = require('../lib/genxml').XmlGenerator; // Konstruktor aufrufen
var underscore = require('underscore');
var async_testing = require('async_testing');
var builder = require('xmlbuilder');
var log4js = require('log4js')();
var log = log4js.getLogger('test-xmlgenerator');
var fs = require('fs');
var path = require('path');

var config = {
    version : '0.6',
    generator : 'xappy.js v0.2',
    copyright : '2011 OpenStreetMap contributors',
    planetDate : 'TEST PLANETDATE',
    uri: 'uri'
};


var xmlGenerator = new XmlGenerator(config);

function toISO8601(date) {
    // 2007-03-31T00:09:22+01:00
    var pad_two = function (n) {
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
        '+01:00'
            ].join('');
}

var date = toISO8601(new Date());

// Sample elements for testing
var sample_node = {
    id: 4,
    lat: 4,
    lon: 4,
    version: 4,
    uid: 4,
    user: 'etti',
    changeset: 443654,
    timestamp: date,
    tags:[{key:'key1',value:'value1'},{key:'key2',value:'value2'}]
};

var sample_way = {
    id: 45,
    version: 3,
    uid: 35,
    user: 'paul',
    changeset: 7,
    timestamp: date,
    nodes : [1, 2],
    tags:[{key:'key1',value:'value1'},{key:'key2',value:'value2'}]
};

var sample_rel = {
    id: 655,
    version: 34,
    uid: 45,
    user: 'kl',
    changeset: 765,
    timestamp: date,
    members:[{type:'way',reference:234,role:'role'}]
};

module.exports = {

    'test_node':function(test){
        test.ok(true);
        var expected_node = '<node id="4" lat="4" lon="4" version="4" uid="4" user="etti" changeset="443654" timestamp="' + date + '">'
                          + '<tag k="key1" v="value1"/><tag k="key2" v="value2"/></node>';
        var created_node = xmlGenerator.create('node', sample_node);
        test.equal(expected_node,created_node,"\n\texpected: " + expected_node + "\n\tcreated:  " + created_node+ "\n");
        test.finish();
    },

    'test_way':function(test){
        var expected_way = '<way id="45" version="3" uid="35" user="paul" changeset="7" timestamp="' + date + '">'
                         + '<nd ref="1"/><nd ref="2"/>'
                         + '<tag k="key1" v="value1"/><tag k="key2" v="value2"/></way>';
        var created_way = xmlGenerator.create('way', sample_way);
        test.equal(expected_way,created_way,"\n\texpected: " + expected_way + "\n\tcreated:  " + created_way + "\n");
        test.finish();
    },

    'test_rel':function(test){
        var expected = '<relation id="655" version="34" uid="45" user="kl" changeset="765" timestamp="' + date + '">'
                        + '<member type="way" ref="234" role="role"/></relation>';
        var actual = xmlGenerator.create('relation', sample_rel);

        var msg = "\n\texpected: " + expected + "\n\tcreated:  " + actual + "\n"
        test.equal(expected, actual, msg);
        test.finish();
    },
    'test_header' : function (test) {

        var expected_header = '<?xml version="1.0" standalone="no"?>'
            + '<osm version="0.6" generator="xappy.js v0.2" '
        //    + 'xmlns:xapi="http://www.informationfreeway.org/xapi/0.6" '
            + 'xapi:planetDate="' + config.planetDate + '" '
            + 'xapi:copyright="2011 OpenStreetMap contributors">';
        //    + 'xapi:instance="zappy2">';
        var created_header = xmlGenerator.createHeader();
        test.equal(expected_header,created_header, '\n\texpected: ' + expected_header + '\n\tcreated:  ' + created_header);
        test.finish();
    },
    'test_footer': function (test){
        var expected = '</osm>';
        var actual = xmlGenerator.createFooter();
        test.equal(expected, actual);
        test.finish();
    }
};

if (module === require.main) {
    require('async_testing').run(__filename, process.ARGV);
}

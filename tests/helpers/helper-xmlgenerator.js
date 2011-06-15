var XmlGenerator = require('../../lib/genxml').XmlGenerator; // Konstruktor aufrufen
var underscore = require('underscore');
var async_testing = require('async_testing');
var _ = require('underscore');

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

var node_tags = '';
var way_tags = '';
var way_nodes = '';
var rel_tags = '';
var rel_members = '';


module.exports = {
    'toISO': function(date) {
        return toISO8601(date);
    },
    'expected_node': function(sample_node) {
        if (sample_node.version){
            node_version = ' version="' + sample_node.version + '"';
        } else {
            node_version = '';
        }

        if (sample_node.uid){
            node_uid = ' uid="' + sample_node.uid + '"';
        } else {
            node_uid = '';
        }

        if (sample_node.user){
            node_user = ' user="' + sample_node.user + '"';
        } else {
            node_user = '';
        }

        if (sample_node.changesetId){
            node_changesetId = ' changesetId="' + sample_node.changesetId + '"';
        } else {
            node_changesetId = '';
        }

        if (sample_node.timestamp){
            node_timestamp = ' timestamp="' + sample_node.timestamp + '"';
        } else {
            node_timestamp = '';
        }

        if(sample_node.tags){
            sample_node.tags.forEach(function(tuple){
                node_tags += '<tag k="' + tuple.key + '" v="' + tuple.value + '"/>';
            });
            node_end1 = '>';
            node_end2 = '</node>';
        } else {
            node_end1 = '';
            node_end2 = '/>';
        }

        return [
            '<node id="',
            sample_node.id,
            '" lat="',
            sample_node.lat,
            '" lon="',
            sample_node.lon,
            '"',
            node_version,
            node_uid,
            node_user,
            node_changesetId,
            node_timestamp,
            node_end1,
            node_tags,
            node_end2
                ].join('');
    },

    'expected_way': function(sample_way) {
        if (sample_way.version){
            way_version = ' version="' + sample_way.version + '"';
        }else{
            way_version = '';
        }

        if (sample_way.uid){
            way_uid = ' uid="' + sample_way.uid + '"';
        }else{
            way_uid = '';
        }

        if (sample_way.user){
            way_user = ' user="' + sample_way.user + '"';
        }else{
            way_user = '';
        }

        if (sample_way.changesetId){
            way_changesetId = ' changesetId="' + sample_way.changesetId + '"';
        }else{
            way_changesetId = '';
        }

        if (sample_way.timestamp){
            way_timestamp = ' timestamp="' + sample_way.timestamp + '"';
        }else{
            way_timestamp = '';
        }
        _.each(sample_way.nodes, function(node){
            way_nodes += '<nd ref="' + node + '"/>';
        });

        if(sample_way.tags){
            sample_way.tags.forEach(function(tuple){
                way_tags += '<tag k="' + tuple.key + '" v="' + tuple.value + '"/>';
            });
        }

        return [
            '<way id="',
            sample_way.id,
            '"',
            way_version,
            way_uid,
            way_user,
            way_changesetId,
            way_timestamp,
            '>',
            way_nodes,
            way_tags,
            '</way>'
                ].join('');
    },

    'expected_rel': function(sample_rel) {
        if (sample_rel.version){
            rel_version = ' version="' + sample_rel.version + '"';
        }else{
            rel_version = '';
        }

        if (sample_rel.uid){
            rel_uid = ' uid="' + sample_rel.uid + '"';
        }else{
            rel_uid = '';
        }

        if (sample_rel.user){
            rel_user = ' user="' + sample_rel.user + '"';
        }else{ 
            rel_user = '';
        }

        if (sample_rel.changesetId){
            rel_changesetId = ' changesetId="' + sample_rel.changesetId + '"';
        }else{
            rel_changesetId = '';
        }

        if (sample_rel.timestamp){
            rel_timestamp = ' timestamp="' + thisTimeStamp + '"';
        }else{
            rel_timestamp = '';
        }

        if(sample_rel.tags){
            sample_rel.tags.forEach(function(tuple){
                rel_tags += '<tag k="' + tuple.key + '" v="' + tuple.value + '"/>';
            });
        }

        sample_rel.members.forEach(function(member){
                rel_members += '<member type="' + member.type + '" ref="' + member.reference + '" role="' + member.role + '"/>';
        });


        return [
            '<relation id="',
            sample_rel.id,
            '"',
            rel_version,
            rel_uid,
            rel_user,
            rel_changesetId,
            rel_timestamp,
            '>',
            rel_members,
            rel_tags,
            '</relation>'
                ].join('');
    }

};
 // vim:set ts=4 sw=4 expandtab:

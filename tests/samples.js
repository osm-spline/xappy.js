var config;

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
        '+01:00'    //FIX ME
            ].join('');
}


exports.nodes = function(){
    var myTimestamp = toISO8601(new Date(1305135654634));
    return {
        n1: {
            id: 12312,
            lat: 48.2111685091189,
            lon: 16.3035366605548,
            version: 123,
            uid: 233321231,
            user: 'manfred j. mustermann',
            changesetId: 1237691823,
            timestamp: myTimestamp,
            tags: [ { key: 'key1', value: 'value1' },
                { key: 'key2', value: 'value2' } ]
        },
    n1json: '{"id":12312,"lat":48.2111685091189,"lon":16.3035366605548,"version":123,"uid":233321231,"user":"manfred j. mustermann","changesetId":1237691823,"timestamp":"'+myTimestamp+'","tags":[{"key":"key1","value":"value1"},{"key":"key2","value":"value2"}]}',
    };

};

exports.ways = function(){
    var myTimestamp = toISO8601(new Date(1305135654634));
    return {
        w1: {
            id : 496969,
            nodes : [1,2],
            version : 2,
            uid: 1234122,
            user: 'manfred j. mustermann',
            changesetId: 1237691823,
            timestamp: myTimestamp,
            tags : [{key : 'key1', value : 'value1'},
                {key : 'key2', value : 'value2'},
            ]
        },
        w1json: '{"id":496969,"nodes":[1,2],"version":2,"uid":1234122,"user":"manfred j. mustermann","changesetId":1237691823,"timestamp":"'+myTimestamp+'","tags":[{"key":"key1","value":"value1"},{"key":"key2","value":"value2"}]}',
    };
};

exports.relations = function() {
    var myTimestamp = toISO8601(new Date(1305135654634));
    return {
        r1: {
            id : 4905,
            members : [ {type : 'node', reference : 123, role : 'bla'},
               {type : 'way', reference : 34, role : 'blup'}
            ],
            version: 23123,
            uid: 1234123,
            user: 'manfred j. mustermann',
            changesetId: 1234123,
            timestamp: myTimestamp,
            tags : [{key : 'key1', value : 'value1'},
                {key : 'key2', value : 'value2'},
            ]
        },
            r1json: '{"id":4905,"members":[{"type":"node","reference":123,"role":"bla"},{"type":"way","reference":34,"role":"blup"}],"version":23123,"uid":1234123,"user":"manfred j. mustermann","changesetId":1234123,"timestamp":"'+myTimestamp+'","tags":[{"key":"key1","value":"value1"},{"key":"key2","value":"value2"}]}',


    };
};

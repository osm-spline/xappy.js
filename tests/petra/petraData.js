var node1 = {
    id: 1,
    lat: 51.415,
    lon: 9.427,
    version: 1,
    uid: 291857,
    user: 'sladda',
    changeset: 123456,
    timestamp: '2011-05-26T16:47:48.000Z',
    tags: [
        { key: 'amenity', value: 'hospital' },
        { key: 'name', value: 'Wilhelminenspital' }
    ]
};

var node2 = {
    id: 2,
    lat: 53.6,
    lon: 7.2,
    version: 1,
    uid: 291857,
    user: 'sladda',
    changeset: 123456,
    timestamp: '2011-05-26T16:47:48.000Z'
};

var node3 = {
    id: 3,
    lat: 53.875,
    lon: 13.9108,
    version: 1,
    uid: 291857,
    user: 'sladda',
    changeset: 123456,
    timestamp: '2011-05-26T16:47:48.000Z',
    tags: [
        { key: 'amenity', value: 'hotel' },
        { key: 'name', value: 'HomeSweetHome' }
    ]
};

var node4 = {
    id: 4,
    lat: 47.999,
    lon: 7.8526,
    version: 1,
    uid: 291857,
    user: 'sladda',
    changeset: 123456,
    timestamp: '2011-05-26T16:47:48.000Z',
    tags: [
        { key: 'amenity', value: 'hotel' },
        { key: 'name', value: 'WalthersTruckStop' }
    ]
};

var node5 = {
    id: 5,
    lat: 49.7,
    lon: 13.4,
    version: 1,
    uid: 291857,
    user: 'sladda',
    changeset: 123456,
    timestamp: '2011-05-26T16:47:48.000Z',
    tags: [
        { key: 'amenity', value: 'bar' },
        { key: 'name', value: 'Lucies' }
    ]
};

var node6 = {
    id: 6,
    lat: 53.33,
    lon: 11.52,
    version: 1,
    uid: 291857,
    user: 'sladda',
    changeset: 123456,
    timestamp: '2011-05-26T16:47:48.000Z',
    tags: [
        { key: 'building', value: 'emblem' },
        { key: 'name', value: 'BrandenburgerTor' }
    ]
};

var node7 = {
    id: 7,
    lat: 48.13,
    lon: 11.7,
    version: 1,
    uid: 291857,
    user: 'sladda',
    changeset: 123456,
    timestamp: '2011-05-26T16:47:48.000Z',
    tags: [
        { key: 'amenity', value: 'hospital' },
        { key: 'name', value: 'HeisseSchwestern' }
    ]
};


//Berlin - Kassel - Munich
var way1 = {
    id: 123,
    version: 3,
    uid: 291857,
    changeset: 2211,
    timestamp: '2007-07-25T01:55:35.010Z',
    nodes: [ 1,6,7 ]
};

//Norden - Waldkirchen
var way2 = {
    id: 456,
    version: 3,
    uid: 291857,
    changeset: 2211,
    timestamp: '2007-07-25T01:55:35.010Z',
    nodes: [ 2,5 ],
    tags: {}
};

//Norden - Usedom
var way3 = {
    id: 789,
    version: 3,
    uid: 291857,
    changeset: 2211,
    timestamp: '2011-05-26T16:47:48.000Z',
    nodes: [ 2,3 ],
    tags: [
        { key: 'value', value: 'Strandweg' }
    ]
};


var relation1 = {
    id: 1111,
    version: 17,
    uid: 291857,
    changeset: 5334067,
    timestamp: '2010-07-27T22:34:46.000Z',
    tags: {
        key: ['note', 'type'],
        value: ['OstDeutschland', 'multipolygon']
    },
    members: [
        {type: "node", ref: 1, role: "" },
        {type: "node", ref: 6, role: "" },
        {type: "way", ref: 123 },
        {type: "way", ref: 789 }
    ]
};

var relation2 = {
    id: 1112,
    version: 17,
    uid: 291857,
    changeset: 5334067,
    timestamp: '2010-07-27T22:34:46.000Z',
    tags: [
        { key: 'note', value: 'WestDeutschland' },
        { key: 'type', value: 'multipolygon' }
    ],
    members: [
        {type: "node", ref: 2, role: "" },
        {type: "node", ref: 3, role: "" },
        {type: "node", ref: 4, role: "" },
        {type: "node", ref: 5, role: "" },
        {type: "node", ref: 7, role: "" },
        {type: "way", ref: 123 },
        {type: "way", ref: 456 },
        {type: "way", ref: 789 }
    ]
}

var relation3 = {
    id: 1113,
    version: 17,
    uid: 291857,
    changeset: 5334067,
    timestamp: '2010-07-27T22:34:46.000Z',
    tags: [{key: 'note', value: 'Deutschland'}],
    members: [
        {type: 'relation', ref: 1111, role: ''},
        {type: 'relation', ref: 1112, role: ''}
    ]
};

var relation4 = {
    id: 1114,
    version: 17,
    uid: 291857,
    changeset: 5334067,
    timestamp: '2010-07-27T22:34:46.000Z',
    tags: [{key: 'note', value: 'all'}],
    members: [
        {type: 'node', ref: 1, role: ''},
        {type: 'node', ref: 2, role: ''},
        {type: 'node', ref: 3, role: ''},
        {type: 'node', ref: 4, role: ''},
        {type: 'node', ref: 5, role: ''},
        {type: 'node', ref: 6, role: ''},
        {type: 'node', ref: 7, role: ''},
        {type: 'way', ref: 123},
        {type: 'way', ref: 123},
        {type: 'way', ref: 456},
        {type: 'way', ref: 789},
        {type: 'way', ref: 789},
        {type: 'relation', ref: 1111},
        {type: 'relation', ref: 1112}
    ]
};

var relation5 = {
    id: 1115,
    version: 17,
    uid: 291857,
    changeset: 5334067,
    timestamp: '2010-07-27T22:34:46.000Z',
    tags: [{key: 'note', value: 'recursive'}],
    members: [{type: 'relation', ref: 1115, role: ''}]
};
var bbox = {
    all: { left: 7, bottom: 47, right: 14, top: 54}, // all nodes
    bottom: { left: 7, bottom: 47, right: 14, top: 51}, // nodes 4,5,7
    top: { left: 7, bottom: 51, right: 14, top: 54}, // 1,2,3,6
    left: { left: 7, bottom: 47, right: 9.49, top: 54}, // 1,2,4
    right: { left: 9.5, bottom: 47, right: 14, top: 54}, // 3,4,6,7
    empty: { left: -11.43, bottom: 49.81, right: 0.95, top: 59 }
};

var tags = {
    hospital: {key: ['amenity'], value: ['hospital']}, // nodes 1,7
    emblem: {key: ['building'], value: ['emblem']}, // node 6
    strandweg: {key: ['name'], value: ['Strandweg']}
}

var nodes = [node1, node2, node3, node4, node5, node6, node7];
var relations = [relation1, relation2, relation3, relation4, relation5];
var ways = [way1, way2, way3];

exports.bbox = bbox;
exports.tags = tags;
exports.nodes = nodes;
exports.ways = ways;
exports.relations = relations;

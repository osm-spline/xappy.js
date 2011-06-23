var node1 = {
    id: 1,
    lat: 51.415,
    lon: 9.427,
    version: 1,
    uid: 291857,
    changeset: 123456,
    timestamp: '2011-05-26T16:47:48.000Z',  // ???
    tags: {
        key: ['amenity', 'name'],
        value: ['hospital', 'Wilhelminenspital']
    }
};

var node2 = {
    id: 2,
    lat: 53.6,
    lon: 7.2,
    version: 1,
    uid: 291857,
    changeset: 123456,
    timestamp: '2011-05-26T16:47:48.000Z',  // ???
    tags: {}
};

var node3 = {
    id: 3,
    lat: 53.875,
    lon: 13.9108,
    version: 1,
    uid: 291857,
    changeset: 123456,
    timestamp: '2011-05-26T16:47:48.000Z',  // ???
    tags: {
        key: ['amenity', 'name'],
        value: ['hotel', 'HomeSweetHome']
    }
};

var node4 = {
    id: 4,
    lat: 47.999,
    lon: 7.8526,
    version: 1,
    uid: 291857,
    changeset: 123456,
    timestamp: null,
    tags: {
        key: ['amenity', 'name'],
        value: ['hotel', 'WalthersTruckStop'];
    }
};

var node5 = {
    id: 5,
    lat: 49.7,
    lon: 13.4,
    version: 1,
    uid: 291857,
    changeset: 123456,
    timestamp: '2011-05-26T16:47:48.000Z',  // ???
    tags: {
        key: ['amenity', 'name'],
        value: ['bar', 'Lucies']
    }
};

var node6 = {
    id: 6,
    lat: 53.33,
    lon: 11.52,
    version: 1,
    uid: 291857,
    changeset: 123456,
    timestamp: '2011-05-26T16:47:48.000Z',  // ???
    tags: {
        key: ['building', 'name'],
        value: ['emblem', 'BrandenburgerTor']
    }
};

var node7 = {
    id: 7,
    lat: 48.13,
    lon: 11.7,
    version: 1,
    uid: 291857,
    changeset: 123456,
    timestamp: '2011-05-26T16:47:48.000Z',  // ???
    tags: {
        key: ['amenity', 'name'],
        value: ['hospital', 'HeisseSchwestern']
    }
};

var nodes = [node1, node2, node3, node4, node5, node6, node7];

//Berlin - Kassel - Munich
var way1 = {
    id: 123,
    version: 3,
    uid: 291857,
    changeset: 2211,
    timestamp: '2007-07-25T01:55:35.010Z',  // ???
    nodes: [ 1,6,7 ],
    tags: {}
};

//Norden - Waldkirchen
var way2 = {
    id: 456,
    version: 3,
    uid: 291857,
    changeset: 2211,
    timestamp: '2007-07-25T01:55:35.010Z',  // ???
    nodes: [ 2,5 ],
    tags: {}
};

//Norden - Usedom
var way3 = {
    id: 789,
    version: 3,
    uid: 291857,
    changeset: 2211,
    timestamp: '2011-05-26T16:47:48.000Z',  // ???
    nodes: [ 2,3 ],
    tags: {
        key: ['value'],
        value: ['Strandweg']
    }
};

var ways = [way1, way2, way3];

var relation1 = {
    id: 1111,
    version: 17,
    uid: 291857,
    changeset: 5334067,
    timestamp: '2010-07-27T22:34:46.000Z',  // ???
    tags: {
        key: ['note', 'type'],
        value: ['OstDeutschland', 'multipolygon']
    },
    members: {
        {type: "node", ref: 1, role: "" },
        {type: "node", ref: 6, role: "" },
        {type: "way", ref: 123 },
        {type: "way", ref: 789 }
    }
};

var relation2 = {
    id: 1112,
    version: 17,
    uid: 291857,
    changeset: 5334067,
    timestamp: '2010-07-27T22:34:46.000Z',  // ???
    tags: {
        key: ['note', 'type'],
        value: ['WestDeutschland', 'multipolygon']
    },
    members: {
        {type: "node", ref: 2, role: "" },
        {type: "node", ref: 3, role: "" },
        {type: "node", ref: 4, role: "" },
        {type: "node", ref: 5, role: "" },
        {type: "node", ref: 7, role: "" },
        {type: "way", ref: 123 },
        {type: "way", ref: 456 },
        {type: "way", ref: 789 }
    }
}

var relations = [relation1, relation2];

exports.nodes = nodes;
exports.ways = ways;
exports.relations = relations;

module.exports = {
    'node' : {
        object : 'node'
    },
    'node[amenity=pub]' : {
        object : 'node',
        tag : {
            key : ['amenity'],
            value : ['pub']
        }
    },
    'node[amenity=pub|cafe]' : {
        object : 'node',
        tag : {
            key : ['amenity'],
            value : ['pub','cafe']
        }
    },
    'node[name|name:de=Berlin]' : {
        object : 'node',
        tag : {
            key : ['name', 'name:de'],
            value : ['pub']
        }
    },
    'node[name|name:de=Cologne|Koeln]' : {
        object : 'node',
        tag : {
            key : ['name', 'name:de'],
            value : ['Cologne', 'Koeln']
        }
    },
    'node[bbox=13,52,14,53]' : {
        object : 'node',
        bbox : {
            right : 14,
            top : 53,
            left : 13,
            bottom : 52
        }
    },
    'node[bbox=13,52,14,53][amenity=pub]' : {
        object : 'node',
        bbox : {
            right : 14,
            top : 53,
            left : 13,
            bottom : 52
        },
        tag : {
            key : ['name', 'name:de'],
            value : ['pub']
        }
    },
    'way' : {
        object : 'way'
    },
    'relation' : {
        object : 'relation'
    },
    '*' : {
        object : '*'
    }
};

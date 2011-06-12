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
    'node[52,13,53,14]' : {
        object : 'node',
        bbox : {
            right : 53,
            top : 14,
            left : 52,
            bottom : 13
        }
    },
    'node[52,13,53,14][amenity=pub]' : {
        object : 'node',
        bbox : {
            right : 53,
            top : 14,
            left : 52,
            bottom : 13
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

module.exports = {
    'node' : {
        name : 'node',
        object : 'node'
    },
    'node[amenity=hotel]' : {
        name : 'node[amenity=hotel]',
        object : 'node',
        tag : {
            key : ['amenity'],
            value : ['hotel']
        }
    },
    'node[amenity=hotel|bar]' : {
        name : 'node[amenity=hotel|bar]',
        object : 'node',
        tag : {
            key : ['amenity'],
            value : ['hotel','bar']
        }
    },
    'node[name|name:de=BrandenburgerTor]' : {
        name : 'node[name|name:de=BrandenburgerTor]',
        object : 'node',
        tag : {
            key : ['name', 'name:de'],
            value : ['BrandenburgerTor']
        }
    },
    'node[name|name:de=Home|HomeSweetHome]' : {
        name : 'node[name|name:de=Home|HomeSweetHome]',
        object : 'node',
        tag : {
            key : ['name', 'name:de'],
            value : ['Home', 'HomeSweetHome']
        }
    },
    'node[bbox=11,53,12,54]' : {
        name : 'node[bbox=11,53,12,54]',
        object : 'node',
        bbox : {
            right : 12,
            top : 54,
            left : 11,
            bottom : 53
        }
    },
    'node[bbox=11,53,12,54][name|name:de=BrandenburgerTor|BrandenburgerTor]' : {
        name : 'node[bbox=11,53,12,54][name|name:de=BrandenburgerTor|BrandenburgerTor]',
        object : 'node',
        bbox : {
            right : 12,
            top : 54,
            left : 11,
            bottom : 53
        },
        tag : {
            key : ['name', 'name:de'],
            value : ['BrandenburgerTor','BrandenburgerTor']
        }
    },
    'node[way]' : {
        name : 'node[way]',
        object : 'node',
        predicate : 'way'
    },
    'node[tag]' : {
        name : 'node[tag]',
        object : 'node',
        predicate : 'tag'
    },
    'node[not(way)]' : {
        name : 'node[not(way)]',
        object : 'node',
        predicate : 'not(way)'
    },
    'way' : {
        name : 'way',
        object : 'way'
    },
    'relation' : {
        name : 'relation',
        object : 'relation'
    },
    '*' : {
        name : '*',
        object : '*'
    }
};

module.exports = {
    'node' : {
        object : 'node'
    },
    'node[amenity=hotel]' : {
        object : 'node',
        tag : {
            key : ['amenity'],
            value : ['hotel']
        }
    },
    'node[amenity=hotel|bar]' : {
        object : 'node',
        tag : {
            key : ['amenity'],
            value : ['hotel','bar']
        }
    },
    'node[name|name:de=BrandenburgerTor]' : {
        object : 'node',
        tag : {
            key : ['name', 'name:de'],
            value : ['BrandenburgerTor']
        }
    },
    'node[name|name:de=Home|HomeSweetHome]' : {
        object : 'node',
        tag : {
            key : ['name', 'name:de'],
            value : ['Home', 'HomeSweetHome']
        }
    },
    'node[bbox=11,53,12,54]' : {
        object : 'node',
        bbox : {
            right : 12,
            top : 54,
            left : 11,
            bottom : 53
        }
    },
    'node[bbox=11,53,12,54][name|name:de=BrandenburgerGate|BrandenburgerTor]' : {
        object : 'node',
        bbox : {
            right : 12,
            top : 54,
            left : 11,
            bottom : 53
        },
        tag : {
            key : ['name', 'name:de'],
            value : ['BrandenburgerGate','BrandenburgerTor']
        }
    },
    'node[way]' : {
        object : 'node',
        predicate : 'way'
    },
    'node[tag]' : {
        object : 'node',
        predicate : 'tag'
    },
    'node[not(way)]' : {
        object : 'node',
        predicate : 'not(way)'
    },
    'way' : {
        object : 'way'
    },
    'way[name=Strandweg]' : {
        object : 'way',
        tag : {
            key : ['name'],
            value : ['Strandweg']
        }
    },
    'way[name|name:de=Strandweg|Strandweg]' : {
        object : 'way',
        tag : {
            key : ['name','name:de'],
            value : ['Strandweg','Strandweg']
        }
    },
    'way[name=BrandenburgerTor|HeisseSchwestern]' : {
        object : 'way',
        tag : {
            key : ['name'],
            value : ['BrandenburgerTor','HeisseSchwestern']
        }
    },
    'way[name|amenity=BrandenburgerTor]' : {
        object : 'way',
        tag : {
            key : ['name','amenity'],
            value : ['BrandenburgerTor']
        }
    },
    'way[bbox=11,53,12,54]' : {
        object : 'way',
        bbox : {
            right : 12,
            top : 54,
            left : 11,
            bottom : 53
        }
    },
    'way[name|name:de=Strandweg|Strandweg][bbox=11,53,12,54]' : {
        object : 'way',
        tag : {
            key : ['name','name:de'],
            value : ['Strandweg','Strandweg']
        },
        bbox : {
            right : 12,
            top : 54,
            left : 11,
            bottom : 53
        }
    },
    'relation' : {
        object : 'relation'
    },
    'relation[note=OstDeutschland]' : {
        object : 'relation',
        tag : {
            key : ['note'],
            value : ['OstDeutschland']
        }
    },
    '*' : {
        object : '*'
    }
};

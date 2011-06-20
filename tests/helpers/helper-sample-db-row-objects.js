module.exports = {
    'node' : {
        0 : {
			type : 'node',
            id: 1,
            version: 1,
            user_id: 291857,
            changeset_id: 123456
        },
        1 : {
			type : 'node',
            id: 2,
            version: 1,
            user_id: 291857,
            changeset_id: 123456
        },
        2 : {
			type : 'node',
            id: 3,
            version: 1,
            user_id: 291857,
            changeset_id: 123456
        },
        3 : {
			type : 'node',
            id: 4,
            version: 1,
            user_id: 291857,
            changeset_id: 123456
        },
        4 : {
			type : 'node',
            id: 5,
            version: 1,
            user_id: 291857,
            changeset_id: 123456
        },
        5 : {
			type : 'node',
            id: 6,
            version: 1,
            user_id: 291857,
            changeset_id: 123456
        },
        6 : {
			type : 'node',
            id: 7,
            version: 1,
            user_id: 291857,
            changeset_id: 123456
        }
    },
    'node[amenity=hotel]' : {
        0 : {
			type : 'node',
            id: 3
        },
        1 : {
			type : 'node',
            id: 4
        }
    },
    'node[amenity=hotel|bar]' : {
        0 : {
			type : 'node',
            id: 3
        },
        1 : {
			type : 'node',
            id: 4
        },
        2 : {
			type : 'node',
            id: 5
        }
    },
    'node[name|name:de=BrandenburgerTor]' : {
        0 : {
			type : 'node',
            id: 6
        }
    },
    'node[name|name:de=Home|HomeSweetHome]' : {
        0 : {
			type : 'node',
            id: 3
        }
    },
    'node[bbox=11,53,12,54]' : {
        0 : {
			type : 'node',
            id: 6
        }
    },
    'node[bbox=11,53,12,54][name|name:de=BrandenburgerGate|BrandenburgerTor]' : {
        0 : {
			type : 'node',
            id: 6
        }
    },
    'node[way]' : {
        0 : {
			type : 'node',
            id: 1
        },
        1 : {
			type : 'node',
            id: 2
        },
        2 : {
			type : 'node',
            id: 3
        },
        3 : {
			type : 'node',
            id: 5
        },
        4 : {
			type : 'node',
            id: 6
        },
        5 : {
			type : 'node',
            id: 7
        }
    },
    'node[tag]' : {
        0 : {
			type : 'node',
            id: 1
        },
        1 : {
			type : 'node',
            id: 4
        },
        2 : {
			type : 'node',
            id: 3
        },
        3 : {
			type : 'node',
            id: 5
        },
        4 : {
			type : 'node',
            id: 6
        },
        5 : {
			type : 'node',
            id: 7
        }
    },
    'node[not(way)]' : {
        0 : {
			type : 'node',
            id: 4
        }
    },
    'way[name=BrandenburgerTor|Strandweg]' : {
        0 : {
            type : 'way',
            id: 789
        },
        1 : {
            type : 'node',
            id : 2    
        },
        2: {
            type : 'node',
            id : 3
        }       
    }/*,
    'way[name|amenity=BrandenburgerTor]': {
        0 : {
			type : 'node',
            id: 6
        }
    }*/
    /*
    'way' : {
        object : 'way'
    },
    'relation' : {
        object : 'relation'
    },
    '*' : {
        object : '*'
    }
    */
};

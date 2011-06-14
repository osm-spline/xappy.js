module.exports = {
    'node' : {
        0 : {
            id: 1,
            version: 1,
            user_id: 291857,
            changeset_id: 123456
        },
        1 : {
            id: 2,
            version: 1,
            user_id: 291857,
            changeset_id: 123456
        },
        2 : {
            id: 3,
            version: 1,
            user_id: 291857,
            changeset_id: 123456
        },
        3 : {
            id: 4,
            version: 1,
            user_id: 291857,
            changeset_id: 123456
        },
        4 : {
            id: 5,
            version: 1,
            user_id: 291857,
            changeset_id: 123456
        },
        5 : {
            id: 6,
            version: 1,
            user_id: 291857,
            changeset_id: 123456
        },
        6 : {
            id: 7,
            version: 1,
            user_id: 291857,
            changeset_id: 123456
        }
    },
    'node[amenity=hotel]' : {
        0 : {
            id: 3
        },
        1 : {
            id: 4
        }
    },
    'node[amenity=hotel|bar]' : {
        0 : {
            id: 3
        },
        1 : {
            id: 4
        },
        2 : {
            id: 5
        }
    },
    'node[name|name:de=BrandenburgerTor]' : {
        0 : {
            id: 6
        }
    },
    'node[name|name:de=Home|HomeSweetHome]' : {
        0 : {
            id: 3
        }
    },
    'node[bbox=11,53,12,54]' : {
        0 : {
            id: 6
        }
    },
    'node[bbox=11,53,12,54][name|name:de=BrandenburgerTor|BrandenburgerTor]' : {
        0 : {
            id: 6
        }
    },
    'node[way]' : {
        0 : {
            id: 1
        },
        1 : {
            id: 2
        },
        2 : {
            id: 3
        },
        3 : {
            id: 5
        },
        4 : {
            id: 6
        },
        5 : {
            id: 7
        }
    },
    'node[tag]' : {
        0 : {
            id: 1
        },
        1 : {
            id: 4
        },
        2 : {
            id: 3
        },
        3 : {
            id: 5
        },
        4 : {
            id: 6
        },
        5 : {
            id: 7
        }
    },
    'node[not(way)]' : {
        0 : {
            id: 4
        }
    }
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

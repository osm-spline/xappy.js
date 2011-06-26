# JSON output format definition by example

**Note:** for simple reading we included whitespaces which are of course omitted
in the actual implementation.

## skeleton

    {
        "version": 0.6,
        "generator": "xappy.js",
        "xapi": {
             "planetDate": 201106161601,
             "copyright": "XXX"
        },
        "elements": [
            ...
            ...
            ...
        ]
    }

where the `elements` array obviously contains all the elements.

## node

    {
        "type": "node",
        "id": 3596186,
        "lat": 53.4633699598014,
        "lon": -2.22667910006381,
        "timestamp": "2007-06-21T17:10:58+01:00",
        "version": 2,
        "changeset": 2213,
        "tags": [
            "amenity": "hospital",
            "name": "Manchester Royal Infirmary"
        ]
    }

## way

    {
         "type": "way",
         "id": 4958218, 
         "version": 3, 
         "timestamp": "2007-07-25T01:55:35+01:00", 
         "changeset": 2211,
         "nodes": [
             218963,
             331193
         ],
         "tags":[
             "landuse": "residential",
             "source": "landsat"
         ]
     }

## relation

    {
        "type": "relation",
        "id": 2670,
        "timestamp": "2007-10-25T03:05:34Z",
        "version": 32, 
        "changeset": 2211,
        "members": [
            {
                "type":"way", 
                "ref":3992472, 
                "role": ""
            },
            {
                "type":"way", 
                "ref":3992524, 
                "role": ""
            }
        ...
      ],
        "tags":[
            "name": "Fonnereau Way",
            "network": "Ipswich foothpaths",
            "type": "route"
        ]
    }

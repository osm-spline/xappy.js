Data Structures
===============

XapiRequest
--------------

`XapiRequest` is the parsed Xapi Query (i.e.: `/node[bbox=0,51.5,0.25,51.75]`)

    XapiRequest {
      object: "node" | "way" | "relation" | "*",
      bbox*: { left : <number>,
        bottom: <number>,
        right: <number>,
        top: <number>
      },
      tag*: {
        key: [ <string> ],
        value: [ <string> ]
      }
    }

Node Object
-----------

[additional informations about Node](http://wiki.openstreetmap.org/wiki/Node)

    Node {
      id: <number>,
      lat: <number>,
      lon: <number>,
      version*: <number>,
      uid*: <number>,
      user*: <string>,
      changesetId*: <number>,
      timestamp*: <Date>,
      tags*: [ { key: <str>, value: <str> } ]
    }

Way Object
----------

[additional informations about Way](http://wiki.openstreetmap.org/wiki/Ways)

    Way {
      id: <number>,
      version*: <number>,
      uid*: <number>,
      user*: <string>
      changesetId*: <number>,
      timestamp*: <Date>,
      nodes: [ <number> ],
      tags*: [ { key: <str>, value: <str> } ]
    }

Relation Object
---------------

[additional informations about Relation](http://wiki.openstreetmap.org/wiki/Relations)

    Relation {
      id: <number>,
      version*: <number>,
      uid*: <number>,
      user*: <string>,
      changesetId*: <number>,
      timestamp*: <Date>
      tags*: [ { key: <str>, value: <str> } ],
      members: [ {
          type: "node" | "way" | "relation",
          reference: <number>,
          role: <string>
        } ]
    }


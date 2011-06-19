xappy.js
========

Contact
--------
Website: [osm.spline.de](http://osm.spline.de)
Mailing List: osm@lists.spline.de or xapi@lists.spline.de
irc: irc://irc.freenode.net/#spline

Aim
---

We serve the node endpoint, but no others. We implement the tag based filtering,
for only one tag and a bounding box.

We like to rewrite some parts of the Xapi needed for our own application. Our
aim is not get a full implementation of the Xapi, but to answer only specific
requests, at low latency. For this subset of Xapi we want completly cover the
original api.

Requests
---------

This is a list of example requests, we want to optimize.

    xapi.spline.de/api/0.6/node[amenity=*]
    xapi.spline.de/api/0.6/node[highway=busstop]
    xapi.spline.de/api/0.6/node[bbox=-6,50,2,61]
    xapi.spline.de/api/0.6/node[amenity=hospital][bbox=-6,50,2,61]

Setup
------

To setup the postgres backend read `doc/database-setup.md`.
To setup the development environment read `doc/setup-development-environment.md`.
To setup the project read `doc/installation.md`.

Dependencies
-------------

For dependencies checkout the package.json file.

xappy.js
========

Xappy.js is an implementation of the xapi specification. Please take a look at
the osm [website](http://wiki.openstreetmap.org/wiki/Xapi) for more information.


Contact
--------
Website: http://osm.spline.de

Mailing List: osm@lists.spline.de or xapi@lists.spline.de

IRC: irc://irc.freenode.net/#spline

CI: http://ci.osm.spline.de

Issues: https://github.com/osm-spline/xappy.js/issues

Documenation: Lives in the git as markdown (https://github.com/osm-spline/xappy.js/tree/master/doc)

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

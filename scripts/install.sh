#!/usr/bin/env sh
git clone git://github.com/slomo/osm-spline-xapi.git
cd osm-spline-xapi
git submodule init
git submodule update
cd deps/pg
npm link
cd ../..
npm link
npm link pg

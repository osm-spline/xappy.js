#!/usr/bin/env sh
git clone git@github.com:osm-spline/xappy.js.git 
cd osm-spline-xapi
git submodule init
git submodule update
cd deps/pg
npm link
cd ../async_testing
npm link
cd ../..
npm link
npm link pg
npm link async_testing

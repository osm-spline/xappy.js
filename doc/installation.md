Requirements
============

We assume that a current version of `git`, `node` and `npm` is installed.
If not please refer to [node](http://nodejs.org/) and [npm](http://npmjs.org/).

Give me a one-liner
===================

This will download and link the project.
After executing the script jump to `Configure`

    curl https://github.com/slomo/osm-spline-xapi/raw/master/scripts/install.sh | sh

Getting the Code
================

    git clone git://github.com/slomo/osm-spline-xapi.git

Initializing the Project
========================

    cd osm-spline-xapi
    npm link

Testing Xapi
============

    ./bin/run_tests

Configure
=========

Edit `/etc/config.json`

Start (not working yet)
=====

    ./bin/xapi --config <path to your config>

or

    ./bin/xapi --port ... --connectionString ...

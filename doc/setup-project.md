Requirements
============

We assume that a current version of `git`, `node` and `npm` is installed.
If not please refer to [node](http://nodejs.org/) and [npm](http://npmjs.org/).

Give me a one-liner
===================

This will download and link the project.
After executing the script jump to `Configure`

    curl https://raw.github.com/osm-spline/xappy.js/master/scripts/install.sh | sh

Getting the Code
================

    git://github.com/osm-spline/xappy.js.git

Initializing the Project
========================

    cd osm-spline-xapi

First we initialize the submodules

    git submodule init
    git submoudle update
    cd deps/pg
    npm link
    cd ../..

Then we initialize the project

    npm link
    npm link pg 


Testing Xapi
============

    bin/run_tests

Configure
=========

Edit `/etc/config.json`

or

copy `/etc/config.json` to `/etc/my-config.json` and edit this file

Start
=====

To get an overview of the application

    bin/xapi --help

    bin/xapi --config <path to your config>
    bin/xapi --port ... --connectionString ...

If you have created a `my-config.json` file in `etc` you can execute

    bin/start-with-my-config

Dev-Environment for linux pool pcs
==================================

::

    ssh to e.g. xian.imp.fu-berlin.de
    cd /export/local-1/public/
    mkdir <username>
    cd <username>
    git clone https://github.com/joyent/node.git
    cd node
    export JOBS=2 # optional, sets number of parallel commands.
    mkdir ../local
    ./configure --prefix=/export/local-1/public/<username>/local/node --without-ssl
    make
    make install
    export PATH=/export/local-1/public/<username>/local/node/bin:$PATH # add this to your .bashrc!!!
    curl http://npmjs.org/install.sh | sh
    cd ..
    git clone <osm-spline-xapi-repo-link>
    cd osm-spline-xapi
    git submodule init
    git submodule update
    npm link
    cd deps/pg
    npm link
    cd ../..
    npm link pg
    cp etc/config.json etc/my-config.json
    # edit the my-config.json, take a look at etc/config.json
    #nice up the dance


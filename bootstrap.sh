#! /bin/sh

###########################
# start config

PREFIX=`pwd`/usr/
NODE_VERSION=0.3.5

# end config 
###########################

export PATH=${PREFIX}/bin:${PATH}

## Download Helper 
# $1 - url
# $2 - destdir
download() {
    mkdir -p ${PREFIX}/src
    
    if [ ! -f ${2} ]; then
	echo "!! saving source to $1"
        curl ${1} | tar -x -z -C ${PREFIX}/src
    fi
}

if [ ! -f ${PREFIX}/bin/node ]; then
    # fetch and compile nodejs
    download http://nodejs.org/dist/node-v${NODE_VERSION}.tar.gz ${PREFIX}/src/node-v${NODE_VERSION}

    cd ${PREFIX}/src/node-v${NODE_VERSION} 
    ./configure --prefix=${PREFIX}
    make install
else 
   echo "!! node already installed"
fi

if [ ! -f ${PREFIX}/bin/npm ];then
    # fetch and compile npm
    curl http://npmjs.org/install.sh |  sh
else 
   echo "!! npm already installed"

fi

# load development code and compile dependencies
npm link src/nodejs/

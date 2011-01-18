#! /bin/sh

NODE_VERSION=0.3.5

## Download Helper 
# $1 - url 
# $2 - tarball name
download() {
    echo $1
    mkdir -p usr/src
    
    if [ ! -f ${2} ]; then
        curl ${1} > ${2}
    fi

    tar -xf ${2} -C usr/src
}

# fetch and compile nodejs
download http://nodejs.org/dist/node-v${NODE_VERSION}.tar.gz node-${NODE_VERSION}.tar.gz
rm -f node-${NODE_VERSION}.tar.gz

cd usr/src/node-v${NODE_VERSION} 
./configure --prefix=../..
make install
cd ../../..

# fetch and compile npm
curl http://npmjs.org/install.sh |  PATH=`pwd`/usr/bin:${PATH} sh

# load development code and compile dependencies
usr/bin/npm link src/nodejs/

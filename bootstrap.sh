#! /bin/bash

###########################
# start config

# location of nvm script
NVM_PATH=nvm/nvm.sh
# location where node.js will be installed
export NVM_DIR=$PWD/nodejs

NODE_VERSION=v0.4.0
PROJECT_PATH=src/nodejs

# end config 
###########################

# create directory
mkdir -p  $NVM_DIR
echo $NVM_DIR

# source nvm
. $NVM_PATH
nvm sync

# install node if requested
echo "This will build and install node.js $NODE_VERSION into '$NVM_DIR'." 
read -p "Do you like to proceed? <y/N> " prompt
if [[ $prompt == "y" || $prompt == "Y" || $prompt == "yes" || $prompt == "Yes" ]]
    then
        nvm install $NODE_VERSION
        nvm use $NODE_VERSION 
fi


# install npm if requested
read -p "Do you like to install npm? <Y/n> " prompt
if [[ $prompt == "n" || $prompt == "N" || $prompt == "no" || $prompt == "No" ]]
    then
        exit 0;
    else
        curl http://npmjs.org/install.sh |  sh
fi

echo "Download all dependencies for project in $PROJECT_PATH"
npm link $PROJECT_PATH

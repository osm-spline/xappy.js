#! /bin/bash

###########################
# start config

#fetch nvm and perhaps modified pg module?
git submodule init
git submodule update

# location of nvm script
NVM_PATH=nvm/nvm.sh

NODE_VERSION=v0.4.7
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
read -p "Would you like to proceed? <y/N> " prompt
if [[ $prompt == "y" || $prompt == "Y" || $prompt == "yes" || $prompt == "Yes" ]]
    then
        nvm install $NODE_VERSION
        nvm use $NODE_VERSION
fi


# install npm if requested
read -p "Would you like to install npm? <Y/n> " prompt
if [[ $prompt == "n" || $prompt == "N" || $prompt == "no" || $prompt == "No" ]]
    then
        exit 0;
    else
        curl http://npmjs.org/install.sh | sh
fi

echo "Download all dependencies for project in $PROJECT_PATH"

npm link $PWD/pg
npm link $PROJECT_PATH

echo
echo "To use nvm source it by typing: 'NVM_DIR=$NVM_DIR . $PWD/$NVM_PATH' "
echo "For permanent usage, add it to your ~/.bashrc"
echo
echo "with 'nvm use $NODE_VERSION' you can enable nvm"

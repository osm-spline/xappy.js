#! /bin/bash

###########################
# start config

#fetch nvm and perhaps modified pg module?
git submodule init
git submodule update

# location of nvm script
NVM=nvm/nvm.sh

NODE_VERSION=v0.4.7
PROJECT_PATH=src/nodejs

# end config
###########################

# source nvm
. $NVM
nvm sync

# install node if requested
echo "This will build and install node.js $NODE_VERSION into '$NVM_DIR'."
read -p "Would you like to proceed? <y/N> " prompt
if [[ $prompt == "y" || $prompt == "Y" || $prompt == "yes" || $prompt == "Yes" ]]
    then
        nvm install $NODE_VERSION || exit 1
        nvm use $NODE_VERSION || exit 1
fi

echo "Download all dependencies for project in $PROJECT_PATH"

npm link $PWD/pg
npm link $PROJECT_PATH

echo
echo "To use nvm source it by typing: '. $(realpath $PWD/$NVM)' "
echo "For permanent usage, add it to your ~/.bashrc"
echo
echo "with 'nvm use $NODE_VERSION' you can enable nvm"

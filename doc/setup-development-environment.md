Setting up a  development environment
=====================================

Since we need nvm which is included as sub repo we first have to init the
submodules.

    git submodule init
    git submodule update

Next we use nvm (Node Version Manager) to set up node.js. It allows easy
installation of node.js into a local folder, so no root rights are needed. For
further info see [1]

Since nvm needs to modifiy the PATH var of the current shell it has to be
sourced. If you use zsh or have other reasons for not using nvm have a look at
nave.

    source deps/nvm/nvm.sh
    nvm sync

After sourcing it we actually compile node.js, this takes sometime and you have
to install `libssl-dev`, `python2.X` and `build-essential` first.

    nvm install stable
    nvm alias default stable
    nvm use stable

To nvm also installs npm (Node Package Manager) a gems-like software package
manager. For further infos see `man npm`.

For installing all deps, we link all dependencies and our project as development
version with npm.

    cd deps/pg
    npm link
    cd -
    npm link

To have the node in execution path, when starting up add this line to your
`~/.bashrc` file.

    source path/to/project/deps/nvm/nvm.sh

And done

Windows
-------

**this section needs some love**

To install node on windows, get the cygwin paket from http://uves.spline.de/osm-xapi-projekt/cygwin.zip

ToDo:

1. Change the name of the directory cygwin/home/yves to cygwin/home/yourname   
2. Adapt the paths in the .bat file in the cygwin directory and start it.
3. Add certificate: http://stackoverflow.com/questions/3777075/https-github-access/4454754#4454754
4. Change your /etc/hosts file to:

    127.0.0.1    localhost

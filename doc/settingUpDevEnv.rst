------------------------------------
Setting up a  develoment environment
------------------------------------

Since we need nvm which is included as sub repo we first have to init the
submodles.

::

    git submodule init
    git submodule update

Next we use nvm (Node Version Manager) to set up node.js. It allows easy
installation of node.js into a local folder, so no root rights are needed. For
further info see [1]

Since nvm needs to modifiy the PATH var of the current shell it has to be
sourced. If you use zsh or have other reasons for not using nvm have a look at
nave.

::

    source deps/nvm/nvm.sh
    nvm sync

After sourcing it we actuially compile node.js, this takes sometime and zou have
to *install libssl-dev, python2.X and build-essential* first.

::

    nvm install stable
    nvm alias default stable
    nvm use stable

To nvm also installs npm (Node Package Manager) a gems-like software package
manager. For further infos see *man npm*

For installing all deps, we link all dependencies and our project as development
version with npm.

::

    cd deps/pg
    npm link
    cd -


    npm link


To have the node in execution path, when starting up add this line to your
~/.bashrc file.

::

    source path/to/project/deps/nvm/nvm.sh

And done

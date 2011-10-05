Database setup
==============

We use postgres 9.\* with postgis 1.5. Postgres 9.0 is used because we need some
functions on hstores and postgis 1.5 is used for fancy geometry things.

You can find the database schema in the osm
[svn](http://trac.openstreetmap.org/browser/applications/utils/osmosis/trunk/package/script).

Linux
-----

To setup a database you first need a runing postgres 9.0 instance. I hope you know
how to do this.

Use

    createdb osm

to create a database with name osm. Use

    createlang plpgsql osm

to add plpgsql to your database. If you want to create a database user do so:

    createuser <username>

Add hstore support for your database:

    psql -d osm < /share/contrib/hstore.sql

Add postgis support for your database:

    psql -d osm < /share/contrib/postgis-1.5/postgis.sql

Just do:

    psql -d osm < /share/contrib/postgis-1.5/spatial_ref_sys.sql

Create the actual schema for osm data. For this step you need osmosis. If your
osmosis build is correct there should be a directory named package/scripts where
you run:

    psql -d osm < pgsql_snapshot_schema_0.6.sql
    psql -d osm < pgsql_snapshot_schema_0.6_linestring.sql

Optional/still to test:

    psql -d osm < pgsql_snapshot_schema_0.6_action.sql
    psql -d osm < pgsql_snapshot_schema_0.6_bbox.sql

For documentation on the schema read pgsnapshot_and_pgsimple.txt.

Import data from xml with:

    osmosis --read-xml file="planet.osm.bz2" --wp host="localhost" password="pass" user="user" database="osm"

Before or after import you may want to create a indexes. Examples below:

    CREATE INDEX idx_nodes_tags ON nodes USING GIN(tags);
    CREATE INDEX idx_nodes_tags ON nodes USING GIST(tags);
    CREATE INDEX idx_ways_tags ON ways USING GIN(tags);
    CREATE INDEX idx_ways_tags ON ways USING GIST(tags);

Mac OS X
--------

We assume that `homebrew` is installed

    brew install postgresql
    brew install postgis
    brew install osmosis

Install the db

    initdb osm

    initdb -U osm osm
    postgres -D osm/
    createdb -U osm osm

createlang -U osm -d osm plpgsql 
createlang: language "plpgsql" is already installed in database "osm"

    psql osm osm < /usr/local/Cellar/postgresql/9.0.4/share/postgresql/contrib/hstore.sql 
    psql osm osm < /usr/local/Cellar/postgresql/9.0.4/share/postgresql/contrib/postgis-1.5/postgis.sql
    psql osm osm < /usr/local/Cellar/postgresql/9.0.4/share/postgresql/contrib/postgis-1.5/spatial_ref_sys.sql

    psql osm osm < /usr/local/Cellar/osmosis/0.38/libexec/script/pgsql_simple_schema_0.6.sql
    psql osm osm < /usr/local/Cellar/osmosis/0.38/libexec/script/pgsql_simple_schema_0.6_linestring.sql


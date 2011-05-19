Installation
============

*This is a draft*

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


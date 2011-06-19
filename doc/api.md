Module documentation
====================

Purpose of this document
------------------------

In JS there is no way to inforce interfaces, but nodejs lets us use commonJS
modules. So we can define an interface for them. The following is a listing of
modules, and thier exported functions. Data types are inforced by test and will
be supported with generators as test helpers



Datatypes
---------

All fields notaded with `field*` are optional. Fields seperated with `field |
field` can be viewed as different options.

### xapiRequest

This object represents a different representation of our XPath query url. It
will be produced by the RequestParser and be translated in to a db-query by the
db-module.

    {
        object: "node" | "way" | "relation" | "*",
        bbox* : {   left : <number>,
                    bottom: <number>,
                    right: <number>,
                    top: <number> },
        tag* : {    key: [ <string> ] | [] ,
                    value: [ <string> ] | []}
    }

### Node object

OSM node representation.

    {
        id: <bigint>,
        lat: <bigint>,
        lon: <bigint>,
        version*: <bigint>,
        uid*: <bigint>,
        user*: <string>,
        changesetId*: <bigint>,
        timestamp*: <Date>,
        tags*: [ { key: <str>, value: <str> } ]
    }


### Way object

OSM way representation.

    {
        id: <bigint>,
        version*: <bigint>,
        uid*: <bigint>,
        user*: <string>,
        changesetId*: <bigint>,
        timestamp*: <Date>,
        nodes: [ <bigint> ],
        tags*: [ { key: <str>, value: <str> } ]
    }

### Relation object

OSM way representation.

    {
        id: <bigint>,
        version*: <bigint>,
        uid*: <bigint>,
        user*: name,
        changesetId*: <bigint>,
        timestamp*: <Date>,
        tags*: [ { key: <str>, value: <str> } ],
        members: [ {
            type: "node" | "way" | "relation",
            reference: <bigint>,
            role: <string>
        } ]
    }

Modules
-------

### requestParser

The purpose of this module is to for a request object from the string
representation of the url.

Methods

    parseFromUrl(<String>,<callback(err,xapiRequest)>)


### responseHandler

This `interface`-like description will be meet by several implementations, to
realize output in different formats (e.g. json / xml).

Methods

    putNode(<Node>);
    putWay(<Way>);
    putRelation(<Relation>);
    finish();

### Database

Access the database.

Methods

    executeRequest(xapiRequest,<callback(error,dbEventemitter)>)

the returned event emitter is a object of the following shape:

    dbEventEmitter{
        on(<String:Event>,<callback>)
    }

Those events are supported, calling the function with the specified arguments.

=========== =========
Events      Arguments
=========== =========
way         way
node        node
relation    relation
error       error
start       -
end         -
=========== =========

Postgres database module
------------------------

### QueryBuilder

The QueryBuilder is responsible for creating query plans executed by the postgres database module.

    QueryBuilder(); //constructor?
    createQueryPlan(xapiRequest);

### queryPlan

The query plan is a set of prepared statements from node-postgres

    {
        node : <query>,
        way* : <query>,
        relation*: <query>
    }

### query

A query is a prepared statement from node-postgres.
Please check the node-postgres documentation at:
https://github.com/brianc/node-postgres/wiki/Client

    {

        name : <string>,
        text : <string>,
        values : []
    }


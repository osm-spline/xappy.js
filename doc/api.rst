====================
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

All fields notaded with *field** are optional. Fields seperated with *field |
field* can be viewied as different options.

xapiRequest
...........

This object represents a different representation of our XPath query url. It
will be produced by the RequestParser and be translated in to a db-query by the
db-module. 

::

    {
        object: "node" | "way" | "relation" | "*",
        bbox* : {   left : <number>,
                    bottom: <number>,
                    right: <number>,
                    top: <number> },
        tag* : {    key: [ <string> ] | [] ,
                    value: [ <string> ] | []}
    }
    
Node object
...........

OSM node representation.

::
    
    {
        id: <bigint>,
        lat: <bigint>,
        long: <bigint>,
        version*: <bigint>,
        uid*: <bigint>,
        changesetId*: <bigint>,
        tags*: [ { key: <str>, value: <str> } ] 
    }


Way object
...........

OSM way representation.

::
    
    {
        id: <bigint>,
        version*: <bigint>,
        uid*: <bigint>,
        changesetId*: <bigint>,
        nodes: [ <bigint> ],
        tags*: [ { key: <str>, value: <str> } ]
    }


Relation object
...............

OSM way representation.

::
    
    {
        id: <bigint>,
        version*: <bigint>,
        uid*: <bigint>,
        changesetId*: <bigint>,
        tags*: [ { key: <str>, value: <str> } ],
        members: [ { 
            type: "node" | "way" | "relation",
            reference: <bigint>,
            role: <string>
        } ]
    }


Modules
-------

requestParser
.............

The purpose of this module is to for a request object from the string
representation of the url.

Methods
    parseFromUrl(<String>,<callback(err,xapiRequest)>)


responseHandler
...............

This *interface*-like descritption will be meet by serveral implementations, to
realize output in different formats (e.g. json / xml).

Methods
    putNode(<Node>);
    putWay(<Way>);
    putRelation(<Relation>);
    finish();

dataBase
........

Access the database.

Methods
    executeRequest(xapiRequest,<callback(dbEventemitter)>)

the returned event emitter is a object of the following shape:

::
    
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
err         err
end         
=========== =========



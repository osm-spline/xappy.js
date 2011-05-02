Module: requestParser
Exports:
    parseFromUrl(<String>,<callback(xapi_rquest)>)


Module: responseHandler
Exports:
    putNode(<Node>);
    putWay(<Way>);
    putRelation(<Relation>);
    finish();

Module: db
Exports:
    parseFromUrl(<String>,<callback(dbEventemitter)>)

Type: dbEventEmitter
Events -> Callback:
    way -> <callback(way)>
    node -> <callback(node)>
    relation -> <callback(relation)>
    err -> <callback(err)>
    end -> <callback>




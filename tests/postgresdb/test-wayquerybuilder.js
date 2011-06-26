var wayQueryBuilder = require('../../lib/postgresdb/wayquerybuilder');
var sampleObjects = require('../helpers/helper-samplexapirequestobjects');

module.exports = {
    'way': function(test) {
        var expected = {
             node : {
                name : '',
                //text : "SELECT nodes.id, nodes.version, nodes.user_id, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) AS tags, users.name AS user_name, X(nodes.geom) AS lat, Y(nodes.geom) AS lon FROM nodes, users, (SELECT DISTINCT node_id FROM way_nodes) AS nodesOfWays WHERE nodesOfWays.node_id = nodes.id AND users.id = nodes.user_id;",
                text : 'SELECT nodes.id, nodes.version, nodes.user_id, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) AS tags, X(nodes.geom) AS lat, Y(nodes.geom) AS lon, users.name AS user_name FROM nodes, users, (SELECT DISTINCT way_nodes.node_id FROM ways, way_nodes WHERE ways.id = way_nodes.way_id) AS nodesOfWays WHERE nodes.user_id = users.id AND nodesOfWays.node_id = nodes.id;',
                values : [],
                binary : true
             },
             way : {
                name : '',
                text : 'SELECT ways.id, ways.version, ways.user_id, ways.tstamp, ways.changeset_id, hstore_to_array(ways.tags) AS tags, ways.nodes, users.name AS user_name FROM ways, users WHERE ways.user_id = users.id;',
                values : [],
                binary : true
             }
        };
        var input = wayQueryBuilder.createQueryPlan(sampleObjects['way']);
        test.deepEqual(input, expected, '\texpected: ' + JSON.stringify(expected) + '\n\treturned: '+ JSON.stringify(input));
        test.finish();
     },

     'way[bbox=left,bottom,right,top]': function(test) {
         var expected = {
             node : {
                 name : '',
                 text : 'SELECT nodes.id, nodes.version, nodes.user_id, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) AS tags, X(nodes.geom) AS lat, Y(nodes.geom) AS lon, users.name AS user_name FROM nodes, users, (SELECT DISTINCT way_nodes.node_id FROM ways, way_nodes WHERE ways.id = way_nodes.way_id AND (ST_Crosses(st_setsrid(ways.linestring,4326),st_setsrid(st_makebox2d(st_setsrid(st_makepoint($1, $2),4326),st_setsrid(st_makepoint($3, $4),4326)),4326)))) AS nodesOfWays WHERE nodes.user_id = users.id AND nodesOfWays.node_id = nodes.id;',
                 values : [11, 53, 12, 54],
                 binary : true
             },
             way : {
                 name : '',
                 text : 'SELECT ways.id, ways.version, ways.user_id, ways.tstamp, ways.changeset_id, hstore_to_array(ways.tags) AS tags, ways.nodes, users.name AS user_name FROM ways, users WHERE ways.user_id = users.id AND (ST_Crosses(st_setsrid(ways.linestring,4326),st_setsrid(st_makebox2d(st_setsrid(st_makepoint($1, $2),4326),st_setsrid(st_makepoint($3, $4),4326)),4326)));',
                 values : [11,53,12,54],
                 binary : true
             }
         };
         var input = wayQueryBuilder.createQueryPlan(sampleObjects['way[bbox=11,53,12,54]']);
         test.deepEqual(input, expected, '\texpected: ' + JSON.stringify(expected) + '\n\treturned: '+ JSON.stringify(input));
         test.finish();
    },
    'way[name=Strandweg]': function(test) {
        var expected = {
             node : {
                 name : '',
                 text : 'SELECT nodes.id, nodes.version, nodes.user_id, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) AS tags, X(nodes.geom) AS lat, Y(nodes.geom) AS lon, users.name AS user_name FROM nodes, users, (SELECT DISTINCT way_nodes.node_id FROM ways, way_nodes WHERE ways.id = way_nodes.way_id AND (ways.tags @> hstore($1, $2))) AS nodesOfWays WHERE nodes.user_id = users.id AND nodesOfWays.node_id = nodes.id;',
                 values : ['name', 'Strandweg'],
                 binary : true
             },
             way : {
                 name : '',
                 text : 'SELECT ways.id, ways.version, ways.user_id, ways.tstamp, ways.changeset_id, hstore_to_array(ways.tags) AS tags, ways.nodes, users.name AS user_name FROM ways, users WHERE ways.user_id = users.id AND (ways.tags @> hstore($1, $2));',
                 values : ['name','Strandweg'],
                 binary : true
             }
        };
        var input = wayQueryBuilder.createQueryPlan(sampleObjects['way[name=Strandweg]']);
        test.deepEqual(input, expected, '\texpected: ' + JSON.stringify(expected) + '\n\treturned: '+ JSON.stringify(input));
        test.finish();
    },
    'way[name|name:de=Strandweg|Strandweg]': function(test) {
        var tagCondition = '(ways.tags @> hstore($1, $2) OR ways.tags @> hstore($3, $4) OR ways.tags @> hstore($5, $6) OR ways.tags @> hstore($7, $8))';
        var expected = {
             node : {
                 name : '',
                 text : 'SELECT nodes.id, nodes.version, nodes.user_id, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) AS tags, X(nodes.geom) AS lat, Y(nodes.geom) AS lon, users.name AS user_name FROM nodes, users, (SELECT DISTINCT way_nodes.node_id FROM ways, way_nodes WHERE ways.id = way_nodes.way_id AND ' + tagCondition + ') AS nodesOfWays WHERE nodes.user_id = users.id AND nodesOfWays.node_id = nodes.id;',
                 values : ['name', 'Strandweg','name','Strandweg','name:de','Strandweg','name:de','Strandweg'],
                 binary : true
             },
             way : {
                 name : '',
                 text : 'SELECT ways.id, ways.version, ways.user_id, ways.tstamp, ways.changeset_id, hstore_to_array(ways.tags) AS tags, ways.nodes, users.name AS user_name FROM ways, users WHERE ways.user_id = users.id AND ' + tagCondition + ';',
                 values : ['name', 'Strandweg','name','Strandweg','name:de','Strandweg','name:de','Strandweg'],
                 binary : true
             }
        };
        var input = wayQueryBuilder.createQueryPlan(sampleObjects['way[name|name:de=Strandweg|Strandweg]']);
        test.deepEqual(input, expected, '\texpected: ' + JSON.stringify(expected) + '\n\treturned: '+ JSON.stringify(input));
        test.finish();
    },

    'way[name=BrandenburgerTor|HeisseSchwestern]': function(test) {
        var tagCondition = '(ways.tags @> hstore($1, $2) OR ways.tags @> hstore($3, $4))';
        var expected = {
             node : {
                 name : '',
                 text : 'SELECT nodes.id, nodes.version, nodes.user_id, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) AS tags, X(nodes.geom) AS lat, Y(nodes.geom) AS lon, users.name AS user_name FROM nodes, users, (SELECT DISTINCT way_nodes.node_id FROM ways, way_nodes WHERE ways.id = way_nodes.way_id AND ' + tagCondition + ') AS nodesOfWays WHERE nodes.user_id = users.id AND nodesOfWays.node_id = nodes.id;',
                 values : ['name', 'BrandenburgerTor','name','HeisseSchwestern'],
                 binary : true
             },
             way : {
                 name : '',
                 text : 'SELECT ways.id, ways.version, ways.user_id, ways.tstamp, ways.changeset_id, hstore_to_array(ways.tags) AS tags, ways.nodes, users.name AS user_name FROM ways, users WHERE ways.user_id = users.id AND ' + tagCondition + ';',
                 values : ['name', 'BrandenburgerTor','name','HeisseSchwestern'],
                 binary : true
             }
        };
        var input = wayQueryBuilder.createQueryPlan(sampleObjects['way[name=BrandenburgerTor|HeisseSchwestern]']);
        test.deepEqual(input, expected, '\texpected: ' + JSON.stringify(expected) + '\n\treturned: '+ JSON.stringify(input));
        test.finish();
    },

    'way[name|amenity=BrandenburgerTor]': function(test) {
        var tagCondition = '(ways.tags @> hstore($1, $2) OR ways.tags @> hstore($3, $4))';
        var expected = {
             node : {
                 name : '',
                 text : 'SELECT nodes.id, nodes.version, nodes.user_id, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) AS tags, X(nodes.geom) AS lat, Y(nodes.geom) AS lon, users.name AS user_name FROM nodes, users, (SELECT DISTINCT way_nodes.node_id FROM ways, way_nodes WHERE ways.id = way_nodes.way_id AND ' + tagCondition + ') AS nodesOfWays WHERE nodes.user_id = users.id AND nodesOfWays.node_id = nodes.id;',
                 values : ['name', 'BrandenburgerTor','amenity','BrandenburgerTor'],
                 binary : true
             },
             way : {
                 name : '',
                 text : 'SELECT ways.id, ways.version, ways.user_id, ways.tstamp, ways.changeset_id, hstore_to_array(ways.tags) AS tags, ways.nodes, users.name AS user_name FROM ways, users WHERE ways.user_id = users.id AND ' + tagCondition + ';',
                 values : ['name', 'BrandenburgerTor','amenity','BrandenburgerTor'],
                 binary : true
             }
        };
        var input = wayQueryBuilder.createQueryPlan(sampleObjects['way[name|amenity=BrandenburgerTor]']);
        test.deepEqual(input, expected, '\texpected: ' + JSON.stringify(expected) + '\n\treturned: '+ JSON.stringify(input));
        test.finish();
    },

    'way[name|name:de=Strandweg|Strandweg][11,53,12,54]': function(test) {
        var tagCondition = '(ways.tags @> hstore($5, $6) OR ways.tags @> hstore($7, $8) OR ways.tags @> hstore($9, $10) OR ways.tags @> hstore($11, $12))';
        var spacialCondition = '(ST_Crosses(st_setsrid(ways.linestring,4326),st_setsrid(st_makebox2d(st_setsrid(st_makepoint($1, $2),4326),st_setsrid(st_makepoint($3, $4),4326)),4326)))';
        var expected = {
             node : {
                 name : '',
                 text : 'SELECT nodes.id, nodes.version, nodes.user_id, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) AS tags, X(nodes.geom) AS lat, Y(nodes.geom) AS lon, users.name AS user_name FROM nodes, users, (SELECT DISTINCT way_nodes.node_id FROM ways, way_nodes WHERE ways.id = way_nodes.way_id AND ' + spacialCondition + ' AND ' + tagCondition + ') AS nodesOfWays WHERE nodes.user_id = users.id AND nodesOfWays.node_id = nodes.id;',
                 values : [11, 53, 12, 54, 'name', 'Strandweg','name','Strandweg','name:de','Strandweg','name:de','Strandweg'],
                 binary : true
             },
             way : {
                 name : '',
                 text : 'SELECT ways.id, ways.version, ways.user_id, ways.tstamp, ways.changeset_id, hstore_to_array(ways.tags) AS tags, ways.nodes, users.name AS user_name FROM ways, users WHERE ways.user_id = users.id AND ' + spacialCondition + ' AND ' + tagCondition + ';',
                 values : [11, 53, 12, 54, 'name', 'Strandweg','name','Strandweg','name:de','Strandweg','name:de','Strandweg'],
                 binary : true
             }
        };
        var input = wayQueryBuilder.createQueryPlan(sampleObjects['way[name|name:de=Strandweg|Strandweg][bbox=11,53,12,54]']);
        test.deepEqual(input, expected, '\texpected: ' + JSON.stringify(expected) + '\n\treturned: '+ JSON.stringify(input));
        test.finish();
    }
};

//make this test standalone
if (module == require.main) {
    require('xappy-async_testing').run(__filename, process.ARGV);
}

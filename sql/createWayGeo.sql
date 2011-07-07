UPDATE ways SET linestring = (
       SELECT ST_LineFromMultiPoint(ST_Collect(n.geom)) FROM (
              SELECT nodes.geom as geom FROM way_nodes
	        JOIN nodes ON (way_nodes.node_id = nodes.id)
	        WHERE way_nodes.way_id = ways.id
                ORDER BY way_nodes.sequence_id
              ) as n
       );

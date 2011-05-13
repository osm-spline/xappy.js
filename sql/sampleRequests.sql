SELECT * FROM users, (
	SELECT * FROM nodes JOIN (
		SELECT node_id FROM way_nodes JOIN (
			SELECT ways.id FROM ways WHERE (linestring && st_setsrid(st_makebox2d(st_setsrid(st_makepoint(12.0,52.0),4326),st_setsrid(st_makepoint(13.0,53),4326)),4326))
				AND (ways.tags @> hstore('amenity','pub')))
			AS foo ON foo.id = way_id)
		AS bar ON nodes.id = bar.node_id)
   	AS foodoo WHERE foodoo.user_id = users.id;

SELECT *, users.name AS user_name FROM users,
	(SELECT DISTINCT id, version, user_id, tstamp, changeset_id, hstore_to_array(tags), X(geom) AS lat, Y(geom) AS lon FROM nodes JOIN
		(SELECT ways.nodes FROM ways WHERE
			(linestring && st_setsrid(st_makebox2d(st_setsrid(st_makepoint(12.0,52.0),4326),st_setsrid(st_makepoint(13.0,53),4326)),4326))
			AND (ways.tags @> hstore('amenity','pub')))
		AS foo ON nodes.id = ANY(foo.nodes))
	AS bar
	WHERE users.id = bar.user_id;

SELECT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags) AS tags, X(nodes.geom) AS lat, Y(nodes.geom) AS lon FROM nodes, users WHERE nodes.user_id = users.id;

/* api/0.6/ways */

/* select ways */
SELECT ways.id, ways.version, ways.user_id, name AS user_name, ways.tstamp, ways.changeset_id, hstore_to_array(ways.tags), ways.nodes FROM ways, users WHERE ways.user_id = users.id;

/* select nodes from ways */
SELECT DISTINCT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(tags), X(geom) AS lat, Y(geom) AS lon FROM nodes, way_nodes, users WHERE nodes.id = way_nodes.node_id AND nodes.user_id = users.id;

/* api/0.6/relation */

/* select all nodes */
SELECT nodes.id, nodes.version, nodes.user_id, nodes.tstamp, nodes.changeset_id, hstore_to_array(tags) AS tags, X(geom) AS lat, Y(geom) AS lon FROM nodes JOIN (SELECT DISTINCT * FROM relation_members WHERE member_type = 'N') AS relation_nodes ON relation_nodes.member_id = nodes.id
				UNION
SELECT nodes.id, nodes.version, nodes.user_id, nodes.tstamp, nodes.changeset_id, hstore_to_array(tags) AS tags, X(geom) AS lat, Y(geom) AS lon FROM nodes JOIN (SELECT * FROM way_nodes JOIN     (SELECT DISTINCT relation_members.member_id FROM relation_members WHERE member_type = 'W') AS foo ON foo.member_id = way_nodes.way_id) as bar ON node_id = nodes.id;
/* select all ways */
SELECT ways.*, name AS user_name FROM (SELECT ways.id, ways.version, ways.user_id, ways.tstamp, ways.changeset_id, hstore_to_array(ways.tags), ways.nodes FROM ways JOIN (SELECT DISTINCT * FROM relation_members WHERE member_type = 'W') AS relation_ways ON relation_ways.member_id = id) AS ways, users WHERE ways.user_id = users.id;
/* select all list of memers */
SELECT relations.id, relations.version, relations.user_id, relations.tstamp, relations.changeset_id, hstore_to_array(tags), relation_members.member_id, relation_members.member_type, relation_members.member_role FROM relations, relation_members WHERE relations.id = relation_members.relation_id;

/* api/0.6/* */

SELECT nodes.id, nodes.version, nods.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(tags) AS tags, X(geom) AS lat, Y(geom) AS lon FROM nodes, users WHERE nodes.user_id = users.id;

SELECT ways.id, ways.version, ways.user_id, users.name AS user_name, ways.tstamp, ways.changeset_id, hstore_to_array(ways.tags), ways.nodes FROM ways, users WHERE ways.user_id = users.id;
-- TODO add user name
SELECT relations.id, relations.version, relations.user_id, users.id AS user_name, relations.tstamp, relations.changeset_id, hstore_to_array(tags) FROM relations, users WHERE relations.user_id;

-- node[name=U3|U4]
SELECT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags), X(geom) AS lat, Y(geom) AS lon FROM nodes, users WHERE nodes.user_id = users.id AND (nodes.tags @> hstore('name','U3') OR nodes.tags @> hstore('name','U4'));
-- node[bbox=1,2,3,4]
SELECT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags), X(geom) AS lat, Y(geom) AS lon FROM nodes, users WHERE nodes.user_id = users.id AND (geom && st_setsrid(st_makebox2d(st_setsrid(st_makepoint(1,2),4326),st_setsrid(st_makepoint(3,4),4326)),4326));

--api/0.6/node[10.0,10.0,12.0,12][name=U3]
SELECT nodes.id, nodes.version, nodes.user_id, users.name AS user_name, nodes.tstamp, nodes.changeset_id, hstore_to_array(nodes.tags), X(geom) AS lat, Y(geom) AS lon FROM nodes, users WHERE nodes.user_id = users.id AND (geom && st_setsrid(st_makebox2d(st_setsrid(st_makepoint(1,2),4326),st_setsrid(st_makepoint(3,4),4326)),4326)) AND (nodes.tags @> hstore('name','U3'));

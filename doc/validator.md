Validator Behaviour
===================
Validate the xapiRequest that comes out of the parser

BBox out of range
-----------------
Throws Error 400 with Body

BBox with swapped values
------------------------
When left and right or top and bottom are swapped:
Throws Error 400 with Body

Tag predicate with child predicate no(tags)
-------------------------------------------
Returns HTTP 204, no content

Tag predicate with child predicate tags
---------------------------------------
Ignores the child predicate and process the rest of the request

Node object with attribute of the child predicate = node
--------------------------------------------------------
Returns HTTP 204, no content

Way object with attribute of the child predicate = way
------------------------------------------------------
Returns HTTP 204, no content

Way object with attribute of the child predicate = node
-------------------------------------------------------
Ignores the child predicate and process the rest of the request
According to the XAPI specification ways have at least 2 and at most 2000 nodes

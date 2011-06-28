# xappy.js

## Our Goal

Open Street Map (OSM), the Open Source alternative to Google Maps currently uses an interface written in MUMPS. Since only a few people are proficient in this language, that interface cannot be maintained sufficiently. 

The goal of this project is the implementation of a new interface for OSM. We especially intend to provide a proper documentation, so that other developers can work on the project without difficulties.

We have decided to use javascript in combination with node.js because it is a widely known language. Thus, other developers can work on the interface without complications.
Another advantage of node.js is, that it provides the possibility to stream data without having to buffer. This characteristic of node.js is especially of use with requests that produce large output.

Simultaneously to our project, other developers started a new implementation in Java. That implementation does not scale very good under heavy load. We want to provide a better solution by benefitting from the special characteristics of node.js.

## Mode of Operation of the Interface

The interface consists of multiple components: a XPath-parser, a xml generator as well as a json generator, an event emitter and a data base module. A PostgresSQL data base with a PostGIS extension which contains geo data serves as the data base backend.

The input has the form of XAPI http-queries, based on the XPath query language. Possible queries can refer to an area which is delimited by coordinates or can be specified by certain tags like "education" or "sport".

### Example

    http://www.informationfreeway.org/api/0.6/map?bbox=11.54,48.14,11.543,48.145
    http://www.informationfreeway.org/api/0.6/node[amenity=hospital]

The XPath parser translates the query into a query object which is then passed to the data base module. The data base module in turn passes a response object to the event emitter that on his part produces events of the type "node", "way" or "relation". The XML generator or respectively the JSON generator are given these events and form valid XML or JSON out of them.
Thanks to the streaming characteristics of node.js, the events can be output immediately after being transformed into XML or JSON. That means, one does not have to wait for every single fragment of the response to be computed and transformed.
The processing of the requests is carried out in an asynchronous manner.

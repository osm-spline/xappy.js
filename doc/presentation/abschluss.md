Xappy.js
========

Begrüßung und Einordnung in das Softwareprojekt Telematik

Übersicht über OpenStreetMap
============================

cc daten open data

Infrastruktur vorstelleno
Storage über 3 Datentypen


Datenbankschemas eins zum rendern eins für usneres

 - osmosis
 - mapnik
 - ui
 - xapi


Was ist die Xapi
================

Beschreibung
Http/Rest Interface für die OSM Daten

Blackbox vorstellen: Query rein (http) -> Blackbox xapi -> 3 Datentyen heraus

use case xapi
=============

 - Overlay über getiledete Karten
 - Schnelles Übersichtstool
 - replikation
 - analyse / statistiken


xappy.js
========

Unser Projekt: xappy.js
Neuimplementierung in nodejs

Zielsetzung xappy.js
====================

Erste Implementierung in Mumps (versteht keiner, hat fehler, keiner kann es fixen)

 - modulares design
 - testgestützt
 - effizienter / streaming statt aggregation

Dokumtation, Freie Software,

Zielsetzung für uns
===================

 - agile Entwicklung
 - testgetriebene Entwicklung

Struktur der Daten
==================

Es gibt Nodes (Punkte) auf der Karte.
Es gibt Wege. Wege bestehen aus geordneten Punkten.
Es gibt Relationen. Relationen bestehen aus Relationen, Wegen und Knodes

Beispiele für jeden Punkt. FU-Berlin Beispiel.

Die Kafete ist ein Punkt.
Wege sind intuitiv alle Straßen.
Aber auch Gebäude sind als Wege gezeichnet (Informatikfakultät)
kompletter Uni Bereich ist eine Relation.
Diese kann wieder Unter Relationen beinhalten (Beispiel)

Beispielnutzung
===============

 gib mir alle Knoten aus

    /*
    /nodes
    /way
    /relation


gib mir alle alle Bars aus

    /nodes[amenity=bar]

 gib mir alle Bars und Clubs aus

    /nodes[amenity=bar|club]

gib mir alle Bars und Clubs in Berlin aus

    /nodes[amenity=bar|club][bbox=x,x,x,x]


Implementierung
===============

simples Implementierungsbild (Parser, Db, Generator)
Grobe Beschreibung des Flußdiagrams

[img]

Parser
------

Erstellt aus den übergebenen urls Javascript Objekte

[bild von urlstring -> json]

Datenbankmodul
--------------

Fragt Datenbank ab und liefert Ergebnisse

[bild requestobject -> Datenbank -> responseobject (node, way,relation)]

Emittieren, Streamen

OutputGenerator
---------------

Generiert aus den Ergebnissen JSON oder XML


Implementierung mit allen Modules
=========================

Implementierungsbild

Beschreibung des Validators, der mehreren Generatoren, xappy.js, cli.js


Statistiken
===========

coverage
sloc
git history

Arbeitsweise
============

- git
- jenkins
- stores
- scrum
- issues
- standup meetings

Fazit
=====

- releases haben sich bewährt.

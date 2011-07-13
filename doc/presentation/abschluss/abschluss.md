% xappy.js
% Dozentin: Katinka Wolter
% Softwareprojekt Telematik

OpenStreetMap
=============
<!--
Begrüßung und Einordnung in das Softwareprojekt Telematik
Unser Projekt behandelt die Xapi, ein OpenStreetMap Projekt
-->

![](osm-logo.png)

<!--
Openstreetmap ist ein Projekt, das freie Geo Daten sammelt und diese
auf verschiedenste Art aufbereitet
-->

OpenStreetMap Infrastruktur
===========================

![](OSM_Components.png)

<!--

vereinfachte componentenübersicht?
wichtige module vorstellen
 - osmosis
 - mapnik
 - ui
 - xapi
-->

Was ist die Xapi
================

- Http-Schnittstelle zu den OSM Daten
- erweiterte Suchfunktionen

<!--
![bild mit querystring -> xapi -> 3 Datentypen]()
-->


<!--
An diesem Bild die 3 Objekttypen erklären
mit Beispielen

node kann beispielsweise eine bar sein, oder xxx
ways sind intuitiv wege aber auch beispielsweise grundrisse von gebäuden
relations ...

Es gibt Nodes (Punkte) auf der Karte.
Es gibt Wege. Wege bestehen aus geordneten Punkten.
Es gibt Relationen. Relationen bestehen aus Relationen, Wegen und Knodes

Beispiele für jeden Punkt. FU-Berlin Beispiel.

Die Kafete ist ein Punkt.
Wege sind intuitiv alle Straßen.
Aber auch Gebäude sind als Wege gezeichnet (Informatikfakultät)
kompletter Uni Bereich ist eine Relation.
Diese kann wieder Unter Relationen beinhalten (Beispiel)

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

-->

Für was wird die xapi benutzt
=============================

 - Overlay über bestehende Karten
 - Replikation
 - Anfragen über Editoren
 - Analyse / Statistiken

xappy.js
========

- libmad.js
- linux.js
- pdf.js
- git.js

jetzt auch

xappy.js

<!--
everything in js
Neuimplementierung in nodejs
-->
<!--
Erste Implementierung in Mumps
 - versteht keiner
 - hat fehler, keiner kann es fixen)
-->

Die wirklichen Gründe
=====================

    add(sNode)      ; Public ; Add a node
        ; #sNode = stream object containing node
        ;
        n line,nodeId,users,lat,lon,timestamp,user,uid,version,changeset
        ;
        s line=sNode("current")
        ;
        s nodeId=$p($p(line,"id=""",2),"""",1)
        s version=$p($p(line,"version=""",2),"""",1)
        i $g(^nodetag(nodeId,"@version"))>version d  q  ; Don't load older versions
        . i line["/>" q
        . f  d  i line["</node>" q
        . . s line=$$read^stream(.sNode)
        d delete(nodeId)
        ;
        s lat=$p($p(line,"lat=""",2),"""",1)
        s lon=$p($p(line,"lon=""",2),"""",1)
        i lon["e" s lon=+$tr(lon,"e","E")
        s ^node(nodeId)=lat_$c(0)_lon

<!-- rant -->

Warum nodejs
============

- 10000 Verbindungen in der Sekunde (hallo Apache)
- asynchrone Events (hallo Semaphore)
- alles wird gestreamed
- fancy und neu

Zielsetzung xappy.js
====================

 - modulares Design
 - Dokumentation
 - getesteter Code <!-- andere Vorschläge? -->
 - effiziente Implementierung


Zielsetzung für uns
===================

 - freies Softwareprojekt umsetzen
 - agil Entwickeln
 - testgetrieben Entwickeln
 - flexibler Arbeitsprozess
 - Erschließen und Verwenden von nodejs

Implementierung
===============

simples Implementierungsbild (Parser, Db, Generator)
Grobe Beschreibung des Flußdiagrams

<!--
[img]
-->

Parser
======

Erstellt aus den übergebenen urls Javascript Objekte

<!--
[bild von urlstring -> json]
-->

Datenbankmodul
==============

Fragt Datenbank ab und liefert Ergebnisse

<!--
[bild requestobject -> Datenbank -> responseobject (node, way,relation)]
-->

Emittieren, Streamen

OutputGenerator
===============

Generiert aus den Ergebnissen JSON oder XML

Implementierung mit allen Modules
=========================

Implementierungsbild

Beschreibung des Validators, der mehreren Generatoren, xappy.js, cli.js

Abgefallene Projekte
====================

- whoosh
- postgresmodul
- coverage in unit test implementiert

Arbeitsweise
============

- git
- jenkins
- stories
- scrum
- issues
- standup meetings

Retrospektive
=============

coverage
sloc
git history

<!-- fancy statistiken machen -->

Fazit
=====

- funktionsweise implementiert
- kinderkrankheiten
- releases haben sich bewährt.
- hackweekends bewährt
- blaues club mate brot ist lecker
- fritz cola brot mit zitrone nicht so...

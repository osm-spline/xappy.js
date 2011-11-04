xappy.js
========


<!---

# Bericht Teil1 (Einleitung)

englisch shit is copied

Motivation. At a high level, what is the problem area you are working in and why
is it important? It is important to set the larger context here. Why is the
problem of interest and importance to the larger community?

* geobasierte Dienste werden wichtiger
* Erhebung von Geodaten teuer, wenige Anbieter
* Bedarf nach freien Geodaten -> OSM

What is the specific problem considered in this paper? This paragraph narrows
down the topic area of the paper. In the first paragraph you have established
general context and importance. Here you establish specific context and
background.

* Zentraler Bestandteil: Anfrage der Geodaten
* Bereitstellung für Endgeräte oder andere Services
* Implmentierung einer RESTful HTTP-Api

"In this paper, we show that ...".  This is the key paragraph in the intro - you
summarize, in one paragraph, what are the main contributions of your paper given
the context you have established in paragraphs 1 and 2. What is the general
approach taken? Why are the specific results significant? This paragraph must be
really really good. If you can't "sell" your work at a high level in a paragraph
in the intro, then you are in trouble. As a reader or reviewer, this is the
paragraph that I always look for, and read very carefully.

* wir haben die osm xapi reimplmentiert
* unsere Implemntierung ist schlanker, besser strukturiert gestestes

You should think about how to structure  this one or two paragraph summary of
what your paper is all about. If there are two or three main results, then you
might consider itemizing them with bullets or in test (e.g., "First, ..."). If
the results fall broadly into two categories, you can bring out that distinction
here. For example, "Our results are both theoretical and applied in nature. (two
sentences follow, one each on theory and application)"



At a high level what are the differences in what you are doing, and what others
have done? Keep this at a high level, you can refer to a future section where
specific details and differences will be given. But it is important for the
reader to know at a high level, what is new about this work compared to other
work in the area.

* wir haben neu angefangen und auf neuen Technologien aufgesetzt
* systematisch mit Softwareprozess gearbeitet

"The remainder of this paper is structured as follows..." Give the reader a
roadmap for the rest of the paper. Avoid redundant phrasing, "In Section 2, In
section 3, ... In Section 4, ... " etc.

* Gliederung in a Nutshell
    * Einführung in OSM / OSM Architektur / Anforderungen
    * Umsetzung unseres Softwareprojekts
    * Bewertung unserer Umsetzung
    * Ausbaumöglichkeiten

-->

Das Xappy Projekt hat sich zum Ziel gesetzt, die XAPI neu zu implementieren.  

Die bisher vorhandene Schnittstelle ist in der Sprache MUMPS geschrieben. Da nur wenige Entwickler diese Sprache kennen, geschweige denn beherrschen und der ursprüngliche Entwickler zudem nicht mehr an der Schnittstelle arbeitet, kann sie nicht gepflegt oder erweitert werden. Das generelle Ziel und unsere Hauptaufgabenstellung war es also, dem OpenStreetMap Projekt eine neue, maintainbare Schnittstelle zur Verfügung zu stellen.  

Node.js
=======

Für unsere Implementierung der XAPI haben wir uns für die Verwendung von Node.js entschieden. Node.js ist eine serverseitige JavaScript-Entwicklungsumgebung, die asynchrone Events sowie Streaming unterstützt, und die durch ihre spezielle Funktionsweise in der Lage ist, bis zu 100000 gleichzeitige Verbindungen zu einem Server zu unterstützen. Diese Funktionsweise besteht darin, dass Funktionen mit der Ein- und Ausgabe arbeiten eine Callbackfunktion als Parameter bekommen, was dazu führt, dass Eingabe- und Ausgabeoperationen den Programmfluss nicht blockieren.  

Die Entscheidung für Node.js beruht also vorrangig auf dessen Skalierungsfähigkeiten. Die XAPI muss zum Teil Anfragen bearbeiten können, die massive Ausgaben erzeugen, wie zum Beispiel die Anfrage nach allen Straßen in einer Stadt. Bei solch umfassenden Anfragen erst auf das vollständige Ergebnis zu warten, um es ausgeben zu können, würde zu einer sehr schlechten Performance führen. Node.js ermöglicht es, Zwischenergebnisse zu streamen und sofort verarbeiten und ausgeben zu können. Dadurch kann eine wesentlich höhere Effizienz erreicht werden.  



Zielsetzung 
===========

Wir hatten folgende Anforderungen an unsere Implementierung:  
In erster Linie sollte der Code effizient arbeiten, um eine gute Implementierung bieten zu können. Der Code sollte weiterhin einem modularen Design folgen, also in unterschiedliche Module mit verschiedenen Funktionen aufgeteilt sein, um eine flexible Gesamtstruktur zu erreichen. Wir wollten zusätzlich eine gute Dokumentation zu unserer Implementierung schreiben, um anderen Entwicklern die Mitarbeit am Projekt möglichst zu erleichtern und die Funktionalität des gesamten Codes sollte durch Tests geprüft und abgesichert werden.  

Einige weitere Anforderungen richteten sich weniger an die Implementierung, sondern vielmehr an das uns selbst und unsere Arbeitsweise.
Wir wollten im Sinne von OpenStreetMap, einem OpenSource Projekt, unser Projekt ebenfalls als OpenSource Projekt umsetzen. Außerdem wollten wir neue Arbeitstechniken kennenlernen. Damit sind Ansätze wie agiles Entwickeln und testgetriebene Entwicklung gemeint. Letztlich wollten wir natürlich auch die verwendeten Technologien und Werkzeuge, wie zum Beispiel Node.js für uns schließen und zu verwenden lernen.  

<!---

# Bericht Teil5 (Schlussfolgerung und further research)

* meiste Features implementiert -> erfolgreich xapi

* weiter Pflege nötig (logging framework hat neue api)
* statistiken
* durch Modularität wäre andere Datenbanken anbindbar (geocouch)
* Architektur könnte an ein/zwei Stellen geglättet werden (object erzeugung)
* weiteres Outputformat (protobuf)
* extend to @syntax
* overpass api features erweitern (ist das überhaupt möglich)

* schlusswort
-->

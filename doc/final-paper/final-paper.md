xappy.js
========

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

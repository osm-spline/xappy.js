# xappy.js

## Ziel

Die Open Source Alternative zu Google Maps - Open Street Map (OSM) verwendet
derzeit eine Schnittstelle, welche in MUMPS geschrieben ist. Da nur wenige
Personen diese Sprache beherrschen, kann diese Schnittstelle nicht mehr ausreichend
gepflegt werden.

Die Implementierung einer neuen Schnittstelle für OSM ist Ziel dieses Projekts.
Insbesondere haben wir die Absicht, eine gute Dokumentation zu unserer
Implementierung zu liefern, damit auch andere Entwickler in Zukunft problemlos
damit arbeiten können.


Um die zukünftigen Entwicklern die Arbeit mit/an der Schnittstelle zu erleichtern,
haben wir uns für die Sprache Javascript in Verbindung mit node.js entschieden, da
es sich dabei um eine verbreitete Programmiersprache handelt, die von vielen
Entwicklern beherrscht wird.
Ein weiterer Vorteil von node.js ist der, dass es die Möglichkeit bietet, Daten zu
streamen ohne sie zwischenspeichern zu müssen. Diese Eigenschaft ist von großem
Nutzen bei Anfragen, die umfassende Ausgaben erzeugen.

In etwa zeigleich zu diesem Projekt wurde eine weitere Neuimplemenierung in Java
von anderen Entwicklern begonnen. Diese Implementierung skaliert allerdings zur
Zeit nicht sonderlich gut unter Last. Unsere Implementierung soll durch die
speziellen Eigenschaften von node.js dieses Problem besser angehen und lösen können.

## Funktionsweise der Schnittstelle

Die Schnittstelle besteht aus mehreren Komponenten: einem XPath-Parser, einem
XML- sowie einem JSON-Generator, einem EventEmitter, und einem Datenbankmodul. Als
Datenbank-Backend dient eine PostgreSQL Datenbank mit PostGIS Erweiterung, die
Geodaten enthält.

Die Eingabe erfolgt in Form von XAPI http-Queries, welche auf der XPath
Abfragesprache basierten. Mögliche  Anfragen können sich auf Gebiete beziehen, die
anhand von Koordinaten eingegrenzt werden, aber auch durch bestimmte Tags wie
"Bildung" oder "Sport" spezifiziert werden.

### Beispiel

    http://www.informationfreeway.org/api/0.6/map?bbox=11.54,48.14,11.543,48.145
    http://www.informationfreeway.org/api/0.6/node[amenity=hospital]

Die Query wird vom XPath-Parser in ein Anfrageobjekt übersetzt, das daraufhin an
das Datenbankmodul übergeben wird. Das Datenbankmodul wiederum gibt ein
Response-Objekt an den EventEmitter zurück, der seinerseits Events vom Typ "Node",
"Way" oder "Relation" erzeugt. Diese Events werden dem XML-Generator, bzw. dem
JSON-Generator übergeben, der daraus valides XML, bzw. JSON formt. Dank der
streaming-Eigenschaften von node.js können die Events, nachdem sie in XML, bzw.
JSON umgewandelt wurden sofort ausgegeben werden, ohne darauf warten zu müssen,
dass sämtliche Anfrageergebnisse ermittelt und umgewandelt wurden.

Die Verarbeitung der Anfragen erfolgt asynchron.

(optional: - Visuelle Repraesentation der generierten XML/JSON-Daten)`

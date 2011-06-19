Zum Testen benutzen wir [async-testing](http://bentomas.github.com/node-async-testing/).
Auf der Webseite befinden sich Code Beispiel.

Ein Beispiel für einen einfachen Test:

    module.exports = { 
      'test success': function(test) {
        test.ok(true);
        test.finish();
      },
      'test fail': function(test) {
        test.equal(true, false);
        test.finish()
      }
    };

    // boilerplate
    if (module == require.main) {
      return require('async_testing').run(__filename, process.ARGV);
    }

Als Mock Framework benutzen wir [sinon](http://sinonjs.org/), auf der Webseite befinden sich eine [Präsentation](http://cjohansen.no/talks/2011/xp-meetup).

Kurzer Abriss zu Spys, Stubs und Mocks
--------------------------------------


Spys testen ob ihre Funktionen aufgerufen wurden.
Stubs sind Objekte mit predefiniertem und festem Verhalten. Ein Stub gibt immer das gleiche Ergebnis zurück.
Mock simulieren Verhalten und enthalten Logik

Wie soll getestet werden?
-------------------------

* in jedem Test wird ein Modul getestet
* Tests befinden sich im `tests` Verzeichnis und haben folgende Namenskonvention `test-<modulname>.js`
* Es wird immer nur *eine* Eigenschaften des Module getestet
* Alle anderen Eigenschaften werden als funktionierend angenommen
* Es soll offensichtlich klar sein, was der Test macht

Code Coverage
-------------

Für code-coverage benutzen wir im Moment [node-jscoverage](https://github.com/visionmedia/node-jscoverage.git).

Um eine die Testabdeckung zu berechnen, einfach das git Repo von jscoverage (`git clone https://github.com/visionmedia/node-jscoverage.git`) clonen. Dann `./configure` und `make` in dem entstandenen Verzeichnis ausführen und dann die Tests mit `JSCOVERAGE="~/abs/pfad/zu/node-jscoverage/jscoverage" pfad/zu/osm-projekt/bin/run_tests` ausführen. Danach sollte im Wurzelverzeichnis des Projekts eine Datei "coverage.json" existieren.

Zum Auswerten der `coverage.json` kann man einfach `node tests/helpers/coverage/console.js` aufrufen.

Beispiel-Output:

    Test Coverage

    |------------------------------------------|----------|------|------|--------|
    | filename                                 | coverage | LOC  | SLOC | missed |
    |------------------------------------------|----------|------|------|--------|
    | genjson.js                               |    85.71 |   32 |   14 |      2 |
    | validator.js                             |   100.00 |   74 |   38 |      0 |
    | injector.js                              |   100.00 |   26 |    7 |      0 |
    | postgresdb/postgresdb.js                 |   100.00 |   82 |   33 |      0 |
    | postgresdb/querybuilder.js               |   100.00 |   13 |    6 |      0 |
    | postgresdb/nodequerybuilder.js           |   100.00 |   87 |   54 |      0 |
    | postgresdb/wayquerybuilder.js            |   100.00 |  110 |   67 |      0 |
    | postgresdb/rowparser.js                  |    78.79 |  111 |   33 |      7 |
    | parser/request.js                        |   100.00 |   84 |   40 |      0 |
    | parser/path.js                           |    98.18 |  138 |   55 |      1 |
    | parser/generic.js                        |   100.00 |   70 |   23 |      0 |
    | genxml.js                                |   100.00 |   78 |   38 |      0 |
    | xapi.js                                  |    46.15 |  105 |   65 |     35 |
    |------------------------------------------|----------|------|------|--------|
    |                                          |    90.49 | 1010 |  473 |     45 |
    |                                          |----------|------|------|--------|


Lektüre
-------

* [Mocks aren't stubs](http://martinfowler.com/articles/mocksArentStubs.html)
* [Mocking and Stubbing](http://www.ibm.com/developerworks/web/library/wa-mockrails/index.html)


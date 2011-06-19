## Links

* [Code Conventions by Crockford](http://javascript.crockford.com/code.html)
* [Code Conventions by Google](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)
* Use [JSLint](http://en.wikipedia.org/wiki/JSLint) before commiting code
* http://bonsaiden.github.com/JavaScript-Garden/
* For documenation: [JSDoc](http://en.wikipedia.org/wiki/JSDoc)

## General Formatting   

### Indentation 
Either 4 spaces, or aligned with the operator:  

    if (x == y) { 
        statements;
    }

    var foo = 'texttexttext text texttext' +   
              'more texttext text';  

### Line Length  
* 80 characters  
* if necessary break after operator  
* next line should be indented 8 spaces 
 
### Whitespaces 
* blank lines for logical groups (e.g. for variable declarations)  
* spaces between operators and operands, apart from unary operators  
* spaces after semicolons and commas  

## Functions

### Declaration 
* declaration before usage
* first variables, then inner functions
* minimum usage of global functions

### Formatting  
* function parameters on one line if possible, 
* if not possible, each on a new line, or break after 80 characters, 
* align with parantheses or indent

In general:

    function foo(a,b) {
        statements;
    }

Anonymous functions:  

    function (a,b) { 
        statements;
    }

Within blocks:  

    if (x) { 
        Var foo = function() {} 
    }  
    // INSTEAD OF  
    if (x) { 
        function foo() {}
    }

Invocation expression in parentheses:  

    var collection = (function (a,b) {
        return a * b;
    }());

### Nested Functions    
Yes.

## Variables
    
### Declaration 
* declaration before usage
* first statements in function body, 
* one per line, each with its own comment (if any) 
* minimum use of global variables
* no implied global variables

### Array and object literals   
    var a = [x1, x2, x3]; 
    // INSTEAD OF 
    var a1 = new Array(x1, x2, x3); 

    var o2 = {
        a: 0,
        b: 1,
        c: 2,
        'strange key': 3
    }; 
    // INSTEAD OF 
    var o2 = new Object();
    o2.a = 0;
    o2.b = 1;
    o2.c = 2;
    o2['strange key'] = 3;


## Statements   

### General     
* one statement per line, 
* always use semicolons, 
* parantheses only if required for syntax and semantics
* only assignments and invocations should be used as statements
* avoid assignments in if or while conditions, can be misunderstood as a missing '='
    

### compound    
Always use paratheses, also for single statements.

    begin {
        statements;
    }
    
#### labels     
Use only for while, do, for and switch.  
    
#### return
Return value at same line as return keyword.  

    return value; 
    // INSTEAD OF 
    return (value);

### if  

    if (condition) {
        statements;
    } else if (condition) {
        statements;
    } else {
        statements;
    } 
    
### for 
With arrays and loops with predeterminable number of iterations:  

    for (initialization; condition; up date) {
        statements;
    }

With objects, use with hasOwnProperty():  

    for (variable in object) {
        if (filter) {
            statements;
        }
    }

### for in loop 
Use only for objects, maps and hash tables, but NOT for arrays.

### while

    while (condition) {
        statements;
    }

### do  
    
    do {
        statements;
    } while (condition);

#### switch     

    switch (expression) {
        case expression:
            statements;
            break;/ return;/ throw;
        default:
            statements;
    }

### try 
    
    try {    
        statements;
    } catch (variable) {
        statements;
    } finally {
        statements;
    }

#### continue   
Avoid usage, confusing.

### with        
Do not use. It's not efficient, and not secure, since object of the with can have properties that collide with local variables.

### eval        
Use only for deserialization, since it makes for confusing semantics, and can be dangerous if it contains user input.

### strictEqual vs equal        
Prefer strictEqual (=== over ==).

### this        
Use only in constructors, methods and in setting up closures.

### closures    
Use carefully, closures can produce circular references.


## Objects      

### Associative arrays  
Never use an array as a map/hash/associative array.

### Strings     
Break a long string into several strings:

    var text = 'very very very long text' + 
               'even more text';

Prefer ' ' over " ", but put XML attribute values in " ".

### Wrapper Objects     
Not for primitive data types, use typecasting instead.

### modifying prototypes Of built in objects    
No.

### Constants   
Don't use @const keyword with primitive datatypes.  
Never use const (not parsed by IE)




## Names

Upper and lower case letters (a-z, A-Z), digits and underscore.  
Don't use underscore as first character.

* functionNamesLikeThis
* variableNamesLikeThis
* ClassNamesLikeThis
* EnumNamesLikeThis
* methodNamesLikeThis   
* SYMBOLIC_CONSTANTS_LIKE_THIS 

### Files
    
* lowercase (in case of case-sensitive platforms)
* end in .js
* no punctuation, except for - and _ (prefer - to _)

### Namespaces  
Simulate by using pseudo namespaces  

    var sloth = {};

    sloth.sleep = function() {
        statements;
    };

Or use Closure Library or Dojo Toolkit

    goog.provide('sloth');

    sloth.sleep = function() {
        statements;
    };


## Comments             

* JSDoc
* keep up to date, 
* clear, useful comments
* line comments in general, block comments for documentation and commenting out
* don't use IE's conditional comments
        

## Other Features       

### Standard Features   
prefer standard over non-standard features

### multilevel prototype hierachies     
not preferred, use goog.inherits() from closure library or similar

### method definitions  
Foo.prototype.bar = function() {};

### Deferred Initialization     
ok

### Explicit Scope      
always

### Logging
instead of console.log(); use log.debug();

We use log4js as logging toolkit:

    var log4js = require('log4js')();
    var log = log4js.getLogger('yourModuleHere');

    //log something with log level info
    log.info('Hello World...');    


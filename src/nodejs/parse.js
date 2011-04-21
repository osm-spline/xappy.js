

var parser = function(){

    var offset =0;
    var expr ="";

    var keys = [];
    var values = [];
    var bbox= {};
    var object = "";

    var check = function(char){
        if (expr.charAt(offset) != char) {
            throw "Unexpected char " + expr[offset] +  " at " + offset + " expected: " + char;
        }
        offset ++;
    }
    
    var parsePredicate = function(){
        check('[');
        parseInnerPredicate();
        check(']');
    }

    var parseInnerPredicate = function(){
        tmpKeys=[];
        parseKeyValue(tmpKeys,'=');
        check('=');
        if(tmpKeys.length==1 && tmpKeys[0] == "bbox"){
            parseBboxValues();
        } else {
            keys = tmpKeys;
            parseKeyValue(values,']');
        }
    }

    var parseBboxValues = function(){
        bbox.left = parseBboxFloat();
        check(',');
        bbox.bottom = parseBboxFloat();
        check(',');
        bbox.right = parseBboxFloat();
        check(',');
        bbox.top = parseBboxFloat();
    }

    var parseBboxFloat = function(){
        var floatStr = "";
        while(expr[offset]!=',' &&  expr[offset]!=']' && offset < expr.length){
            floatStr += expr[offset];
            offset ++;
        }
        return parseFloat(floatStr);
    }

    var parseKeyValue = function(list,delim){
        var word = "";
        while(expr[offset]!=delim && offset < expr.length){
            if(expr[offset]=='|'){
                list.push(word);
                word="";
                offset ++;
                continue;
            }
            // jump escaped chars
            if(expr[offset]=='\\'){
                word += expr[offset];
                offset ++;
            }
            word += expr[offset];
            offset ++;
        }
        list.push(word);

    }

    this.parse = function(exprLocal){
        expr = exprLocal;
        offset = 0;
        object = "";



        check('/');

        for(;expr[offset]!='[' && offset<expr.length;offset++){
            if(expr[offset] == '/' && offset == expr.length-1){
                offset ++;
                break;
            }
            object += expr[offset];
        }

        if (object != "*" && object != "way" && object != "node" && object != "relation"){
            throw "invalid identifier: "  + object;
        }


        for(var i=0; i<3 && offset < expr.length;i++) {
            parsePredicate();
        }
        if (offset < expr.length){

            throw "string longer than excepected";
        }

        var result = {
            object : object
        };

        if(bbox.left != undefined){
            result.bbox = bbox;
        }

        if(keys.length > 0){

            result.tag = { 
                key : keys,
                value : values
            }
        }
        return result; 
    }
}


exports.urlToXpathObj = function urlToXpathObj(url){
    var parse = new parser();
    return parse.parse(unescape(url));
}

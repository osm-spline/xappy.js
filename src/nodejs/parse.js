exports.urlToXpathObj = function urlToXpathObj(url){

    // FIXMEresult.shift(): more validaiton
    // filter stars in keys
    // filter no enough arguments

    var parseKeyList = function(string){
        
        console.log("input f1: " + string);
        result = /([^\|]*)/g.exec(string);
        console.log(result);
        result.shift();
        return result;
    }   

    var parseBboxList = function(string){

        console.log("input: " + string);
        result = /(.+),(.+),(.+),(.+)/.exec(string);

        console.log(result);

        if(result.length != 4){ 
            throw "error";
        }   

        result.shift();

        return {
            'left' : result[0],
            'bottom' : result[1],
            'right' : result[2],
            'top' : result[3]
        }  
    } 
        
    var xp = {}; 

    result = url.match(/\/(\*|node|way|relation)\[(.*)=(.*)\]*/);
    console.log("OUTER: " + result);


    xp.object=result[1];

    for(i=2;i<=result.length;i++){
        if(result[i]==="bbox" && result[i]){
            xp.bbox = parseBboxList(result[i+1]);
        } else {
            if(result[i]){
                xp.tag ={};
                xp.tag.keys = parseKeyList(result[i]);
                xp.tag.values = parseKeyList(result[i+1]); 
            }
        }   
        i++;
    }
    console.log(xp);
    return(xp);
}


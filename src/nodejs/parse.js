exports.urlToXpathObj = function urlToXpathObj(url){

    // FIXMEresult.shift(): more validaiton
    // filter stars in keys
    // filter no enough arguments

    var parseKeyList = function(string){
        result = /(.+)(:?\|(.+))/.exec(string);
        result.shift();
        return result;
    }   

    var parseBboxList = function(string){

        result = /(.+)(:?,(.+)){3}/.exec(string);

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

    result = /\/(*|node|way|relation)(:?\[(.*)=(.*)\])*/.exec(url);

    xp.object=result[1];

    for(i=2;i<=result.length;i++){
        if(result[i]==="bbox"){
            xp.bbox = parseBboxValues(result[i+1]);
        } else {
            xp.tag ={};
            xp.tag.keys = parseKeyList(result[i]);
            xp.tag.values = parseKeyList(result[i+1]); 
        }   
        i++;
    }   
}


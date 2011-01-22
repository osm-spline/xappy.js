exports.mkJsonRes = function mkJsonRes(res){
    res.started = false;
    res.atStart = function (){ 
        if(!this.started){
            this.writeHead(200);
            this.write('json start start');
            this.started = true;
        }   
    }   
    res.atEnd = function(){
        if(!this.started){
            this.atStart(pojo);
        }   
        this.write('json enden');
        this.end();
    }   
    res.putNode = function (pojo){
        if(!this.started){
            this.atStart(pojo);
        }   
        this.write(JSON.stringify(pojo));
    }   

    res.endWith500 = function(){
        this.writeHead(500);
        this.end();
    }   
    return res;
}

exports.mkXmlRes = function (res){
    return exports.mkJsonRes(res);
}



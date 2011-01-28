var xmlGen = require('./xmlGenerator');
// FIXME: this is a total mess
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
    res.started = false;
    res.atStart = function (){
        if(!this.started){
            this.writeHead(200);
            this.write('<xml>');
            this.started = true;
        }
    }
    res.atEnd = function(){
        if(!this.started){
            this.atStart();
        }
        this.write('</xml>');
        this.end();
    }
    res.putWay = function (pojo){
        if(!this.started){
            this.atStart(pojo);
        }
        this.write(xmlGen.createWay(pojo));
    }

    res.putNode = function (pojo){
        if(!this.started){
            this.atStart(pojo);
        }
        this.write(xmlGen.createNode(pojo));
    }

    res.endWith500 = function(){
        this.writeHead(500);
        this.end();
    }
    return res;
}



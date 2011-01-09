// imports
var http = require('http'),
    querystring = require('querystring'),
    pg = require('pg'),
    url = require('url'),
    querystring = require('querystring');

// config
var connectionString = "pg://user:pass@localhost/xapi"


function getDataBaseResult(tag,bbox,res){
pg.connect(connectionString,function(err,client){
    var the_result;
    if(err){
        console.log(err);
    } else {
        client.query(createQuery(tag,bbox),function(err,result){
            if (err) {
                console.log(err);
            } else {
                console.log(result);
                res.write(result.rows);
                res.end("/n");
            }
            
        }); 
    }
});
}


function createQuery(tag,bbox){
    // FIXME: validate
    var table = tag[0] + "#" + tag[1];
    var filter = "";

    // input validation
    for(i=0;i<bbox.length;i++){
        bbox[i] = parseFloat(bbox[i]);
    }

    if(bbox){
        filter = "WHERE longitude > " + bbox[0] + " AND longitude < " + bbox[1] +
                 " AND latitude > " + bbox[2] + " AND latitude < " + bbox[3];
    } 
    return "SELECT * FROM \"" + table + "\" " + filter + ";";
}


RegExp.escape= function(s) {
    return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
};


var PATH_PREFIX = '/api/';
var base_url_re = new RegExp('^' + RegExp.escape(PATH_PREFIX) +
    '(node|way|relation|\\*)(.*)$')
var filter_re = /\[(\w+=[^\]]+)\]/g;


http.createServer(function (req, res) {

    if (!base_url_re.test(req.url)) {
        res.writeHead(404, {'Content-Type': 'text/plain; charset=utf8'});
        res.end('Not Found\n');
    }
    base_url_re.exec(req.url);
    var type = RegExp.$1, url_rest = querystring.unescape(RegExp.$2);
    
    var filters = [];
    while (v = filter_re.exec(url_rest)) {
        filters.push(v[1]);
    }
    console.log(filters);
    
    var tag;
    var bbox;

    for(i=0;i<filters.length;i++){
        filters[i]=filters[i].split(/=/);
        if(filters[i][0]=="bbox"){
            bbox = filters[i][1].split(/,/);
        }
        else {
            tag = filters[i];
        }
    }

    console.log(tag);
    console.log(bbox);

    getDataBaseResult(tag,bbox,res);   

    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf8', });
    
    res.write('URL was: ' + req.url + '\n');
    res.write('type: ' + type + '\n');
    res.write('filters:\n');
    filters.forEach(function(x) { res.write(' ' + x + '\n'); })
    //res.end('\n');

}).listen(8124, "127.0.0.1");

console.log('Listening on http://127.0.0.1:8124/')

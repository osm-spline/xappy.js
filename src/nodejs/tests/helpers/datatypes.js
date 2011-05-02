require('assert');

var knownDatatypes = {
    xapiRequest : {
        type : 'costum',
        members : {
            object : 'osmObject'
        } ,
        optionalMembers : {
            bbox : 'osmBbox',
            tag : 'osmTag'
        }
    },
    requestObject : {
        type : 'enum',
        values : [ 'node' , 'way', 'relation', '*' ]
    },
    requestBbox : {
        type : 'costum',
        members : {
            left : 'number',
            right : 'number',
            top : 'number',
            bottom : 'number'
        },
    },
    requestTag : {
        type : 'costum',
        members: {
            key : 'list',
            value : 'list'
        },
    }
}



//export.checkQueryObject = function(obj){
//    checkCostumType(obj,'xapiRequest');
//}
var checkType = function(obj,type){
    console.log(obj + " " + type);
    




}


var checkCostumType = function(obj,type){
    
    var members = knownDatatypes[type].members;
    var optionalMembers = knownDatatypes[type].optionalMembers;

    for ( member in members ) 
    {   
        //console.log("Checking member: " + member);
        if ( ! obj.hasOwnProperty(member) || ! checkType(obj[member],members[member])) {
            return false;
        }
    }
    
    for ( member in optionalMembers ) 
    {   
        //console.log("Checking optional member: " + member);
        if (! checkType(obj[member],optionalMembers[member])) {
            return false;
        }
    }

    return true;
}

// ################# fire and for get tests



var testObj = {
    object: "node",
    bbox : {
            left : 3.1,
            bottom: 4,
            right: 100,
            top: 50 
    },
    tag: {
            key: [ "adsd" ],
            value: [ "asdas"] 
    }
}

console.log(checkCostumType(testObj,'xapiRequest'));

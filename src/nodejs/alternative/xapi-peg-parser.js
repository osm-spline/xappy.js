function parseToXML(string){
    var res = Expr(string);
    return (res[0] ? f(res[1],0,string) : 'parse error')
    function f(n,p,s){
        var ret,i,l
        if (n[0] == -1)
            return string.substring(p,p+n[1])
        ret = '<' + Expr.names[n[0]] + ' raw="' + string.substring(p,p+n[1]) + '">';
        for(i=0 , l=n[2].length ; i<l ; i++)
        {
            ret += '\n' + f(n[2][i],p,s)
            p += n[2][i][1]
        }
        ret += '\n' + '<\\' + Expr.names[n[0]]+'>'
        return ret.replace(/\n/g,'\n ')
    }
}

function Expr(str){
 var tbl=[],pos=0,l=str.length+1;while(l--)tbl.push([]);l=str.length;
 function Expr(a){var x,p=pos,c;if(x=tbl[p][0]){pos=x[1];a.push([p,0]);return 1}if(x==false){return 0}c=[];return fin(c,p,0,_Expr(c),a)}
 function Path(a){var x,p=pos,c;if(x=tbl[p][1]){pos=x[1];a.push([p,1]);return 1}if(x==false){return 0}c=[];return fin(c,p,1,_Path(c),a)}
 function Type(a){var x,p=pos,c;if(x=tbl[p][2]){pos=x[1];a.push([p,2]);return 1}if(x==false){return 0}c=[];return fin(c,p,2,_Type(c),a)}
 function XPath(a){var x,p=pos,c;if(x=tbl[p][3]){pos=x[1];a.push([p,3]);return 1}if(x==false){return 0}c=[];return fin(c,p,3,_XPath(c),a)}
 function Bbox(a){var x,p=pos,c;if(x=tbl[p][4]){pos=x[1];a.push([p,4]);return 1}if(x==false){return 0}c=[];return fin(c,p,4,_Bbox(c),a)}
 function Tag(a){var x,p=pos,c;if(x=tbl[p][5]){pos=x[1];a.push([p,5]);return 1}if(x==false){return 0}c=[];return fin(c,p,5,_Tag(c),a)}
 function Child(a){var x,p=pos,c;if(x=tbl[p][6]){pos=x[1];a.push([p,6]);return 1}if(x==false){return 0}c=[];return fin(c,p,6,_Child(c),a)}
 function BboxPredicate(a){var x,p=pos,c;if(x=tbl[p][7]){pos=x[1];a.push([p,7]);return 1}if(x==false){return 0}c=[];return fin(c,p,7,_BboxPredicate(c),a)}
 function Left(a){var x,p=pos,c;if(x=tbl[p][8]){pos=x[1];a.push([p,8]);return 1}if(x==false){return 0}c=[];return fin(c,p,8,_Left(c),a)}
 function Bottom(a){var x,p=pos,c;if(x=tbl[p][9]){pos=x[1];a.push([p,9]);return 1}if(x==false){return 0}c=[];return fin(c,p,9,_Bottom(c),a)}
 function Right(a){var x,p=pos,c;if(x=tbl[p][10]){pos=x[1];a.push([p,10]);return 1}if(x==false){return 0}c=[];return fin(c,p,10,_Right(c),a)}
 function Top(a){var x,p=pos,c;if(x=tbl[p][11]){pos=x[1];a.push([p,11]);return 1}if(x==false){return 0}c=[];return fin(c,p,11,_Top(c),a)}
 function Coordinate(a){var x,p=pos,c;if(x=tbl[p][12]){pos=x[1];a.push([p,12]);return 1}if(x==false){return 0}c=[];return fin(c,p,12,_Coordinate(c),a)}
 function TagPredicate(a){var x,p=pos,c;if(x=tbl[p][13]){pos=x[1];a.push([p,13]);return 1}if(x==false){return 0}c=[];return fin(c,p,13,_TagPredicate(c),a)}
 function Keys(a){var x,p=pos,c;if(x=tbl[p][14]){pos=x[1];a.push([p,14]);return 1}if(x==false){return 0}c=[];return fin(c,p,14,_Keys(c),a)}
 function Key(a){var x,p=pos,c;if(x=tbl[p][15]){pos=x[1];a.push([p,15]);return 1}if(x==false){return 0}c=[];return fin(c,p,15,_Key(c),a)}
 function Vals(a){var x,p=pos,c;if(x=tbl[p][16]){pos=x[1];a.push([p,16]);return 1}if(x==false){return 0}c=[];return fin(c,p,16,_Vals(c),a)}
 function Val(a){var x,p=pos,c;if(x=tbl[p][17]){pos=x[1];a.push([p,17]);return 1}if(x==false){return 0}c=[];return fin(c,p,17,_Val(c),a)}
 function Chars(a){var x,p=pos,c;if(x=tbl[p][18]){pos=x[1];a.push([p,18]);return 1}if(x==false){return 0}c=[];return fin(c,p,18,_Chars(c),a)}
 function SpecialChar(a){var x,p=pos,c;if(x=tbl[p][19]){pos=x[1];a.push([p,19]);return 1}if(x==false){return 0}c=[];return fin(c,p,19,_SpecialChar(c),a)}
 function Special(a){var x,p=pos,c;if(x=tbl[p][20]){pos=x[1];a.push([p,20]);return 1}if(x==false){return 0}c=[];return fin(c,p,20,_Special(c),a)}
 function Space(a){var x,p=pos,c;if(x=tbl[p][21]){pos=x[1];a.push([p,21]);return 1}if(x==false){return 0}c=[];return fin(c,p,21,_Space(c),a)}
 function Equals(a){var x,p=pos,c;if(x=tbl[p][22]){pos=x[1];a.push([p,22]);return 1}if(x==false){return 0}c=[];return fin(c,p,22,_Equals(c),a)}
 function Escape(a){var x,p=pos,c;if(x=tbl[p][23]){pos=x[1];a.push([p,23]);return 1}if(x==false){return 0}c=[];return fin(c,p,23,_Escape(c),a)}
 function LeftBracket(a){var x,p=pos,c;if(x=tbl[p][24]){pos=x[1];a.push([p,24]);return 1}if(x==false){return 0}c=[];return fin(c,p,24,_LeftBracket(c),a)}
 function RightBracket(a){var x,p=pos,c;if(x=tbl[p][25]){pos=x[1];a.push([p,25]);return 1}if(x==false){return 0}c=[];return fin(c,p,25,_RightBracket(c),a)}
 function LeftParent(a){var x,p=pos,c;if(x=tbl[p][26]){pos=x[1];a.push([p,26]);return 1}if(x==false){return 0}c=[];return fin(c,p,26,_LeftParent(c),a)}
 function RightParent(a){var x,p=pos,c;if(x=tbl[p][27]){pos=x[1];a.push([p,27]);return 1}if(x==false){return 0}c=[];return fin(c,p,27,_RightParent(c),a)}
 function Backslash(a){var x,p=pos,c;if(x=tbl[p][28]){pos=x[1];a.push([p,28]);return 1}if(x==false){return 0}c=[];return fin(c,p,28,_Backslash(c),a)}
 function Pipe(a){var x,p=pos,c;if(x=tbl[p][29]){pos=x[1];a.push([p,29]);return 1}if(x==false){return 0}c=[];return fin(c,p,29,_Pipe(c),a)}
 function Char(a){var x,p=pos,c;if(x=tbl[p][30]){pos=x[1];a.push([p,30]);return 1}if(x==false){return 0}c=[];return fin(c,p,30,_Char(c),a)}
 function ChildPredicate(a){var x,p=pos,c;if(x=tbl[p][31]){pos=x[1];a.push([p,31]);return 1}if(x==false){return 0}c=[];return fin(c,p,31,_ChildPredicate(c),a)}
 function Integer(a){var x,p=pos,c;if(x=tbl[p][32]){pos=x[1];a.push([p,32]);return 1}if(x==false){return 0}c=[];return fin(c,p,32,_Integer(c),a)}
 function Double(a){var x,p=pos,c;if(x=tbl[p][33]){pos=x[1];a.push([p,33]);return 1}if(x==false){return 0}c=[];return fin(c,p,33,_Double(c),a)}
 function Sign(a){var x,p=pos,c;if(x=tbl[p][34]){pos=x[1];a.push([p,34]);return 1}if(x==false){return 0}c=[];return fin(c,p,34,_Sign(c),a)}
 function Empty(a){var x,p=pos,c;if(x=tbl[p][35]){pos=x[1];a.push([p,35]);return 1}if(x==false){return 0}c=[];return fin(c,p,35,_Empty(c),a)}
 function Dot(a){var x,p=pos,c;if(x=tbl[p][36]){pos=x[1];a.push([p,36]);return 1}if(x==false){return 0}c=[];return fin(c,p,36,_Dot(c),a)}
 function Komma(a){var x,p=pos,c;if(x=tbl[p][37]){pos=x[1];a.push([p,37]);return 1}if(x==false){return 0}c=[];return fin(c,p,37,_Komma(c),a)}
 function WildCard(a){var x,p=pos,c;if(x=tbl[p][38]){pos=x[1];a.push([p,38]);return 1}if(x==false){return 0}c=[];return fin(c,p,38,_WildCard(c),a)}
 function CR(a){var x,p=pos,c;if(x=tbl[p][39]){pos=x[1];a.push([p,39]);return 1}if(x==false){return 0}c=[];return fin(c,p,39,_CR(c),a)}
 function LF(a){var x,p=pos,c;if(x=tbl[p][40]){pos=x[1];a.push([p,40]);return 1}if(x==false){return 0}c=[];return fin(c,p,40,_LF(c),a)}
 var _Expr=q(Path,Type,r(0,1,XPath))
 var _Path=sl_0
 var _Type=o(WildCard,sl_1,sl_2,sl_3)
 var _XPath=o(q(Bbox,r(0,1,q(Tag,r(0,1,Child)))),q(Bbox,Child,r(0,1,Tag)),q(Tag,r(0,1,q(Bbox,r(0,1,Child)))),q(Tag,Child,r(0,1,Bbox)),q(Child,r(0,1,q(Tag,r(0,1,Bbox)))),q(Child,Bbox,r(0,1,Tag)))
 var _Bbox=q(LeftBracket,BboxPredicate,RightBracket)
 var _Tag=q(LeftBracket,TagPredicate,RightBracket)
 var _Child=q(LeftBracket,ChildPredicate,RightBracket)
 var _BboxPredicate=q(cs_0,cs_0,cs_1,cs_2,Equals,Left,Komma,Bottom,Komma,Right,Komma,Top)
 var _Left=Coordinate
 var _Bottom=Coordinate
 var _Right=Coordinate
 var _Top=Coordinate
 var _Coordinate=o(q(r(0,1,Sign),Double),q(r(0,1,Sign),Integer))
 var _TagPredicate=q(Keys,Equals,Vals)
 var _Keys=q(Key,r(0,0,q(Pipe,Key)))
 var _Key=Chars
 var _Vals=o(WildCard,Val)
 var _Val=o(q(Chars,Pipe,Keys),Chars)
 var _Chars=q(Char,r(0,0,Char))
 var _SpecialChar=q(Escape,Special)
 var _Special=o(Equals,LeftBracket,RightBracket,LeftParent,RightParent,Pipe,Backslash)
 var _Space=cs_3
 var _Equals=cs_4
 var _Escape=cs_5
 var _LeftBracket=cs_6
 var _RightBracket=cs_7
 var _LeftParent=cs_8
 var _RightParent=cs_9
 var _Backslash=cs_5
 var _Pipe=cs_10
 var _Char=o(SpecialChar,cs_11,cs_12,cs_13,cs_5,cs_14,cs_15)
 var _ChildPredicate=o(sl_4,sl_5,sl_6,sl_7,sl_7,sl_2,sl_8,sl_1,sl_9,sl_3,sl_10)
 var _Integer=o(sl_11,q(r(0,1,Sign),cs_16,r(0,0,cs_17)))
 var _Double=q(Integer,sl_12,r(0,0,cs_17))
 var _Sign=o(sl_13,sl_14)
 var _Empty=e
 var _Dot=sl_12
 var _Komma=sl_15
 var _WildCard=sl_16
 var _CR=cs_18
 var _LF=cs_19
 function cs_0(){var c,x;if(pos==l)return false;c=g(pos);x=c<67?c<66?0:1:c<98?0:c<99?1:0;if(x){pos++;return true}return false}
 function cs_1(){var c,x;if(pos==l)return false;c=g(pos);x=c<80?c<79?0:1:c<111?0:c<112?1:0;if(x){pos++;return true}return false}
 function cs_2(){var c,x;if(pos==l)return false;c=g(pos);x=c<89?c<88?0:1:c<120?0:c<121?1:0;if(x){pos++;return true}return false}
 function cs_3(){var c,x;if(pos==l)return false;c=g(pos);x=c<32?0:c<33?1:0;if(x){pos++;return true}return false}
 function cs_4(){var c,x;if(pos==l)return false;c=g(pos);x=c<61?0:c<62?1:0;if(x){pos++;return true}return false}
 function cs_5(){var c,x;if(pos==l)return false;c=g(pos);x=c<92?0:c<93?1:0;if(x){pos++;return true}return false}
 function cs_6(){var c,x;if(pos==l)return false;c=g(pos);x=c<91?0:c<92?1:0;if(x){pos++;return true}return false}
 function cs_7(){var c,x;if(pos==l)return false;c=g(pos);x=c<93?0:c<94?1:0;if(x){pos++;return true}return false}
 function cs_8(){var c,x;if(pos==l)return false;c=g(pos);x=c<40?0:c<41?1:0;if(x){pos++;return true}return false}
 function cs_9(){var c,x;if(pos==l)return false;c=g(pos);x=c<41?0:c<42?1:0;if(x){pos++;return true}return false}
 function cs_10(){var c,x;if(pos==l)return false;c=g(pos);x=c<124?0:c<125?1:0;if(x){pos++;return true}return false}
 function cs_11(){var c,x;if(pos==l)return false;c=g(pos);x=c<33?0:c<40?1:0;if(x){pos++;return true}return false}
 function cs_12(){var c,x;if(pos==l)return false;c=g(pos);x=c<43?0:c<61?1:0;if(x){pos++;return true}return false}
 function cs_13(){var c,x;if(pos==l)return false;c=g(pos);x=c<62?0:c<91?1:0;if(x){pos++;return true}return false}
 function cs_14(){var c,x;if(pos==l)return false;c=g(pos);x=c<94?0:c<124?1:0;if(x){pos++;return true}return false}
 function cs_15(){var c,x;if(pos==l)return false;c=g(pos);x=c<125?0:c<65536?1:0;if(x){pos++;return true}return false}
 function cs_16(){var c,x;if(pos==l)return false;c=g(pos);x=c<49?0:c<58?1:0;if(x){pos++;return true}return false}
 function cs_17(){var c,x;if(pos==l)return false;c=g(pos);x=c<48?0:c<58?1:0;if(x){pos++;return true}return false}
 function cs_18(){var c,x;if(pos==l)return false;c=g(pos);x=c<19?0:c<20?1:0;if(x){pos++;return true}return false}
 function cs_19(){var c,x;if(pos==l)return false;c=g(pos);x=c<10?0:c<11?1:0;if(x){pos++;return true}return false}
 function sl_0(){var p=pos;if(str.charCodeAt(p)==47){pos+=1;return true}return false}
 function sl_1(){var p=pos;if(str.charCodeAt(p++)==110&&str.charCodeAt(p++)==111&&str.charCodeAt(p++)==100&&str.charCodeAt(p)==101){pos+=4;return true}return false}
 function sl_2(){var p=pos;if(str.charCodeAt(p++)==119&&str.charCodeAt(p++)==97&&str.charCodeAt(p)==121){pos+=3;return true}return false}
 function sl_3(){var p=pos;if(str.charCodeAt(p++)==114&&str.charCodeAt(p++)==101&&str.charCodeAt(p++)==108&&str.charCodeAt(p++)==97&&str.charCodeAt(p++)==116&&str.charCodeAt(p++)==105&&str.charCodeAt(p++)==111&&str.charCodeAt(p)==110){pos+=8;return true}return false}
 function sl_4(){var p=pos;if(str.charCodeAt(p++)==110&&str.charCodeAt(p)==100){pos+=2;return true}return false}
 function sl_5(){var p=pos;if(str.charCodeAt(p++)==110&&str.charCodeAt(p++)==111&&str.charCodeAt(p++)==116&&str.charCodeAt(p++)==40&&str.charCodeAt(p++)==110&&str.charCodeAt(p++)==100&&str.charCodeAt(p)==41){pos+=7;return true}return false}
 function sl_6(){var p=pos;if(str.charCodeAt(p++)==116&&str.charCodeAt(p++)==97&&str.charCodeAt(p)==103){pos+=3;return true}return false}
 function sl_7(){var p=pos;if(str.charCodeAt(p++)==110&&str.charCodeAt(p++)==111&&str.charCodeAt(p++)==116&&str.charCodeAt(p++)==40&&str.charCodeAt(p++)==116&&str.charCodeAt(p++)==97&&str.charCodeAt(p++)==103&&str.charCodeAt(p)==41){pos+=8;return true}return false}
 function sl_8(){var p=pos;if(str.charCodeAt(p++)==110&&str.charCodeAt(p++)==111&&str.charCodeAt(p++)==116&&str.charCodeAt(p++)==40&&str.charCodeAt(p++)==119&&str.charCodeAt(p++)==97&&str.charCodeAt(p++)==121&&str.charCodeAt(p)==41){pos+=8;return true}return false}
 function sl_9(){var x=str.slice(pos,pos+9);if(x=="not(node)"){pos+=9;return true}return false}
 function sl_10(){var x=str.slice(pos,pos+13);if(x=="not(relation)"){pos+=13;return true}return false}
 function sl_11(){var p=pos;if(str.charCodeAt(p)==48){pos+=1;return true}return false}
 function sl_12(){var p=pos;if(str.charCodeAt(p)==46){pos+=1;return true}return false}
 function sl_13(){var p=pos;if(str.charCodeAt(p)==43){pos+=1;return true}return false}
 function sl_14(){var p=pos;if(str.charCodeAt(p)==45){pos+=1;return true}return false}
 function sl_15(){var p=pos;if(str.charCodeAt(p)==44){pos+=1;return true}return false}
 function sl_16(){var p=pos;if(str.charCodeAt(p)==42){pos+=1;return true}return false}
 function fin(c,p,x,r,a){if(r)a.push([p,x]);tbl[p][x]=r?[true,pos,c]:false;return r}
 function e(){return true}
 function o(){var args=arguments;return function(c){var i,l;for(i=0,l=args.length;i<l;i++)if(args[i](c))return true;return false}}
 function q(){var args=arguments;return function(c){var i,l,cp=pos,cl=c.length;for(i=0,l=args.length;i<l;i++)if(!args[i](c)){pos=cp;t(c,cl);return false}return true}}
 function r(m,n,f){return function(c){var i=0,cp=pos,cl=c.length;while(i<m){i++;if(!f(c)){pos=cp;t(c,cl);return false}}cl=c.length;while(i++<n||n==0)if(!f(c))return true;return true}}
 function n(f){return function(){var p=pos,x=f([]);pos=p;return !x}}
 function p(f){return function(){var p=pos,x=f([]);pos=p;return x}}
 function t(a,n){if(a.length>n)a.splice(n)}
 function g(p){return str.charCodeAt(p)}
 function b(p,n){var x=tbl[p][n],c=[],a=[n,x[1]-p,c],y=x[2],i=0,l=y.length,z;for(;i<l;i++){z=y[i];if(z[0]>p)c.push([-1,z[0]-p]);c.push(b(z[0],z[1]));p=tbl[z[0]][z[1]][1]}if(p<x[1]&&c.count)c.push([-1,x[1]-p]);return a}
 return Expr([])&&pos==l?[true,b(0,0)]:[false,pos,tbl]}
Expr.names=['Expr','Path','Type','XPath','Bbox','Tag','Child','BboxPredicate','Left','Bottom','Right','Top','Coordinate','TagPredicate','Keys','Key','Vals','Val','Chars','SpecialChar','Special','Space','Equals','Escape','LeftBracket','RightBracket','LeftParent','RightParent','Backslash','Pipe','Char','ChildPredicate','Integer','Double','Sign','Empty','Dot','Komma','WildCard','CR','LF'];
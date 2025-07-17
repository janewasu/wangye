var dt = "";
var tt = "";			
var k = 0;			
document.addEventListener('DOMContentLoaded', function () {
    var day = new Date();				
    mymonth = day.getMonth()+1;
    myday = day.getDate();
    if(mymonth >= 10){mymonth = mymonth;}else{mymonth = "0" + mymonth;}
    if(myday >= 10){myday = myday;}else{myday = "0" + myday;}
    tt = day.getFullYear() + "-" + mymonth + "-" + myday;
    dt = tt;				
    getSourceSskp(2,2);
});	
            
function time_range(beginTime, endTime) {
    var strb = beginTime.split(":");
    if (strb.length != 2) {
        return false;
    }

    var stre = endTime.split(":");
    if (stre.length != 2) {
        return false;
    }

    var b = new Date();
    var e = new Date();
    var n = new Date();

    b.setHours(strb[0]);
    b.setMinutes(strb[1]);
    e.setHours(stre[0]);
    e.setMinutes(stre[1]);

    if (n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0) {					
        getSourceSskp(fs , g);
        changeCss(objt,"sskpgg");
        return true;				
    } else {
        return false;     
    }
}
jq(function() {
    setInterval(function() {
    time_range("9:00","15:15")						
    },
    60000);
})

Date.prototype.Format = function (fmt) {
    var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

function keepTwoDecimal(num) {  
    var result = parseFloat(num);  
    if (isNaN(result)) {  
        //alert('传递参数错误，请检查！');  
        return false;  
    }  
    result = Math.round(num * 100) / 100;  
    return result;  
};

function NumberTransform(num) { 
    var result = num;
    if(Math.abs(num) > 100000000){
    result = num / 100000000;
    result = result.toFixed(2) + "亿";
    }else if(Math.abs(num) > 10000){
    result = num/10000;
    result = result.toFixed(0) + "万";
    }				   
    return result;  
};

var xt = 1; //涨停原因相同行高亮（1:true; 0:false;）
var trid = "";
var trs = "";
var objt = "";
function changeCss(obj,id){	
    if(obj){
        trs = "";
        objt = obj;
        var t = obj.parentNode.parentNode.id;  //td父节点tr id
        var ty = t.split("#")[1];
        var ty1 = "";
        var ty2 = "";
        if(ty.indexOf("、") > -1){
            ty1 = ty.split("、")[0];
            ty2 = ty.split("、")[1];
        }
        
        var tlist = document.getElementById(id).getElementsByTagName("tr");					
        for(var i = 0; i < tlist.length; i++){
            if(tlist[i].id != ""){
                var dm = tlist[i].id.split("#")[0];
                var yy = tlist[i].id.split("#")[1];
                if(xt == 1){   //涨停原因相同行高亮
                    if(t == tlist[i].id){
                        tlist[i].style.backgroundColor = "#483D8B";  //选中行
                        trid = t;
                    }else if(ty.indexOf("、") > -1){
                        if(yy.indexOf(ty1) > -1 || yy.indexOf(ty2) > -1){
                            tlist[i].style.backgroundColor = "#800080"; //相同涨停原因
                            trs += tlist[i].id;
                        }else{
                            tlist[i].removeAttribute('style');				
                        }	
                    }else{
                        if(yy.indexOf(ty) > -1){
                            tlist[i].style.backgroundColor = "#800080"; //相同涨停原因
                            trs += tlist[i].id;
                        }else{
                            tlist[i].removeAttribute('style');				
                        }	
                    }	
                }else{
                    if(t == tlist[i].id){
                        tlist[i].style.backgroundColor = "#483D8B";  //选中行
                        trid = t;
                    }else{
                        tlist[i].removeAttribute('style');				
                    }	
                }							
            }					
        }				
    }
}			

var fs = "";					
function getSourceSskp(p , q) {	//q:列
    g = q;
    if(fs != p){  //换类别默认高亮列					
        g = (p == 2) ? 2 : 4;
        objt = "";
    }				
    fs = p;					
    div = document.getElementById('towrite_sskp');				
    var p1 = "<a href='javascript:void(0)' id='px1' onclick='getSourceSskp(" + "1" + "," + g + ")'>" + "主力资金" + "</a>";	
    var p2 = "<a href='javascript:void(0)' id='px2' onclick='getSourceSskp(" + "2" + "," + g + ")'>" + "异动" + "</a>";	
    var p3 = "<a href='javascript:void(0)' id='px3' onclick='getSourceSskp(" + "3" + "," + g + ")'>" + "对倒" + "</a>";
    div.innerHTML = '<h2 class="cl">实时看盘（ ' + p1 + p2 + p3 + '）<span class="y">点击行，查看涨停原因相同的股，行高亮。</span></h2>';					
    
    aObj = document.getElementById('px' + p);				
    aObj.style.color = "rgb(255, 102, 51)";
    aObj.style.borderBottom = "3px solid";
    var px = "1";
    var type = "";
    if(p == 1){				
        px = "9";
        if(g == 4){
            px = (po%2 == 0) ? "9" : "8";
        }else if(g == 3){
            px = (po%2 == 0) ? "4" : "5";
        }else if(g == 2){
            px = (po%2 == 0) ? "2" : "3";
        }
        type = "1";
    }else if(p == 2){
        px = "1";
        if(g == 5){
            px = (po%2 == 0) ? "8" : "9";
        }else if(g == 4){
            px = (po%2 == 0) ? "4" : "5";
        }else if(g == 3){
            px = (po%2 == 0) ? "3" : "2";
        }else if(g == 2){
            px = (po%2 == 0) ? "1" : "0";
        }
        type = "4";
    }else if(p == 3){
        px = "1";
        if(g == 5){
            px = (po%2 == 0) ? "8" : "9";
        }else if(g == 4){
            px = (po%2 == 0) ? "0" : "1";
        }else if(g == 3){
            px = (po%2 == 0) ? "4" : "5";
        }else if(g == 2){
            px = (po%2 == 0) ? "3" : "2";
        }
        type = "3";
    }else if(p == 4){
        px = "1";
        if(g == 5){
            px = (po%2 == 0) ? "8" : "9";
        }else if(g == 4){
            px = (po%2 == 0) ? "0" : "1";
        }else if(g == 3){
            px = (po%2 == 0) ? "4" : "5";
        }else if(g == 2){
            px = (po%2 == 0) ? "3" : "2";
        }
        type = "6";
    }else if(p == 5){
        px = "1";
        if(g == 5){
            px = (po%2 == 0) ? "8" : "9";
        }else if(g == 4){
            px = (po%2 == 0) ? "0" : "1";
        }else if(g == 3){
            px = (po%2 == 0) ? "4" : "5";
        }else if(g == 2){
            px = (po%2 == 0) ? "3" : "2";
        }
        type = "5";
    }				
    var url1 = "https://apphq.longhuvip.com/w1/api/index.php?Order=" + px + "&st=100&a=KanPanNew&c=YiDongKanPan&apiv=w29&Type=" + type;
    var url2 = "https://apphis.longhuvip.com/w1/api/index.php?Order=" + px + "&st=100&a=KanPanNew&c=YiDongKanPan&apiv=w29&Type=" + type + "&Date=" + tt;
    
    var url = url1;
    if(k == "1" ){
        url = url2;
    }
    var res = [];
    jq.ajax({
        type: "get",
        url: url,
        dataType: "json",
        async : false,
        cache:false,
        timeout:3000,					
        success: function(data) {
            writeSourceSskp(data);							
        }
    });				
}
                
function writeSourceSskp(data) { 
    res = [];
    if(data.List.length > 0){
        if(fs == 1){
            for (var i = 0; i < data.List.length; i++){
                var aa = data.List[i];
                res.push({"stock_code":aa["stock_code"],"stock_name":aa["stock_name"],"jiage":aa["jiage"],
                    "zhangfu":aa["zhangfu"],"ZJJE":NumberTransform(aa["ZJJE"]),"gang":aa["gang"],"plate":aa["plate"]
                });							
            }						
        }else if(fs == 2){							
            for (var i = 0; i < data.List.length; i++){
                var aa = data.List[i];
                res.push({"stock_code":aa["stock_code"],"stock_name":aa["stock_name"],"index":aa["index"],"jiage":aa["jiage"],
                    "zhangfu":aa["zhangfu"],"ZJJE":NumberTransform(aa["ZJJE"]),"gang":aa["gang"],"plate":aa["plate"]
                });							
            }							
        }else if(fs == 3 || fs == 4 || fs == 5){
            for (var i = 0; i < data.List.length; i++){
                var aa = data.List[i];
                res.push({"stock_code":aa["stock_code"],"stock_name":aa["stock_name"],"jiage":aa["jiage"],"zhangfu":aa["zhangfu"],
                "Money":NumberTransform(aa["Money"]),"ZJJE":NumberTransform(aa["ZJJE"]),"gang":aa["gang"],"plate":aa["plate"]
                });							
            }		
        }
    
        var h = 0;
        for (var i = 0; i < data.List.length; i++){
            var aa = data.List[i]["new"];
            if(aa == 1){
                h++;
            }							
        }		
        
        //var json = JSON.parse(data);
        var json = res;
        
        //创建table					
        var table=document.createElement("table");										
        var thead=document.createElement("thead");
        table.appendChild(thead);					
        var tr=document.createElement("tr");
        thead.appendChild(tr);					
        
        var m = 0;
        //var n = 0;
        var b = 0;					
        for(var key in json[0]){  //表头
            key = key.replace('stock_code','代码').replace('stock_name','名称').replace('zhangfu','涨幅%').replace('jiage','现价');
            key = key.replace('ZJJE','主力净额').replace('gang','主力').replace('plate','板块').replace('index','异动次数');
            if(fs == 3){
                key = key.replace('Money','对倒金额');
            }else if(fs == 4){
                key = key.replace('Money','压单金额');
            }else if(fs == 5){
                key = key.replace('Money','托单金额');
            }
            var th=document.createElement("th");						
            th.innerHTML=key;						
            tr.appendChild(th);
            if(g == m){	
                th.style.color = "#FF6633";	
            }	
            if(key == "板块"){
                b = m;
                th.style.color = "#FFA500";	
            }
            m++;
        }
                            
        var tbody=document.createElement("tbody");					
        table.appendChild(tbody);
        
        //遍历json
        for(var i = 0; i < json.length; i++){					
            var tr=document.createElement("tr");						
            var p = 1;
            var dm = "";
            var mc = "";
            for(var key in json[i]){ //行元素遍历						
                var td=document.createElement("td");							
                
                var rc = json[i][key];
                if(p == 1){  //代码列
                    dm = rc;
                    tr.id = dm;
                }else if(p == b + 1){
                    zt = rc;
                    tr.id = dm + "#" + zt;
                }						
                td.innerHTML = "<a id='" + p + "' onclick='changeCss(this,\"sskpgg\")'>" + rc + "</a>";

                if(i < h){							
                    td.getElementsByTagName("a")[0].style.color = "#FFB6C1";
                }
                
                if(p == g + 1){							
                    td.getElementsByTagName("a")[0].style.color = "#FF6633";
                }
                if(p == b + 1){							
                    td.getElementsByTagName("a")[0].style.color = "#FFA500";
                }																
                tr.appendChild(td);							
                p++;
            }														
            tbody.appendChild(tr);																
        }																	
        div.appendChild(table);
        table.id = "sskpgg";	
    }else{
        div.innerHTML += "暂无数据";
    }
    
    var table=document.getElementById('towrite_sskp').getElementsByTagName("table")[0];
    makeSortableSskp(table);
}
            
var po = 0;	
var	c = "";	
var g = 0;			
function makeSortableSskp(table) {
    var headers=table.getElementsByTagName("th");
    for(var i = 0; i < headers.length; i++){				
        (function(n){											
            headers[n].onclick = function(){
                if(n > 1 && n < 6){
                    if(n != c){  //换列初始化正排序
                        po = 0;
                        c = n;
                    }
                    po++;
                    g = n;	
                    //alert(n)
                    getSourceSskp(fs , g);
                }							
            }
        }(i));
    }
}

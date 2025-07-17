document.addEventListener('DOMContentLoaded', function () {
    getSource(1);
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
        getSource(q);						
        console.log(true)
        return true;				
    } else {
        console.log(false)
        return false;     
    }
}
document.addEventListener('DOMContentLoaded', function () {
    setInterval(function() {
        time_range("9:00","15:15")						
    },
    60000);
});		
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

function getLocalTime(nS) {			          
return new Date(parseInt(nS) * 1000).Format("hh:mm:ss")}						
var bj = [];
var q = 1;
function getSource(ss) {
    q = ss;
    div = document.getElementById('towrite');								
    var	hs = "<a href='javascript:void(0)'  id='bt1' onclick='getSource(1)'>沪深A股</a>";
    var	cy = "<a href='javascript:void(0)'  id='bt2' onclick='getSource(2)'>创业板</a>";				
    div.innerHTML = "<h2><strong>主力排名</strong>（" + hs + cy + "）</h2>";	
    aObj = document.getElementById('bt' + ss);				
    aObj.style.color = "#fff";	
    var url1 = "https://push2.eastmoney.com/api/qt/clist/get?cb=jQuery112308980107330704572_1632445353427&fid=f184&po=1&pz=100&pn=1&np=1&fltt=2&invt=2&fields=f2,f3,f12,f14,f100,f184,f225&ut=b2884a393a59ad64002292a3e90d46a5&fs=m:0+t:6+f:!2,m:0+t:13+f:!2,m:0+t:80+f:!2,m:1+t:2+f:!2,m:1+t:23+f:!2"; 	                							
    var url2 = "https://push2.eastmoney.com/api/qt/clist/get?cb=jQuery1123009706366557087875_1632575677122&fid=f184&po=1&pz=50&pn=1&np=1&fltt=2&invt=2&fields=f2,f3,f12,f14,f100,f184,f225&ut=b2884a393a59ad64002292a3e90d46a5&fs=m:0+t:80+f:!2"; 	                							
    var url = url1;
    if(ss == 2){
        url = url2;
    }
    var res = [];
    jq.ajax({
        type: "get",
        url: url,
        dataType: "text",
        async : false,
        cache:false,
        timeout:3000,					
        success: function(data) {
            //document.write(data);
            var ss = data.replace(/ /g,"")
            ss = ss.match(/,"diff":(\S*)\}\}\);/)[1];
            var arr =  JSON.parse(ss);	
            //alert(JSON.stringify(arr))
            for (var i = 0; i < arr.length; i++){
                var rc = {"代码":arr[i]["f12"],"名称":arr[i]["f14"],"排名":arr[i]["f225"],"现价":arr[i]["f2"],"涨幅%":arr[i]["f3"],"主力净占比%":arr[i]["f184"],"板块":arr[i]["f100"]};
                res.push(rc);
            }						
        }
    });

    var json = res;
    //创建table					
    var table=document.createElement("table");										
    var thead=document.createElement("thead");
    table.appendChild(thead);					
    var tr=document.createElement("tr");
    thead.appendChild(tr);					
    
    var m = 0;
    var n = 2;
    var b = 0;
    var gl = "排名";  //高亮
    bj = [];
    for(var key in json[0]){  //表头
        key = key.replace('f225','排名').replace('f12','代码').replace('f14','名称').replace('f3','涨幅%').replace('f2','现价');
        key = key.replace('f184','主力净占比%').replace('f100','板块');					
        
        var th=document.createElement("th");						
        th.innerHTML=key;						
        tr.appendChild(th);	
        if(gl == key.replace("%","")){
            //v = m;
            //th.style.color = "#FF6633";	
        }
        if(key == "板块"){
            b = m;
            bj.push(m);
            //th.style.color = "#FFA500";	
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
                // tr.id = dm;
            }					
            td.innerHTML = "<a>" + rc + "</a>";
            
            if(p == n + 1){							
                td.getElementsByTagName("a")[0].style.color = "#FF6633";								
            }
            if(bj.indexOf(p - 1) > -1){	
                td.getElementsByTagName("a")[0].style.color = "#FFA500";								
            }							
            tr.appendChild(td);
            p++;
        }						
        tbody.appendChild(tr);
    }					
    var div = document.getElementById("towrite");									
    div.appendChild(table);
    table.id = "gg";
    
    var table= document.getElementById("gg"); /* document.getElementsByTagName("table")[0];*/
    makeSortable(table);
}

function makeSortable(table) {
    var headers=table.getElementsByTagName("th");
    for(var i=0;i<headers.length;i++){				
        (function(n){
            var flag=false;
                
            headers[n].onclick=function(){
                //alert(n);						
                showCol(n,bj);		//高亮
                var tbody=table.tBodies[0];
                var rows=tbody.getElementsByTagName("tr");
                rows=Array.prototype.slice.call(rows,0);

                //基于第n个<td>元素的值对行排序
                rows.sort(function(row1,row2){
                    headtxt = headers[n].textContent;								
                    var cell1=row1.getElementsByTagName("td")[n];//获得第n个单元格
                    var cell2=row2.getElementsByTagName("td")[n];																
                    var val1=cell1.textContent||cell1.innerText;//获得文本内容
                    var val2=cell2.textContent||cell2.innerText;
                    if(headtxt.indexOf("名称") != -1 || headtxt.indexOf("板块") != -1){
                        val1 = val1;
                        val2 = val2;
                    }else{
                        if(val1 == "-"){
                            val1 = " ";
                        }
                        if(val2 == "-"){
                            val2 = " ";
                        }
                        val1 = val1.replace(" ","0").replace("无","1000").replace("NaN","0");
                        val2 = val2.replace(" ","0").replace("无","1000").replace("NaN","0");
                        if(val1.indexOf("万") != -1){
                            val1 = parseFloat(val1)*10000;
                        }else if(val1.indexOf("亿") != -1){
                            val1 = parseFloat(val1)*100000000;
                        }else{
                            val1 = parseFloat(val1);
                        }
                        
                        if(val2.indexOf("万") != -1){
                            val2 = parseFloat(val2)*10000;
                        }else if(val2.indexOf("亿") != -1){
                            val2 = parseFloat(val2)*100000000;
                        }else{
                            val2 = parseFloat(val2);
                        }
                    }
                    if(val1<val2){
                        return -1;
                    }else if(val1>val2){
                        return 1;
                    }else{
                        return 0;
                    }
                });
                if(flag){
                    rows.reverse();
                }
                
                for(var i=0;i<rows.length;i++){
                    tbody.appendChild(rows[i]);
                }

                flag=!flag;
            }
        }(i));
    }
}

function showCol(iCol,arr){	 //(选中列，标记列)	
    // var oTable = document.getElementsByTagName('table')[0];
    var oTable= document.getElementById("gg");						
    //表头
    var th = oTable.getElementsByTagName("th");						
    for (var i=0;i < th.length; i++){	    //列遍历
        th[i].style.color = "#E5E5E5";      //还原					
        if(arr.length > 0 && arr.indexOf(i) > -1){  //BJ列高亮
            th[i].style.color = "#FFA500";
        }
        th[iCol].style.color = "#FFFF80";	//选中				
    }
    
    var tr = oTable.getElementsByTagName("tr");	
    for (var i=1;i < tr.length; i++){	//行遍历
        var otagsA = tr[i].getElementsByTagName("a");
        for (var j=0;j < otagsA.length; j++){	//列遍历
            otagsA[j].style.color = "#E5E5E5";	//还原																
            if(arr.length > 0 && arr.indexOf(j) > -1){  //BJ列高亮
                otagsA[j].style.color = "#FFA500";
            }
        }
        var value = otagsA[iCol].innerText.replace(/(万)|(亿)/g,'');
        if(!isNaN(parseFloat(value)) && isFinite(value)){  //判断列是否为数字
            if(parseFloat(value) >= 0){
                otagsA[iCol].style.color = "#FF6633";     //正负颜色
            }else{
                otagsA[iCol].style.color = "#00FF00";
            }
        }else{
            otagsA[iCol].style.color = "#FF6633";
        }					
    }					
}	
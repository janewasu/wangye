document.addEventListener('DOMContentLoaded', function () {
    getSourceRedian();
    setInterval(function() {
        time_range_redian("9:00","15:15")						
    },
    60000);
});
                    
function time_range_redian(beginTime, endTime) {
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
        getSourceRedian();					
        console.log(true)
        return true;				
    } else {
        console.log(false)
        return false;     
    }
}

function createXmlHttp() {
    if (window.XMLHttpRequest) {
        xmlHttp1 = new XMLHttpRequest();
        xmlHttp2 = new XMLHttpRequest();
    } else {
        xmlHttp1 = new ActiveXObject("Microsoft.XMLHTTP");
        xmlHttp2 = new ActiveXObject("Microsoft.XMLHTTP");
    }
}

function getSourceRedian() {	    							
    var url1 = "https://flash-api.xuangubao.cn/api/surge_stock/plates"; 
    createXmlHttp();				
    xmlHttp1.onreadystatechange = writeSource;
    xmlHttp1.open("GET", url1, true);
    xmlHttp1.send(null);				
}

function writeSource() { 
    if (xmlHttp1.readyState == 4) {         
        var data1 = xmlHttp1.responseText	
        data1 = data1.replace(/\\"/g,"") //("description":"\"世界粮仓\"巴西遭遇干旱"})
        //document.write(data1);
        var transform_aa1 = [           
        {"tag":"div", children:function(){return(json2html.transform(this.data, transform_bb1));}}
        ];
        var transform_bb1 = [           
        {"tag":"ul", children:function(){return(json2html.transform(this.items, transform_cc1));}}
        ];
        var transform_cc1= 
        {"tag":"li", children:[
        {"tag": "p", "html":"<a href='javascript:void(0);' onclick='update(\"${id}\"+\"#\"+\"${name}&nbsp;&nbsp;${description}\");'>${name}</a>"}, 											
        ]};  
        
        var html1 = json2html.transform(data1, transform_aa1);		
        div1 = document.getElementById('towrite1');
        div1.innerHTML =  html1;	
        jq("#towrite1 a:first").click();				
    }
}

var dm = "";
function update(ss) {
    //alert(ss);
    var dms=ss.split('#');
    dm = dms[0];
    bk = dms[1];
    
    div2 = document.getElementById('towrite2');				
    div2.innerHTML = '<h3>' + bk + '</h3>';				
    var url2 = "https://flash-api.xuangubao.cn/api/surge_stock/stocks?normal=true&uplimit=true"; 								
    createXmlHttp();
    xmlHttp2.onreadystatechange = writeSource2;				
    xmlHttp2.open("GET", url2, true);
    xmlHttp2.send(null);				
}

function keepTwoDecimal(num) {  
    var result = parseFloat(num);  
    if (isNaN(result)) {  
        //alert('传递参数错误，请检查！');  
        return false;  
    }  
    result = Math.round(num * 100) / 100;  
    return result;  
}

function writeSource2() { 			
    if (xmlHttp2.readyState == 4) {                  	
        var data2 = xmlHttp2.responseText
        //document.write(data2);
        data2 = data2.replace(/ /g,"").replace(/(.SZ)|(.SS)/g,"");						
        data2 = data2.replace(/(\[\[).*?(?=\],\[)/g,
        function(word){ 
            str = word.match(/\[\[(\S*)/)[1];
            if(str.indexOf('\"' + 'id' + '\"' + ':' + dm) > -1)
            {
                <!-- ss = '"List":[{"id"' + str.match(/\[\{\"id\"(\S*)\}\]/)[1] + '}],';                      			 -->
                <!-- return '[{' + ss + '"code":' + str.split(',')[0] + ',"prod_name":' + str.split(',')[1] + ',"xq":' + str.split(',')[5]; -->
                ss = str.replace(/\[\{.*?\}\]/,"");
                return '[{' + '"code":' + ss.split(',')[0] + ',"prod_name":' + ss.split(',')[1] + ',"zf":' + ss.split(',')[3] + ',"xq":' + '"' + ss.split(',"')[2].match(/(\S*)\",/)[1] + '"' + ',"lb":' + '"' + ss.split(',"')[3].match(/(\S*)\",/)[1] + '"';
            }
            else
            {
                return "";
            }
        });
        
        data2 = data2.replace(/(\],\[).*?((?=\],\[)|(?=\]\]))/g,
        function(word){ 
            str = word.match(/\[(\S*)/)[1];
            if(str.indexOf('\"' + 'id' + '\"' + ':' + dm) > -1)
            {
                <!-- ss = '"List":[{"id"' + str.match(/\[\{\"id\"(\S*)\}\]/)[1] + '}],';					 -->
                <!-- return '},{' + ss + '"code":' + str.split(',')[0] + ',"prod_name":' + str.split(',')[1] + ',"xq":' + str.split(',')[5]; -->
                ss = str.replace(/\[\{.*?\}\]/,"");
                
                return '},{' + '"code":' + ss.split(',')[0] + ',"prod_name":' + ss.split(',')[1] + ',"zf":' + ss.split(',')[3] + ',"xq":' + '"' + ss.split(',"')[2].match(/(\S*)\",/)[1] + '"' + ',"lb":' + '"' + ss.split(',"')[3].match(/(\S*)\",/)[1] + '"';					
            }
            else
            {
                return "";
            }
        });
        data2 = data2.replace(/\]\]\}\}/g,"}]}}").replace(/:\},/g,":[");
        
        //涨幅				
        data2 = data2.replace(/(\"zf\":).*?(?=,)/g, function(word){ 				
            str = word.match(/\"zf\":(\S*)/)[1]; 					
            return '\"zf\":"' + keepTwoDecimal(str*100) + '"';
        });  							
        //document.write(data2);
        
        var transform_aa2 = [           
        {"tag":"div", children:function(){return(json2html.transform(this.data, transform_bb2));}}
        ];
        
        var transform_bb2 = [           
        {"tag":"ul", children:function(){return(json2html.transform(this.items, transform_cc2));}}
        ];
        
        var transform_cc2 = [
        {"tag":"li", children:[				
        {"tag": "p", "html":"<a>${code} ${prod_name}&nbsp;&nbsp;涨幅：${zf}% &nbsp;&nbsp;${lb}</a>"}, 					
        {"tag": "p", "html":"${xq}"},				
        ]}];
        
        var html2 = json2html.transform(data2, transform_aa2);		
        div2 = document.getElementById('towrite2');
        div2.innerHTML = div2.innerHTML + html2;							
    }
}
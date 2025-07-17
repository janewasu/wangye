document.addEventListener('DOMContentLoaded', function () {
    getSourceRb(1);
    setInterval(function() {
        time_range_rb("9:00","15:15")						
    },
    60000);
});	
function time_range_rb(beginTime, endTime) {
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
        getSourceRb(1);
        temp = "";					
        console.log(true)
        return true;				
    } else {
        console.log(false)
        return false;     
    }
}
function keepTwoDecimal(num) {  
       var result = parseFloat(num);  
       if (isNaN(result)) {  					  
           return false;  
       }  
       result = Math.round(num * 100) / 100;  
       return result;  
}
function getSourceRb(s) {								
    var div = document.getElementById('towrite_rb');
    var url = "https://eq.10jqka.com.cn/open/api/hot_list/v1/hot_stock/a/hour/data.txt";
    var res = [];			
    jq.ajax({
        type: "get",
        url: url,
        dataType: "json",
        async : false,
        cache:false,
        timeout:3000,					
        success: function(data) {
            //alert(JSON.stringify(data))						
            //document.write(JSON.stringify(data));							
            
            for (var i = 0; i < data.data.stock_list.length; i++){
                var aa = data.data.stock_list[i];
                var code = aa["code"];
                var name = aa["name"];
                var lb = "";
                if(aa["tag"]["popularity_tag"]){
                    lb = aa["tag"]["popularity_tag"];	
                }
                var ztyy = "";
                var xq = "";
                if(aa["analyse"]){							
                    ztyy = aa["analyse_title"];
                    xq = aa["analyse"];
                    xq = xq.replace(/\\n/g, "<br>").replace(/\\"/g, '"');
                    xq = '<p>' + ztyy + '</p><p>' + xq + '</p>';
                }
                var gn = "";
                if(aa["tag"]["concept_tag"]){
                    gn = JSON.stringify(aa["tag"]["concept_tag"]);
                    gn = gn.replace(/,/g,'，').replace(/(")|(\[)|(\])/g,"");
                }
                var pm = aa["order"];	
                var jd = "<span>" + pm + "</span>" + code + "&nbsp;" + name + "&nbsp;&nbsp;&nbsp;<font color=#FFA000>" + lb + "</font>&nbsp;&nbsp;&nbsp;" + gn;						
            
                if(xq != ""){
                    var jx = "<a href='javascript:void(0)' id='xq' onclick='updates(" + "\"" + code + "\"" + ")' style='color:yellow'>" + "详情" + "</a>";							
                    div.innerHTML += '<div class="li">' + jd + "&nbsp;&nbsp;" + jx + "</div>";
                    //添加分类Div
                    var newDiv1 = document.createElement("div");
                    newDiv1.id = code;
                    newDiv1.style.display = "none";
                    document.getElementById("towrite_rb").appendChild(newDiv1);
                    div1 = document.getElementById(code);
                    div1.innerHTML += xq ;							
                    
                }else{
                    div.innerHTML += '<div class="li">' + jd + "</div>";
                }							
            }											
        }
    });						
}
var temp = "";			
function updates(ss) {				
    if(document.getElementById(ss)){					
        div1 = document.getElementById(ss);
        if(temp.indexOf(ss) == -1){
            temp += ss + ";";
            div1.style.display = "block";
            div1.style.padding = "0 10px 10px 40px";
            div1.style.color = "#FFFACD";
        }else{
            temp = temp.replace(ss + ";" , "");
            div1.style.display = "none";
        }
    }								
}
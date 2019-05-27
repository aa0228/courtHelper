'use strict'

const ipc = require('electron').ipcRenderer;

var localUrl='http://130.1.67.23:8088';

let i1=0;
let i2=0;
let i3=0;
let i4=0;
ipc.on('setTxData', function (event, message) {
    console.log(message);
    let user = message;
    $("#yhdm").val(user.yhdm);
    $("#fydm").val(user.fydm);
});
function getRealTimeTask() {
    var date=new Date();
    var year=date.getFullYear();
    var month=date.getMonth()+1;
    var day=date.getDate();
    var hour=date.getHours();
    var minute=date.getMinutes();
    var second=date.getSeconds();
    var weeks=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"]
    var week=weeks[date.getDay()];
    if(month<10){

        month="0"+month;
    }
    if(day<10){
        day="0"+day;
    }
    if(hour<10){
        hour="0"+hour;
    }
    if(minute<10){
        minute="0"+minute;
    }
    if(second<10){
        second="0"+second;
    }
    if(($("#yhdm").val()=="")||($("#yhdm").val()==null)){
      setTimeout('getRealTimeTask()',1000);
    }else{
        getLctx();
        // getSxtx();
        // getKxtx();
        // getSwZZ();
        // getBWL();
    }
}

function getLctx(){
    var yhdm = $("#yhdm").val();
    var fydm = $("#fydm").val();
    $.ajax({
    type: "POST",
    dataType: "json",
    url:encodeURI(localUrl+'/sptx'),
    data: { fydm: fydm, yhdm: yhdm},
    error: function () {
       console.log("案件审批查询错误！");
   },
    success: function (successData) {
        //$("#ajtx").css("display","block");
        // console.info(successData);
        i1=successData.length;
        console.log(i1);
        var htmlStr="";
            for(var i=0;i<successData.length;i++){
                var s=i+parseInt(1);
                var htmlString="<li>"+s+".【"+successData[i].txlb+"】 "+successData[i].ah+"</li>"
                htmlStr+=htmlString;
            }
            document.getElementById("ajtx").innerHTML=htmlStr;
            if(htmlStr!=""){
                $('#ajtx').css('display','block');
                var obj=document.getElementById("ajtx").getElementsByTagName("li");
                for(var i=0;i<obj.length;i++){
                    obj[i].onclick=function(event){
                        ipc.send('open-main-windows');
                    }
                }
            }else{
                $('#ajtx').css('display','none');
            }
            getSxtx();
         }
      });
   }

 function getSxtx(){
    var yhdm = $("#yhdm").val();
    var fydm = $("#fydm").val();
    $.ajax({
    type: "POST",
    dataType: "json",
    url:encodeURI(localUrl+'/sxtx'),
    data: { fydm: fydm, yhdm: yhdm},
    error: function () {
       console.log("案件审限查询错误！");
   },
    success: function (successData) {
        // console.info(successData);
        i2=successData.length;
        console.log(i2);
            var htmlStr="";
            for(var i=0;i<successData.length;i++){
                var s=parseInt(i1)+i+parseInt(1);
                var htmlString="<li>"+s+".【案号】"+successData[i].anhao+","+successData[i].csxtsTitle+"</div></li>"
                htmlStr+=htmlString;
            }
            document.getElementById("sxtx").innerHTML=htmlStr;
            if(htmlStr!=""){
                $('#sxtx').css('display','block');
                var obj=document.getElementById("sxtx").getElementsByTagName("li");
                for(var i=0;i<obj.length;i++){
                    obj[i].onclick=function(event){
                        ipc.send('open-main-windows');
                    }
                }
            }else{
                $('#sxtx').css('display','none');
            }
            getKxtx();
         }
      });
   }
 function getKxtx(){
    var yhdm = $("#yhdm").val();
    var fydm = $("#fydm").val();
    $.ajax({
    type: "POST",
    dataType: "json",
    url:encodeURI(localUrl+'/Kttx'),
    data: { fydm: fydm, yhdm: yhdm},
    error: function () {
       console.log("案件开庭查询错误！");
   },
    success: function (successData) {
        i3=successData.length;
        console.log(i3);
        //$("#ajtx").css("display","block");
       // console.info(successData);
            var htmlStr="";
            for(var i=0;i<successData.length;i++){
                var s=parseInt(i1)+parseInt(i2)+i+parseInt(1);
                var htmlString="<li>"+s+".【"+successData[i].bwsj+"】 "+successData[i].ah+"</li>"
                htmlStr+=htmlString;
            }
            document.getElementById("kxtx").innerHTML=htmlStr;
            $('#kxtx').css('display','block');
            if(htmlStr!=""){
                $('#kxtx').css('display','block');
                var obj=document.getElementById("kxtx").getElementsByTagName("li");
                for(var i=0;i<obj.length;i++){
                    obj[i].onclick=function(event){
                        ipc.send('open-main-windows');
                    }
                }
            }else{
                $('#kxtx').css('display','none');
            }
            getSwZZ();
         }
      });
   }
  //得到事务的自增提醒 
 function getSwZZ(){
     var yhdm = $("#yhdm").val();
     var fydm = $("#fydm").val();
     $.ajax({
     type: "POST",
     dataType: "json",
     url:encodeURI(localUrl+'/searchSW'),
     data: { fydm: fydm, yhdm: yhdm},
     error: function () {
        console.log("事务提醒查询错误！");
     },
     success: function (successData) {
         //$("#ajtx").css("display","block");
        // console.info(successData);
        i4=successData.length;
        console.log(i4);
        var htmlStr="";
        for(var i=0;i<successData.length;i++){
            var s=parseInt(i1)+parseInt(i2)+parseInt(i3)+i+parseInt(1);
                 var htmlString="<li>"+s+".【"+successData[i].txlb+"】 "+successData[i].qssj.substring(8,10)+"日"+
                 successData[i].qssj.substring(11,13)+"时"+successData[i].qssj.substring(14,16)+"分</li>"
                 htmlStr+=htmlString;
             }
             document.getElementById("zzswtx").innerHTML=htmlStr;
             if(htmlStr!=""){
                $('#zzswtx').css('display','block');
                var obj=document.getElementById("zzswtx").getElementsByTagName("li");
                for(var i=0;i<obj.length;i++){
                    obj[i].onclick=function(event){
                        ipc.send('open-main-windows');
                    }
                }
            }else{
                $('#zzswtx').css('display','none');
            }
            getBWL();
          }
       });
  }

  function getBWL(){
    var yhdm = $("#yhdm").val();
    var fydm = $("#fydm").val();
    $.ajax({
    type: "POST",
    dataType: "json",
    url:encodeURI(localUrl+'/Qttx'),
    data: { fydm: fydm, yhdm: yhdm},
    error: function () {
       console.log("备忘录提醒查询错误！");
    },
    success: function (successData) {
        //$("#ajtx").css("display","block");
        // console.info(successData);
       var htmlStr="";
       for(var i=0;i<successData.length;i++){
            var s=parseInt(i1)+parseInt(i2)+parseInt(i3)+parseInt(i4)+i+parseInt(1);
            var htmlString="<li>"+s+".【"+successData[i].bwsj+"】: "+successData[i].bwrq+"</li>";
            htmlStr+=htmlString;
        }
        document.getElementById("bwlswtx").innerHTML=htmlStr;
        if(htmlStr!=""){
            $('#bwlswtx').css('display','block');
            var obj=document.getElementById("bwlswtx").getElementsByTagName("li");
            for(var i=0;i<obj.length;i++){
                obj[i].onclick=function(event){
                    ipc.send('open-main-windows');
                }
            }
        }else{
            $('#bwlswtx').css('display','none');
        }
        }
      });
}
$(".sys-control-box .sys-btn-closed").click(function () {
    ipc.send('close-tx-window');
});
$(".sys-control-box .sys-btn-minis").click(function (){
    ipc.send('hide-tx-window');
});
'use strict'

const ipc = require('electron').ipcRenderer;
const url = require('url');
const path = require('path');
const fs = require("fs");
const newFile_path = path.join(__dirname, 'data/user.json').replace(/\\/g, "\/");


var localUrl='http://130.1.67.23:8088';
var getTxs="08:30:00";
var userData=null;
var sxtx=0;
var sxtxvalue=new Array();
var ysxtxvalue=new Array();
var urls=new Array(5);
urls[0]="/sxtxCsx";
urls[1]="/sxtxOne";
urls[2]="/sxtxThree";
urls[3]="/sxtxSeven";
urls[4]="/sxtxKchf";
//获取个性设置，图片、昵称
function getGXSZ(){
var yhdm = $("#yhdm").val();
var fydm = $("#fydm").val();
$.ajax({
     type:"post",
     dataType:"json",
     url:encodeURI(localUrl+'/getPersonInfo'),
     data:{
         fydm:fydm,
         yhdm:yhdm,
     },
     processData : true,//是否序列化
     success:function (res) {
        if (res.result==true) {
            //打开新的窗口
            let userData = res.object;
            if(userData.img!=null&userData.img!=''){
                $('#BigIcon').attr("src","data:image/png;base64,"+userData.img);
            }
            if(userData.nickname!=null&userData.nickname!=''){
                $('#grby').text(userData.nickname);
            }
            if(userData.txsj!=null&userData.txsj!=''){
                getTxs=userData.txsj;
            }
            if(userData.sxtxlb!=null&userData.sxtxlb!=''){
               sxtxvalue=userData.sxtxlb.split(",");
               console.log(sxtxvalue);
               for(var i=0;i<sxtxvalue.length;i++){
                   if(sxtxvalue[i]==0){
                    ysxtxvalue[i]="超审限";
                   }
                   if(sxtxvalue[i]==1){
                    ysxtxvalue[i]="0天审限";
                   }
                   if(sxtxvalue[i]==2){
                    ysxtxvalue[i]="3天审限";
                   }
                   if(sxtxvalue[i]==3){
                    ysxtxvalue[i]="7天审限";
                   }
                   if(sxtxvalue[i]==4){
                    ysxtxvalue[i]="扣除恢复";
                   }
               }
            }else{
            sxtxvalue[0]=0;
            ysxtxvalue[0]="超审限";
            sxtxvalue[1]=1;
            ysxtxvalue[1]="0天审限";
            sxtxvalue[2]=2;
            ysxtxvalue[2]="3天审限";
            sxtxvalue[3]=3;
            ysxtxvalue[3]="7天审限";
            sxtxvalue[4]=4;
            ysxtxvalue[4]="扣除恢复";
            }
        }
        else {
            sxtxvalue[0]=0;
            ysxtxvalue[0]="超审限";
            sxtxvalue[1]=1;
            ysxtxvalue[1]="0天审限";
            sxtxvalue[2]=2;
            ysxtxvalue[2]="3天审限";
            sxtxvalue[3]=3;
            ysxtxvalue[3]="7天审限";
            sxtxvalue[4]=4;
            ysxtxvalue[4]="扣除恢复";
        }
     },
     error : function(jqXHR, textStatus, errorThrown) {
     }
 });

}

//点击最小化按钮
$(".sys-control-box .sys-btn-minis").click(function () {
    ipc.send('mini-user-editor-window');
});
$(".navmenu").mouseover(function(){
    $(this).children("ul").show(); 
});   
$(".navmenu").mouseout(function(){  
    $(this).children("ul").hide();
});
function getLctx(){
    $("#dch").parent("li").show(); 
    $("#sxt").parent("li").hide(); 
    $("#kxt").parent("li").hide(); 
    $("#BWLtx").parent("li").hide();
    $("#swtxzz").parent("li").hide();
   var yhdm = $("#yhdm").val();
   var fydm = $("#fydm").val();
   $.ajax({
   type: "POST",
   dataType: "json",
   url:encodeURI(localUrl+'/sptx'),
   data: { fydm: fydm, yhdm: yhdm},
   error: function () {
      console.log("审批提醒查询错误！");
  },
   success: function (successData) {
       //$("#ajtx").css("display","block");
           var $ul = $("#dch").next('ul');
           if($ul.is(':visible')){
           }else{
           var htmlStr="";
           for(var i=0;i<successData.length;i++){
            var htmlString="<li>【"+successData[i].txlb+"】 "+successData[i].ah+"<div style=\"display:none;width:100%;height:55px;float:left;font-size:13px;color:#607D8B\">*申请日期："+successData[i].sqrq+"</div></li>";
            htmlStr+=htmlString;
           }
           document.getElementById("ajtx").innerHTML=htmlStr;
           $("#splabel").text("审批提醒 ["+successData.length+"]");
           $("#img1").attr("src","imgs/toDown.png");
           $ul.slideDown();
          }
           var obj=document.getElementById("ajtx").getElementsByTagName("li");
           for(var i=0;i<obj.length;i++){
               obj[i].onmouseover=function(event){
                   $(event.target).find('div').css('display','block');
               }
                obj[i].onmouseleave=function(event){
                  $(event.target).find('div').css('display','none');
            }
           }
        }
     });
  }
function getSxtx(){
    $("#sxt").parent("li").show(); 
    $("#dch").parent("li").hide(); 
    $("#kxt").parent("li").hide(); 
    $("#BWLtx").parent("li").hide();
    $("#swtxzz").parent("li").hide();
   var yhdm = $("#yhdm").val();
   var fydm = $("#fydm").val();
   $.ajax({
   type: "POST",
   dataType: "json",
   url:encodeURI(localUrl+'/sxtx'),
   data: { fydm: fydm, yhdm: yhdm},
   error: function () {
      console.log("审限提醒查询错误！");
  },
   success: function (successData) {
       var $ul = $("#sxt").next('ul');
       if($ul.is(':visible')){
        //    $("#sxlabel").text("审限提醒 ["+successData.length+"]");
        //    $("#img2").attr("src","imgs/toUp.png");
        //    $ul.slideUp();
           }else{
               var htmlStr="";
           for(var i=0;i<successData.length;i++){
               var htmlString="<li>【案号】"+successData[i].anhao+"<div style=\"display:none;width:100%;height:85px;float:left;font-size:13px;color:#607D8B\">*法定审限:"+successData[i].fdsxTitle+"&nbsp&nbsp&nbsp&nbsp*延长天数: "+
               successData[i].yctsTitle+"<br/>*已中止天数: "+successData[i].zztsTitle+"&nbsp&nbsp*扣除审限天数："+successData[i].kcsxtsTitle+"<br/>*实际审理天数: "+successData[i].sjsltsTitle+"<br/>*"+successData[i].csxtsTitle+"<br/>*审限到期: "+successData[i].sxdqrq+"</div></li>"
               htmlStr+=htmlString;
           }
           document.getElementById("sxtx").innerHTML=htmlStr;
           $("#sxlabel").text("审限提醒 ["+successData.length+"]");
           $("#img2").attr("src","imgs/toDown.png");
           $ul.slideDown();
           }
           var obj=document.getElementById("sxtx").getElementsByTagName("li");
           for(var i=0;i<obj.length;i++){
               obj[i].onmouseover=function(event){
                   $(event.target).find('div').css('display','block');
               }
                obj[i].onmouseleave=function(event){
                  $(event.target).find('div').css('display','none');
            }
           }
        }
     });
  }
function getKxtx(){
    $("#dch").parent("li").hide(); 
    $("#sxt").parent("li").hide(); 
    $("#kxt").parent("li").show(); 
    $("#BWLtx").parent("li").hide();
    $("#swtxzz").parent("li").hide();
   var yhdm = $("#yhdm").val();
   var fydm = $("#fydm").val();
   $.ajax({
   type: "POST",
   dataType: "json",
   url:encodeURI(localUrl+'/Kttx'),
   data: { fydm: fydm, yhdm: yhdm},
   error: function () {
      console.log("案件提醒查询错误！");
  },
   success: function (successData) {
       //$("#ajtx").css("display","block");
       var $ul = $("#kxt").next('ul');
       if($ul.is(':visible')){
        //    $("#kxlabel").text("开庭提醒 ["+successData.length+"]");
        //    $("#img3").attr("src","imgs/toUp.png");
        //    $ul.slideUp();
           }else{
               var htmlStr="";
           for(var i=0;i<successData.length;i++){
               var htmlString="<li>【"+successData[i].bwsj+"】 "+successData[i].ah+"<div style=\"display:none;width:100%;height:50px;float:left;font-size:13px;color:#607D8B;\">*开庭时间:"+successData[i].rq+"<br/>*实际法庭: "+
               successData[i].sjft+"<br/>*时长: "+successData[i].fz+"分钟</div></li>"
               htmlStr+=htmlString;
           }
           document.getElementById("kxtx").innerHTML=htmlStr;
           $("#kxlabel").text("开庭提醒 ["+successData.length+"]");
           $("#img3").attr("src","imgs/toDown.png");
           $ul.slideDown();
           }
           var obj=document.getElementById("kxtx").getElementsByTagName("li");
           for(var i=0;i<obj.length;i++){
               obj[i].onmouseover=function(event){
                   $(event.target).find('div').css('display','block');
               }
                obj[i].onmouseleave=function(event){
                  $(event.target).find('div').css('display','none');
            }
           }
        }
     });
  }
 //得到事务的自增提醒 
function getSwZZ(){
    $("#dch").parent("li").hide(); 
    $("#sxt").parent("li").hide(); 
    $("#kxt").parent("li").hide(); 
    $("#BWLtx").parent("li").hide();
    $("#swtxzz").parent("li").show();
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
        var $ul = $("#swtxzz").next('ul');
        if($ul.is(':visible')){
            // $("#swzzlabel").text("事务提醒 ["+successData.length+"]");
            // $("#img6").attr("src","imgs/toUp.png");
            // $ul.slideUp();
            }else{
                var htmlStr="";
            for(var i=0;i<successData.length;i++){
                var minutess=DateMinus(successData[i].qssj,successData[i].jssj);
                var htmlString="<li style=\"font-size:15px;\">【"+successData[i].txlb+"】 "+successData[i].qssj.substring(8,10)+"日"+
                successData[i].qssj.substring(11,13)+"时"+successData[i].qssj.substring(14,16)+"分"+"<div style=\"display:none;width:100%;height:55px;float:left;font-size:13px;color:#607D8B;\">"+"*时长:"+minutess+"分钟<br/> *具体内容："+successData[i].sjnr
                +"<br/> *备注："+successData[i].bz+"</div></li>"
                htmlStr+=htmlString;
            }
            document.getElementById("zzswtx").innerHTML=htmlStr;
            $("#swzzlabel").text("事务提醒 ["+successData.length+"]");
            $("#img6").attr("src","imgs/toDown.png");
            $ul.slideDown();
            } 
            var obj=document.getElementById("zzswtx").getElementsByTagName("li");
            for(var i=0;i<obj.length;i++){
                obj[i].onmouseover=function(event){
                    $(event.target).find('div').css('display','block');
                }
                 obj[i].onmouseleave=function(event){
                   $(event.target).find('div').css('display','none');
             }
            }
         }
      });
 }

function getBWL(){
    $("#dch").parent("li").hide(); 
    $("#sxt").parent("li").hide(); 
    $("#kxt").parent("li").hide(); 
    $("#BWLtx").parent("li").show();
    $("#swtxzz").parent("li").hide();
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
        var $ul = $("#BWLtx").next('ul');
        if($ul.is(':visible')){
            // $("#Bwllabel").text("备忘录提醒 ["+successData.length+"]");
            // $("#img7").attr("src","imgs/toUp.png");
            // $ul.slideUp();
            }else{
                var htmlStr="";
            for(var i=0;i<successData.length;i++){
                var htmlString="<li style=\"font-size:15px;\">【"+successData[i].bwsj+"】: "+successData[i].bwrq+
               "<div style=\"display:none;width:100%;height:45px;float:left;font-size:13px;color:#607D8B;\">"+"*备注:"+successData[i].bz+"<br/> *事件说明："+successData[i].sjsm
                +"<br/></div></li>"
                htmlStr+=htmlString;
            }
            document.getElementById("BWLswtx").innerHTML=htmlStr;
            $("#Bwllabel").text("备忘录提醒 ["+successData.length+"]");
            $("#img7").attr("src","imgs/toDown.png");
            $ul.slideDown();
            } 
            var obj=document.getElementById("BWLswtx").getElementsByTagName("li");
            for(var i=0;i<obj.length;i++){
                obj[i].onmouseover=function(event){
                    $(event.target).find('div').css('display','block');
                }
                 obj[i].onmouseleave=function(event){
                   $(event.target).find('div').css('display','none');
             }
            }
         }
      });
}

function getSxtxClick(){
    $("#dch").parent("li").hide(); 
    $("#sxt").parent("li").show(); 
    $("#kxt").parent("li").hide(); 
    $("#BWLtx").parent("li").hide();
    $("#swtxzz").parent("li").hide();
    var $ul = $("#sxt").next('ul');
    if($ul.is(':visible')){
    }else{
         $("#sxtx").empty();
         var htmlStr="";
         for(var i=0;i<sxtxvalue.length;i++){
             var ss="fff"+sxtxvalue[i];
             var htmlString="<li style=\"margin-left:-20px;\"><a href=\"javascript:void(0)\" onclick=\"getSxtxClickQf("+sxtxvalue[i]+")\" id=\""+ss+"\"><img src=\"imgs/toUp.png\" style=\"width:auto;height:auto;\" id=\"imsg"+ss+"\"><label style=\"font-size:16px;\" id=\"label"+ss+"\">"+ysxtxvalue[i]+"</label></a><ul></ul></li>";
             htmlStr+=htmlString;
         }
         document.getElementById("sxtx").innerHTML=htmlStr;
         $ul.slideDown();
    }
}


function getSxtxClickQf(gh){
    var newurl=localUrl+urls[gh];
    var yhdm = $("#yhdm").val();
    var fydm = $("#fydm").val();
    var ss="fff"+gh;
    var sds="#"+ss;
    var $ul = $(sds).next('ul');
    var imgs="#imsg"+ss;
    var label="#label"+ss;
    if($(label).text()!=ysxtxvalue[gh]){
        if($ul.is(':visible')){
            $(imgs).attr("src","imgs/toUp.png");
            $ul.slideUp();
        }else{
            $(imgs).attr("src","imgs/toDown.png");
            $ul.slideDown();
        }
    }else{
        $.ajax({
            type: "POST",
            dataType: "json",
            url:encodeURI(newurl),
            data: { fydm: fydm, yhdm: yhdm},
            error: function () {
               console.log("审限提醒查询错误！");
           },
            success: function (successData) {
                    var htmlStr="";
                    for(var i=0;i<successData.length;i++){
                        var htmlString="<li>【案号】"+successData[i].anhao+"，审限到期日期："+successData[i].sxdqrq+"</li>";
                        htmlStr+=htmlString;
                    }
                    $ul.html(htmlStr);
                    $(label).text(ysxtxvalue[gh]+"["+successData.length+"]");
                    $(imgs).attr("src","imgs/toDown.png");
                    $ul.slideDown();
                 }
              });
    }

}



//计算会议时长
function DateMinus(date1,date2){
    var sdate=new Date(date1);
    var edate=new Date(date2);
    var times=edate.getTime()-sdate.getTime();
    var minutes=parseInt(times/(1000*60))
    return minutes;
}

//默认显示最大窗口
var isBig = false;
//点击最大化按钮
$(".sys-control-box .sys-btn-big").click(function () {
    if (isBig) {
        $(this).css('background', 'url(' + getSmallUrl() + ')');
        ipc.send('turn-small-user-editor');
    } else {
        $(this).css('background', 'url(' + getBigUrl() + ')');
        ipc.send('turn-big-user-editor');
    }
    isBig = !isBig;
});
 $(".sys-btn-setting").click(function(){
   var yhdm=$("#yhdm").val();
   var password=$("#password").val();
   var fydm= $("#fydm").val();
     var userdata={
       "fydm": fydm, 
       "yhdm": yhdm, 
       "password": password
     };
    ipc.send('look-set',userdata);
 })

 $(".newId").click(function(){
   var yhdm=$("#yhdm").val();
   var password=$("#password").val();
   var fydm= $("#fydm").val();
     var userdata={
       "fydm": fydm, 
       "yhdm": yhdm, 
       "password": password
     };
     ipc.send('new-record',userdata);
 });
 $(".teamCommunity").click(function(){
    var yhdm=$("#yhdm").val();
    var password=$("#password").val();
    var fydm= $("#fydm").val();
      var userdata={
        "fydm": fydm, 
        "yhdm": yhdm, 
        "password": password
      };
      ipc.send('teamwork',userdata);
  });


//点击关闭按钮
$(".sys-control-box .sys-btn-closed").click(function () {
    ipc.send('close-user-editor-window');
});
//案件
// $("#ajblock").click(function(){
//     $("#anjian").attr("src","imgs/banjiann.png");
//     $("#mainContent1").css("display","block");
//     $("#mainContent2").css("display","none");
//     $("#mainContent3").css("display","none");
//     $("#ajblock").css("background-color","white");
//     $("#ajblock").css("color","#1e74c2");
//     $("#swblock").css("color","black");
//     $("#sxblock").css("color","black");
//     $("#swblock").css("background-color","rgba(120, 132, 147, 0.14)");
//     $("#sxblock").css("background-color","rgba(120, 132, 147, 0.14)");
//     $("#shiwu").attr("src","imgs/shiwun.png");
//     $("#shenpi").attr("src","imgs/shenpin.png");
// });
// //事务
// $("#swblock").click(function(){
//     $("#shiwu").attr("src","imgs/bshiwun.png");
//     $("#mainContent1").css("display","none");
//     $("#mainContent2").css("display","block");
//     $("#mainContent3").css("display","none");
//     $("#anjian").attr("src","imgs/anjiann.png");
//     $("#shenpi").attr("src","imgs/shenpin.png");
//     $("#swblock").css("background-color","white");
//     $("#swblock").css("color","#1e74c2");
//     $("#sxblock").css("color","black");
//     $("#ajblock").css("color","black");
//     $("#sxblock").css("background-color","rgba(120, 132, 147, 0.14)");
//     $("#ajblock").css("background-color","rgba(120, 132, 147, 0.14)");
//     getSwZZ();
//     getBWL();
// });
// //审核
// $("#sxblock").click(function(){
//     $("#anjian").attr("src","imgs/anjiann.png");
//     $("#shiwu").attr("src","imgs/shiwun.png");
//     $("#shenpi").attr("src","imgs/bshenpin.png");
//     $("#mainContent1").css("display","none");
//     $("#mainContent2").css("display","none");
//     $("#mainContent3").css("display","block");
//     $("#sxblock").css("background-color","white");
//     $("#sxblock").css("color","#1e74c2");
//     $("#ajblock").css("color","black");
//     $("#swblock").css("color","black");
//     $("#ajblock").css("background-color","rgba(120, 132, 147, 0.14)");
//     $("#swblock").css("background-color","rgba(120, 132, 147, 0.14)");
// });




//接受登陆成功的用户信息，并赋值
ipc.on('loginUserData', function (event, message) {
    // let user = JSON.parse(message);
    let user = message;
    console.log(user);
    // $("#userid input").val(user.yhmc);
    // $("#userlid input").val(user.yhsf);
    $("#name").text(user.yhmc);
    $("#yhsf").text(user.yhsf);
    $("#yhdm").val(user.yhdm);
    $("#password").val(user.yhkl);
    $("#fydm").val(user.fydm);
    $("#fymc").text(user.fymc);
    // setCookie('fydm',user.fydm);
    // setCookie('yhdm',user.yhdm);
});

ipc.on('open-cx-1',(event, arg)=>{
    var $ul = $("#dch").next('ul');
    $("#img1").attr("src","imgs/toDown.png");
    $ul.slideDown();
    var $ull =$("#kxt").next('ul');;
    if($ull.is(":visible")){
        $("#img3").attr("src","imgs/toUp.png");
        $ull.slideUp();
    }
    var $ull1 =$("#sxt").next('ul');;
    if($ull1.is(":visible")){
        $("#img2").attr("src","imgs/toUp.png");
        $ull1.slideUp();
    }
});

ipc.on('open-cx-2',(event, arg)=>{
    var $ul = $("#sxt").next('ul');
    $("#img2").attr("src","imgs/toDown.png");
    $ul.slideDown();
    var $ull1 = $("#dch").next('ul');
    if($ull1.is(":visible")){
        $("#img1").attr("src","imgs/toUp.png");
        $ull1.slideUp();
    }
    var $ull =$("#kxt").next('ul');;
    if($ull.is(":visible")){
        $("#img3").attr("src","imgs/toUp.png");
        $ull.slideUp();
    }
});

ipc.on('open-cx-3',(event, arg)=>{
    var $ul = $("#kxt").next('ul');
    $("#img3").attr("src","imgs/toDown.png");
    $ul.slideDown();
    var $ull = $("#sxt").next('ul');
    if($ull.is(":visible")){
        $("#img2").attr("src","imgs/toUp.png");
        $ull.slideUp();
    }
    var $ull1 = $("#dch").next('ul');
    if($ull1.is(":visible")){
        $("#img1").attr("src","imgs/toUp.png");
        $ull1.slideUp();
    }
});

ipc.on('open-cx-4',(event, arg)=>{
    getSwZZ();
    var $ul = $("#swtxzz").next('ul');
    if($ul.is(':visible')){
    }else{
        $("#img6").attr("src","imgs/toDown.png");
        $ul.slideDown();
    }
    var $ull = $("#BWLtx").next('ul');
    if($ull.is(':visible')){
        $("#img7").attr("src","imgs/toUp.png");
        $ull.slideUp();
    }
});
ipc.on('open-cx-5',(event, arg)=>{
    getBWL();
    var $ul = $("#BWLtx").next('ul');
    if($ul.is(':visible')){
    }else{
        $("#img7").attr("src","imgs/toDown.png");
    $ul.slideDown();
    }
    var $ull = $("#swtxzz").next('ul');
    if($ull.is(':visible')){
        $("#img6").attr("src","imgs/toUp.png");
        $ull.slideUp();
    }
});
//实时获取时间
function getRealTime() {
    var date=new Date();
    var year=date.getFullYear();
    var month=date.getMonth()+1;
    var day=date.getDate();
    var hour=date.getHours();
    var minute=date.getMinutes();
    var second=date.getSeconds();
    // var weeks=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"]
    // var week=weeks[date.getDay()];
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
    // var fromatDay=year+":"+month+":"+day+" "+hour+":"+minute+":"+second+"    "+week;
    // $("#RealTime").text(fromatDay);
    var sdate=hour+":"+minute+":"+second;
    if(sdate==getTxs){
       console.log("getTxs:"+getTxs);
       ipc.send('tx-clock',userData);
    }
    if(sdate=="14:10:00"){
       ipc.send('tx-clock',userData);
    }
    setTimeout('getRealTime()',1000);
}

//设置定时任务
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
    var fromatDay=year+":"+month+":"+day+" "+hour+":"+minute+":"+second+"    "+week;
    $("#RealTime").text(fromatDay);
    if(($("#yhdm").val()=="")||($("#yhdm").val()==null)){
      setTimeout('getRealTimeTask()',1000);
    }else{
        userData={
            "fydm":$("#fydm").val(),
            "yhdm":$("#yhdm").val(),
        }
        getGXSZ();
        // getLctx();
        // getSxtx();
        // getKxtx();
        getRealTime();
    }
}

// 设置定时获取一次提醒
function getDataTX(){

}

function getBigUrl() {

    const img_small = url.format({
        pathname: path.join(__dirname, 'imgs/turnsmall.png'),
        protocol: 'file',
        slashes: true
    });
    var newUrl = img_small.replace(/\\/g, "\/");

    return newUrl;
}

function getSmallUrl() {
    const img_big = url.format({
        pathname: path.join(__dirname, 'imgs/turnbig.png'),
        protocol: 'file',
        slashes: true
    });
    var newUrl = img_big.replace(/\\/g, "\/");
    return newUrl;
}



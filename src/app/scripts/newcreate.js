'use strict'

const ipc = require('electron').ipcRenderer;

var fydm;
var yhdm;
var localUrl='http://130.1.67.23:8088';
$(document).ready(function () {
setDataTimePicker("#registerDateBegin");
setDataTimePicker("#registerDateEnd");
$('#fybm').select2({
    placeholder: "部门",
    allowClear: true
});
$('#btxr').select2({
    placeholder: "选择人员",
    allowClear: true,
    multiple:true,
//    maximumSelectionLength: 3  //最多能够选择的个数
});
$(':radio').click(function(){
var xzs=$(this).val();
if(xzs==0){
    $("#jssj").css("display","block");
    $("#sc").css("display","none");
}else{
    $("#jssj").css("display","none");
    $("#sc").css("display","block");
}
});
toastr.options = {  
    closeButton: true,  //是否显示关闭按钮
    debug: false,  //是否为调试
    progressBar: true,  //是否显示进度条（设置关闭的超市时间进度条）
    positionClass: "toast-center-center",  //消息框在页面显示的位置
    onclick: null,  
    showDuration: "200",  
    hideDuration: "1000",  
    timeOut: "2000",  //自动关闭超时时间 
    extendedTimeOut: "1000",  
    showEasing: "swing",  
    hideEasing: "linear",  
    showMethod: "fadeIn",  //“fadeIn” 显示的方式，和jquery相同 
    hideMethod: "fadeOut",// “fadeOut” 隐藏的方式，和jquery相同
}; 
ipc.on('newData', function (event, message) {
    console.log(message);
    // let user = JSON.parse(message);
    let user = message;
    console.log(user);
    fydm=user.fydm;
    yhdm=user.yhdm;
    selectInit(localUrl+'/showBmxx?fydm='+fydm,'#fybm');
});
});
$("#toClose").click(function(){
    ipc.send('close-new-window');
});

$('#fybm').change(function () {
    $('#btxr').empty();
    selectInit(localUrl+'/showBmry?fydm='+fydm+'&clbm='+$('#fybm').find("option:selected").text(),'#btxr');
});
$(".returnback").click(function(){
    $('#registerDateBegin').val("");
    $('#registerDateEnd').val("");
    $('#DateEndsc').val("");
    $('.btnd option:selected').val("");
    $('#ssjnr').val("");
    $('#bz').val("");
    $("#fybm").val(null).trigger("change");
})

$(".save").click(function(){
    var datestart=$('#registerDateBegin').val();
    var dateend="";
    if($('#registerDateEnd').val()!=""&$('#registerDateEnd').val()!=null){
      dateend=$('#registerDateEnd').val();
    }else{
     var sdtime="";
     var ssd=$('#DateEndsc').val();
     var dates=convertDateFromString(datestart).getTime()+parseInt(ssd)*60*1000;
     var date=new Date();
     date.setTime(dates);
     sdtime+=date.getFullYear()+"-"+getMonth(date)+"-"+getDay(date)+" "+getHours(date)+":"+getMinus(date)+":"+getSeconds(date);
     dateend=sdtime;
     console.log(dateend);
    }

    var lx=$('.btnd option:selected').val();
    var ssjnr=$('#ssjnr').val();
    var bz=$('#bz').val();
   // var fybm=$('#fybm').val();
    var btxr=$('#btxr').val();
    if(datestart==""){
      $('#registerDateBegin').focus();
      return;
    }
    // if(dateend==""){
    //   $('#registerDateEnd').focus();
    //   return;
    // }
    if(ssjnr==""){
        $('#ssjnr').focus();
        return;
    }
    if(btxr==null){
        $('#btxr').focus();
        return;
    }
    var userdata={
        "fydm": fydm, 
        "yhdm": yhdm, 
      };
    //实体类名必须和实体属性名相同，newdata是json对象
    var newdata={
        "fydm":fydm,
        "yhdm":yhdm,
        "qssj":datestart,
        "jssj":dateend,
        "txlb":lx,
        "sjnr":ssjnr,
        "bz":bz,
        "btxr":btxr,
    };
    $.ajax({
      type:"post",
      dataType:"text",
      contentType:'application/json;charset=utf-8',
      url:encodeURI(localUrl+'/insertSW'),
      data:JSON.stringify(newdata),
      processData : false,//是否序列化
      success:function (msg) {
         toastr.success("新增成功！");
         ipc.send('get-new-window');
         ipc.send('tx-clock',userData);
      },
      error : function(jqXHR, textStatus, errorThrown) {
        toastr.error("新增失败！");
      }
    });
});

$.fn.datetimepicker.dates['zh-CN'] = {
    days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
    daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
    months: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
    monthsShort: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
    today: "今天",
    suffix: [],
    meridiem: ["上午", "下午"]
};
function convertDateFromString(dateString){
    if(dateString){
        var arr1=dateString.split(" ");
        var sdate=arr1[0].split("-");
        var ydate=arr1[1].split(":");
        var date=new Date(sdate[0],sdate[1]-1,sdate[2],ydate[0],ydate[1],ydate[2])
        return date;
    }else{
        toastr.warning("时间输入格式错误!");
    }
}

function getMonth(date){
  var month="";
  month=date.getMonth()+1;
  if(month<10){
    month="0"+month;
   }
 return month;
}
function getDay(date){
  var day="";
  day=date.getDate();
  if(day<10){
      day="0"+day;
  }
  return day;
}
function getHours(date){
  var hours="";
  hours=date.getHours();
  if(hours<10){
      hours="0"+hours;
  }
  return hours;
}
function getMinus(date){
   var minutes="";
   minutes=date.getMinutes();
   if(minutes<10){
    minutes="0"+minutes; 
   }
   return minutes;
}
function getSeconds(date){
    var seconds="";
    seconds=date.getSeconds();
    if(seconds<10){
        seconds="0"+seconds; 
    }
    return seconds;
}
function setDataTimePicker(nodeId) {
    $(nodeId).datetimepicker({
      language:  'zh-CN',
      autoclose: 1,
      format: 'yyyy-MM-dd hh:ii:ss',
      weekStart: 7,
      startDate: '+0d',
      //endDate: '+0d',
      startView: 0,//0从小时视图开始，选分；1从天开始选小时；2从月开始选天，3，4...
      minView: 0,//最精确时间，从小时视图开始
      todayBtn: 0,
      todayHighlight: 1,
      keyboardNavigation: 1,
      minuteStep: 5,//选择分钟的跨度
     // showMeridian: 1,
      forceParse: 0,
      showclear:true,
    });
  }
function selectInit(url,id) {
    $.ajax({
        type:"post",
        url:encodeURI(url),
        dataType : "json",
        processData : true,
        success:function (msg) {
            $(id).empty();
            // console.log(msg)
            $(id).append("<option value=\"\">请选择</option>");
            for (var i = 0; i < msg.length; i++) {
                $(id).append("<option  value=" + msg[i] + ">" + msg[i] + "</option>");
            }
        },
        error : function(jqXHR, textStatus, errorThrown) {
        }
    });
}

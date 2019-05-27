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

$(".save").click(function(){
    var datestart=$('#registerDateBegin').val();
    var dateend=$('#registerDateEnd').val();
    var lx=$('.btnd option:selected').val();
    var ssjnr=$('#ssjnr').val();
    var bz=$('#bz').val();
   // var fybm=$('#fybm').val();
    var btxr=$('#btxr').val();
    if(datestart==""){
      $('#registerDateBegin').focus();
      return;
    }
    if(dateend==""){
      $('#registerDateEnd').focus();
      return;
    }
    if(ssjnr==""){
        $('#ssjnr').focus();
        return;
    }
    if(btxr==null){
        $('#btxr').focus();
        return;
    }
   
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
         alert("新增成功！");
         ipc.send('close-new-window');
      },
      error : function(jqXHR, textStatus, errorThrown) {
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
            $(id).append("<option value=\"\">不限</option>");
            for (var i = 0; i < msg.length; i++) {
                $(id).append("<option  value=" + msg[i] + ">" + msg[i] + "</option>");
            }
        },
        error : function(jqXHR, textStatus, errorThrown) {
        }
    });
}


'use strict'

const ipc = require('electron').ipcRenderer;
const url = require('url');
const path = require('path');
var fydm=null;
var yhdm=null;
var yhkl=null;


var localUrl='http://130.1.67.23:8088';
$(document).ready(function () {
    setDataTimePicker("#setDate");
    });
ipc.on('setUserData', function (event, message) {
        console.log(message);
        // let user = JSON.parse(message);
        let user = message;
        console.log(user);
        fydm=user.fydm;
        yhdm=user.yhdm;
        yhkl=user.password;
        $(function(){
            var errorType = {
                //在设置了fileNumLimit且尝试给uploader添加的文件数量超出这个值时派送
                Q_EXCEED_NUM_LIMIT: 'Q_EXCEED_NUM_LIMIT',
                //在设置了Q_EXCEED_SIZE_LIMIT且尝试给uploader添加的文件总大小超出这个值时派送
                Q_EXCEED_SIZE_LIMIT: 'Q_EXCEED_SIZE_LIMIT',
                //当文件类型不满足时触发
                Q_TYPE_DENIED: 'Q_TYPE_DENIED',
                //服务器没有接收文件
                Q_SERVER_DENIED: 'Q_SERVER_DENIED',
                //单个文件超过大小限制
                F_EXCEED_SIZE: 'F_EXCEED_SIZE',
                //重复添加一样的文件
                F_DUPLICATE: 'F_DUPLICATE'
            }
            //var uploader;
            var $ = jQuery,
                $list = $('#fileList'),
                $btn = $('#ctlBtn'),
                state = 'pending',
                uploader;
            uploader = WebUploader.create({
                server: 'http://localhost:8088/uploadingfiles?fydm='+fydm+'&yhdm='+yhdm,   //url文件服务器接收端
                swf: 'static/webuploader/Uploader.swf',//swf文件路径
                disableGlobalDnd: true, //选择文件的按钮，可选
                pick: {
                    //  multiple:false,
                    id: '#picker'
                },
                auto: true,//自动上传
                resize: false,//不压缩Image
                chunked: true,
                chunkedSize: 64 * 1024 * 1024,    //64M
                /*
               fileSizeLimit:2000*1024*1024,
               */
                fileSizeLimit: 2000 * 1024 * 1024,    // 2000 M
                fileSingleSizeLimit: 100 * 1024 * 1024,  // 100 M
                compress: false,
        
                accept: {
                    title: 'files',
                    extension: 'gif,jpg,jpeg,bmp,png,pdf,doc,docx,xlsx,xls',
                    mineTypes: '*'
                }
            });
        
            uploader.on('click', function () {
                if ($(this).hasClass('disabled')) {
                    return false;
                }
            });
            uploader.on('fileQueued', function (file) {
                $list.html("");
                $list.append('<div id="' + file.id + '" class="item">' +
                    '<h4 class="info">' + file.name + '</h4>' +
                    '<p class="state">等待上传...</p>' +
                    '</div>');
                //$('#phdj_wjmc').text(file.name);
                // 创建缩略图
                // 如果为非图片文件，可以不用调用此方法。
                // thumbnailWidth x thumbnailHeight 为 100 x 100
                
                // $img=$list.find('img');
                // $list.append( $li );
                uploader.makeThumb(file, function(error,src ) {
                    if (error) {
                      //  $img.replaceWith('<span>不能预览</span>');
                        return;
                    }
                   // $img.attr( 'src', src );
                    $('#sctx').attr('src',src);
                }, 100, 100 );
            });
        
        
            // 文件上传过程中创建进度条实时显示。
            uploader.on('uploadProgress', function (file, percentage) {
                var $li = $('#' + file.id),
                    $percent = $li.find('.progress .progress-bar');
                // 避免重复创建
                if (!$percent.length) {
                    $percent = $('<div class="progress progress-striped active">' +
                        '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                        '</div>' +
                        '</div>').appendTo($li).find('.progress-bar');
                }
                $li.find('p.state').text('上传中');
                $percent.css('width', percentage * 100 + '%');
            });
        
            uploader.on('uploadSuccess', function (file) {
                $('#' + file.id).find('p.state').text('已上传');
                // $('#sctx').attr("src",file )
                alert("上传成功！");
            });
        
          
            //发生错误时(文件格式不符合，文件大小不符合)
            uploader.on('uploadError', function (error, file) {
                var content = '';
                switch (error) {
                    case errorType.Q_EXCEED_NUM_LIMIT:
                        content = '文件数量不能超过' + uploader.options.fileNumLimit + '个'
                        break;
                    case errorType.Q_TYPE_DENIED:
                        content = '文件类型错误，请上传' + uploader.options.accept[0].extensions + '格式的文件'
                        break;
                    case errorType.Q_EXCEED_SIZE_LIMIT:
                        content = '文件总大小不能超过' + Math.ceil(uploader.options.fileSizeLimit / 1024 / 1024) + 'MB';
                        break;
                    case errorType.Q_SERVER_DENIED:
                        content = '上传失败';
                        break;
                    case errorType.F_EXCEED_SIZE:
                        content = '单个文件不能大于' + Math.ceil(uploader.options.fileSingleSizeLimit / 1024 / 1024) + 'MB';
                        break;
                    case errorType.F_DUPLICATE:
                        return;
                        break;
                    default:
                        content = error;
                }
                //common.notify(alert,'error');
                $('#' + file.id).find('p.state').text(content);
            })
        
            uploader.on('uploadComplete', function (file) {
                $('#' + file.id).find('.progress').fadeOut();
            });
            uploader.on('all', function (type) {
                if (type === 'startUpload') {
                    state = 'uploading';
                } else if (type === 'stopUpload') {
                    state = 'paused';
                } else if (type === 'uploadFinished') {
                    state = 'done';
                }
                if (state === 'uploading') {
                    $btn.text('暂停上传');
                } else {
                    $btn.text('开始上传');
                }
        
            });
        
            $btn.on('click', function () {
                if (state === 'uploading') {
                    uploader.stop();
                } else {
                    uploader.upload();
                }
            });
        
            $("#cancleBtn").on('click', function () {
                uploader.removeAll();
                $list.html("");
                var fileItem = uploader.getFiles();
                console.log(fileItem);
            })
        });
});

$(".save").click(function(){
    var nickname=$("#grnc").val();
    var setTime=$('#setDate').val();
    $.ajax({
        type:"POST",
        dataType:"text",//返回数据类型
        url:encodeURI(localUrl+'/updateNickname'),
        data:{"fydm":fydm,"yhdm":yhdm,"nickname":nickname,"setTime":setTime},
        processData : true,
        success:function (msg) {
          alert("保存成功！");
          ipc.send('update-set-window');
        },
        error : function(jqXHR, textStatus, errorThrown) {
        }
    });
});
$("#toClose").click(function(){
    ipc.send('close-set-window');
});

function setDataTimePicker(nodeId) {
    $(nodeId).datetimepicker({
      language:  'zh-CN',
      autoclose: 1,
      format: 'hh:ii',
      startDate: '+0d',
      startView: 0,//0从小时视图开始，选分；1从天开始选小时；2从月开始选天，3，4...
      minView: 0,//最精确时间，从小时视图开始
      todayBtn: 0,
      todayHighlight: 1,
      keyboardNavigation: 1,
      minuteStep: 5,//选择分钟的跨度
     // showMeridian: 1,
      forceParse: 0,
      showclear:true,
      pickerPosition:'top-left',
    });
  }
$(".updatepas").click(function () {
    $(".errorInformation").hide();
    var oripassword = $("#oripassword").val();
    var newPassword = $("#newpassword").val();
    var confirmpassword = $("#confirmpassword").val();
    if(oripassword!=yhkl){
        $(".errorInformation").show();
        $(".errorInformation").css("color","red");
        $(".errorInformation").text("原密码错误！");
    }else{
        if(newPassword!=confirmpassword){
            $(".errorInformation").show();
            $(".errorInformation").css("color","red");
            $(".errorInformation").text("新密码不一致！"); 
        }else{
            $.ajax({
                type:"POST",
                dataType:"text",//返回数据类型
                url:encodeURI(localUrl+'/updateYhkl'),
                data:{"fydm":fydm,"yhdm":yhdm,"yhkl":confirmpassword},
                processData : true,
                success:function (msg) {
                    $(".errorInformation").show();
                    $(".errorInformation").css("color","black");
                    $(".errorInformation").text("修改成功！"); 
                },
                error : function(jqXHR, textStatus, errorThrown) {
                }
            });
        }
    }
});

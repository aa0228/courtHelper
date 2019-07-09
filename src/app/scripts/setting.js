'use strict'

const ipc = require('electron').ipcRenderer;
const url = require('url');
const path = require('path');
var fydm = null;
var yhdm = null;
var yhkl = null;
var table;
var tableModel;
var memnamedx=null;
var tabledata = new Object();
var localUrl = 'http://130.1.67.23:8088';
$(document).ready(function () {
    setDataTimePicker("#setDate");
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
    var titles = ['成员名', '所在团队', '角色'];
    var modeltitles=['任务类型', '任务内容', '团队名称','团员姓名','时限'];
    table = $('#books').DataTable({
        "lengthChange": false, //是否允许用户改变表格每页显示的记录数
        "pageLength": 5, //改变初始化时页面的长度，每页显示的数据
        "searching": false, //是否允许开启本地搜索
        "serverSide": false, //默认false,即客户端处理模式,true即从服务器端进行分页
        "language": {
            "emptyTable": "没有数据",
            "infoEmpty": "没有数据",
            "info": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
            "infoFiltered": "(从 _MAX_ 条数据中检索)",
            "loadingRecords": "加载中...",
            "processing": "处理中...",
            "search": "搜索:",
            "zeroRecords": "没有找到匹配的数据",
            "paginate": {
                "first": "首页",
                "last": "末页",
                "next": "上一页",
                "previous": "下一页"
            },
            "aria": {
                "sortAscending": ": activate to sort column ascending",
                "sortDescending": ": activate to sort column descending"
            },
        }
    });
    tableModel = $('#contentmodel').DataTable({
        "lengthChange": false, //是否允许用户改变表格每页显示的记录数
        "pageLength": 5, //改变初始化时页面的长度，每页显示的数据
        "searching": false, //是否允许开启本地搜索
        "serverSide": false, //默认false,即客户端处理模式,true即从服务器端进行分页
        "language": {
            "emptyTable": "没有数据",
            "infoEmpty": "没有数据",
            "info": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
            "infoFiltered": "(从 _MAX_ 条数据中检索)",
            "loadingRecords": "加载中...",
            "processing": "处理中...",
            "search": "搜索:",
            "zeroRecords": "没有找到匹配的数据",
            "paginate": {
                "first": "首页",
                "last": "末页",
                "next": "上一页",
                "previous": "下一页"
            },
            "aria": {
                "sortAscending": ": activate to sort column ascending",
                "sortDescending": ": activate to sort column descending"
            },
        }
    });
    table.columns([4]).visible(false);
    tableModel.columns([5]).visible(false);
    var teamname = $("#selectteam").find("option:selected").text();
    table.on('order.dt search.dt', function () {
        table.column(0, {
            search: 'applied',
            order: 'applied'
        }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();

    tableModel.on('order.dt search.dt', function () {
        tableModel.column(0, {
            search: 'applied',
            order: 'applied'
        }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();

    $('#books tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });
    $('#contentmodel tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            tableModel.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });
    $("#cancelAdd").on('click', function () {
        $("#addBookModal").find('input').val('');
    });
    $("#cancelAddc").on('click', function () {
        $("#addBookModalc").find('input').val('');
    });
    $("#addBooksInfo").on('click', function () {
            var memname = $("#btxr").val();
            var teamId = $("#selectteam").val();
            var teamname =$("#selectteam").find("option:selected").text();
            var role = $("#bookPrice").val();
            var addBookInfos = [].concat(memname, teamId, role);
            for (var i = 0; i < addBookInfos.length; i++) {
                if (addBookInfos[i] === '') {
                    toastr.warning(titles[i] + '内容不能为空');
                }
            }
            if (($("#addBookModal").find('input').val() !== '')&($("#btxr").val() !== '')) {
               table.row.add(['', memname, teamname, role, 3]).draw();
               $("#addBookModal").find('input').val('');
               var datal={
                "memname":memname,
                "teamId":teamId,
                "role":role,
              }
               $.ajax({
                type: "post",
                url: encodeURI(localUrl + '/insertMember'),
                async: false,
                dataType: "json",
                data: datal,
                success: function (data) {
                },
                error: function (jqXHR, textStatus, errorThrown) { }
              });
            }
    });

    $("#addBooksInfoc").on('click', function () {
        var sid=$("#selectteam1").val();
       var modellb=$("#modellb").find("option:selected").text();
       var modelname=$("#modelname").find("option:selected").text();
       var teamna=$("#teamna").val();
       var teammember=$("#teammember").find("option:selected").text();
       var tasksx=$("#tasksx").val();
       var flag=true;
       modeltitles = [].concat(modellb, modelname, teamna,teammember,tasksx);
        for (var i = 0; i < modeltitles.length; i++) {
            if (modeltitles[i] === '') {
                toastr.warning(modeltitles[i] + '内容不能为空');
                flag=false;
            }
        }
        if (flag) {
         //   tableModel.row.add(['', modellb, modelname,teammember,tasksx,8]).draw();
           $("#addBookModal").find('input').val('');
           $("#addBookModal").find('select').val('');
           var datalw={
            "id":1,
            "mbname":modellb,
            "contentname":modelname,
            "teamid":teamna,
            "membername":teammember,
            "sx":tasksx,
          }
           $.ajax({
            type: "post",
            url: encodeURI(localUrl + '/insertTeamModel'),
            async:true,
            dataType: "text",
            contentType:'application/json;charset=utf-8',
            data: JSON.stringify(datalw),
            success: function (data) {
                reloadTableModel(sid);
            },
            error: function (jqXHR, textStatus, errorThrown) { }
          });
        }
});
 
    $("#btn_add").click(function () {
        $("#addBook").modal();
        var inputs = $("#addBookModal").find('input');
        $(inputs[0]).val($("#selectteam").find("option:selected").text());
    });
    $("#btn_addcontent").click(function () {
        $("#addcontnet").modal();
    });
    $('#btn_edit').click(function () {
        if (table.rows('.selected').data().length) {
            $("#editBookInfo").modal();
            var rowData = table.rows('.selected').data()[0];
			var inputs = $("#editBookModal").find('input');
			for(var i = 0; i < inputs.length; i++) {
				$(inputs[i]).val(rowData[i + 1]);
			}
        } else {
           toastr.warning("请选择行(单击选中行)");
        }
    });
    $("#saveEdit").click(function () {
        var editBookName = $("#editBookName").val();
        var editBookAuthor = $("#editBookAuthor").val();
        var editBookPrice = $("#editBookPrice").val();
        var teamId = $("#selectteam").val();
        var newRowData = [].concat(editBookName, editBookAuthor, editBookPrice);
        var tds = Array.prototype.slice.call($('.selected td'));
        var flag=true;
        for (var i = 0; i < newRowData.length; i++) {
            if ((newRowData[i] !== '')&(newRowData[i] !== null)) {
                tds[i + 1].innerHTML = newRowData[i];
            } else {
                toastr.warning(titles[i] + '内容不能为空');
                flag=false;
            }
        }
        if(flag){
            var datal={
                "memname":editBookName,
                "teamId":teamId,
                "role":editBookPrice,
              }
            $.ajax({
                type: "post",
                url: encodeURI(localUrl + '/updateMember'),
                async: true,
                dataType: "json",
                data: datal,
                success: function (data) {
                },
                error: function (jqXHR, textStatus, errorThrown) { }
              });
        } 
    })
    $("#cancelEdit").click(function () {
        $("#editBookModal").find('input').val('');
    })
    $('#btn_delete').click(function () {
        if (table.rows('.selected').data().length) {
            $("#deleteBook").modal();
            var rowData = table.rows('.selected').data()[0];
            memnamedx=rowData[1];
        } else {
             toastr.warning("请选择行(单击选中行)");
        }
    });
    $('#btn_deletecontent').click(function () {
        if (tableModel.rows('.selected').data().length) {
            $("#deletecontent").modal();
            var rowData = table.rows('.selected').data()[0];
        } else {
             toastr.warning("请选择行(单击选中行)");
        }
    });
    $('#deletec').click(function () {
        if (tableModel.rows('.selected').data().length) {
        var rowData = ""+tableModel.rows('.selected').data()[0];
        var id=rowData.split(",");
        var datalk={
            "id":id[5],
          }
          tableModel.row('.selected').remove().draw(false);
        $.ajax({
            type: "post",
            url: encodeURI(localUrl + '/deleteTeammodel'),
            dataType: "json",
            data: datalk,
            success: function (data) {
                
            },
            error: function (jqXHR, textStatus, errorThrown) { }
          });
        }else{
            toastr.warning("请选择行(单击选中行)！");
        } 
    });
    $('#delete').click(function () {
        table.row('.selected').remove().draw(false);
        var teamId = $("#selectteam").val();
        var datal={
            "memname":memnamedx,
            "teamId":teamId,
          }
        $.ajax({
            type: "post",
            url: encodeURI(localUrl + '/deleteMember'),
            dataType: "json",
            data: datal,
            success: function (data) {
            },
            error: function (jqXHR, textStatus, errorThrown) { }
          });
    });
});

ipc.on('setUserData', function (event, message) {
    console.log(message);
    // let user = JSON.parse(message);
    let user = message;
    console.log(user);
    fydm = user.fydm;
    yhdm = user.yhdm;
    yhkl = user.password;
    selectInitJT(localUrl+'/getAllTeam?fydm='+fydm, '#selectteam');
    selectInitJT(localUrl+'/getAllTeam?fydm='+fydm, '#teamna');
    selectInitJT(localUrl+'/getAllTeam?fydm='+fydm, '#selectteam1');
    selectInit(localUrl + '/showBmxx?fydm=' + fydm, '#fybm');
    selectInitMD(localUrl + '/getallmodel', '#selectcontent');
    selectInitMD(localUrl + '/getallmodel', '#modellb');
    selectInitJT(localUrl+'/getAllTeam?fydm='+fydm, '#selectteam');

    $(function () {
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
            server: 'http://130.1.67.23:8088/uploadingfiles?fydm=' + fydm + '&yhdm=' + yhdm,   //url文件服务器接收端
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
            uploader.makeThumb(file, function (error, src) {
                if (error) {
                    return;
                }

                $('#sctx').attr('src', src);
            }, 100, 100);
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
            toastr.success("上传成功!");
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
        })
    });
});

$('#selectteam').change(function () {
    if (($('#selectteam').val()!='')&&($('#selectteam').val()!=null)) {
        var teamId = $('#selectteam').val();
        reloadTable(teamId);
    }else{
        table.clear().draw();
    }
});
$("#modelname").change(function(){
    var id=$("#modelname").val(); 
    $.ajax({
        type:"post",
        url:encodeURI(localUrl+'/getModelContentByid'),
        dataType: "text",//返回数据类型
        data: { "id": id},
        processData: true,
        success: function (msg) {
           $("#tasksx").val(msg);
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }

    })
})
$('#selectteam1').change(function () {
    if (($('#selectteam1').val()!='')&&($('#selectteam1').val()!=null)) {
        var teamIds = $('#selectteam1').val();
        reloadTableModel(teamIds);
    }else{
        tableModel.clear().draw();
    }
});

$('#fybm').change(function () {
    $('#btxr').empty();
    selectInit(localUrl + '/showBmry?fydm=' + fydm + '&clbm=' + $('#fybm').find("option:selected").text(), '#btxr');
});

$('#teamna').change(function () {
    $('#teammember').empty();
    selectInitmember(localUrl + '/getAllTeamMember?teamId='+ $('#teamna').val(),'#teammember');
});

$('#modellb').change(function () {
    $('#modelname').empty();
    selectInitClass(localUrl + '/getModelByfid?fid='+ $('#modellb').val(), '#modelname');
});

   
$(".save").click(function () {
    var nickname = $("#grnc").val();
    $.ajax({
        type: "POST",
        dataType: "text",//返回数据类型
        url: encodeURI(localUrl + '/updateNickname'),
        data: { "fydm": fydm, "yhdm": yhdm, "nickname": nickname },
        processData: true,
        success: function (msg) {
            toastr.success("保存成功！!");
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
});

$('.savell').click(function () {
    var setTime1 = $('#setDate1').val();
    var setTime2 = $('#setDate2').val();
    var setTime3 = $('#setDate3').val();
    var setTime = setTime1 + ":" + setTime2 + ":" + setTime3;
    var sxtx = new Array();
    $('input[type="checkbox"]:checked').each(function () {
        sxtx.push($(this).val());
    })
    var sxtxlb = sxtx.join(',');
    $.ajax({
        type: "POST",
        dataType: "text",//返回数据类型
        url: encodeURI(localUrl + '/updatesystemSet'),
        data: { "fydm": fydm, "yhdm": yhdm, "setTime": setTime, "sxtxlb": sxtxlb },
        processData: true,
        success: function (msg) {
            toastr.success("保存成功!");
            ipc.send('update-set-window');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error("保存失败!");
        }
    });
})
$("#toClose").click(function () {
    ipc.send('close-set-window');
});

function setDataTimePicker(nodeId) {
    $(nodeId).datetimepicker({
        language: 'zh-CN',
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
        showclear: true,
        pickerPosition: 'top-left',
    });
}
$('.toclear').click(function () {
    $('#oripassword').val('');
    $('#newpassword').val('');
    $('#confirmpassword').val('');
})
$(".updatepas").click(function () {
    $(".errorInformation").hide();
    var oripassword = $("#oripassword").val();
    var newPassword = $("#newpassword").val();
    var confirmpassword = $("#confirmpassword").val();
    if (oripassword != yhkl) {
        $(".errorInformation").show();
        $(".errorInformation").css("color", "red");
        $(".errorInformation").text("原密码错误！");
    } else {
        if (newPassword != confirmpassword) {
            $(".errorInformation").show();
            $(".errorInformation").css("color", "red");
            $(".errorInformation").text("新密码不一致！");
        } else {
            $.ajax({
                type: "POST",
                dataType: "text",//返回数据类型
                url: encodeURI(localUrl + '/updateYhkl'),
                data: { "fydm": fydm, "yhdm": yhdm, "yhkl": confirmpassword },
                processData: true,
                success: function (msg) {
                    $(".errorInformation").show();
                    $(".errorInformation").css("color", "black");
                    $(".errorInformation").text("修改成功！");
                },
                error: function (jqXHR, textStatus, errorThrown) {
                }
            });
        }
    }
});

$('.spantext').click(function () {
    $(this).parent('div').children().removeClass('active');
    $(this).addClass('active');
});
function editPas() {
    $('#editpassword').css('display', 'block');
    $('#settingGx').css('display', 'none');
    $('#sysSetting').css('display', 'none');
};
function seByown() {
    $('#editpassword').css('display', 'none');
    $('#settingGx').css('display', 'block');
    $('#sysSetting').css('display', 'none');
};
function SystemSet() {
    $('#editpassword').css('display', 'none');
    $('#settingGx').css('display', 'none');
    $('#sysSetting').css('display', 'block');
};
function Jbset() {
    $('#teamAdlabel').css('color', '#999999');
    $('#jbsetlabel').css('color', '#1e74c2');
    $('#jbimg').attr('src', 'imgs/set-new.png');
    $('#teamimg').attr('src', 'imgs/teamg.png');
    $('#jbsetting').css('display', 'block');
    $('#teamsetting').css('display', 'none');
};
function SysSet() {
    $('#jbsetlabel').css('color', '#999999');
    $('#teamAdlabel').css('color', '#1e74c2');
    $('#jbimg').attr('src', 'imgs/setting.png');
    $('#teamimg').attr('src', 'imgs/teamb.png');
    $('#teamsetting').css('display', 'block');
    $('#jbsetting').css('display', 'none');
};
function newteam() {
    $('#createnew').css('display', 'block');
    $('#editnew').css('display', 'none');
    $('#newmodel').css('display', 'none');
    $('#editmodel').css('display', 'none');
};
function editteam() {
    $('#createnew').css('display', 'none');
    $('#editnew').css('display', 'block');
    $('#newmodel').css('display', 'none');
    $('#editmodel').css('display', 'none');
};

function newModel(){
    $('#createnew').css('display', 'none');
    $('#editnew').css('display', 'none');
    $('#newmodel').css('display', 'block');
    $('#editmodel').css('display', 'none');
}

function setModel() {
    $('#createnew').css('display', 'none');
    $('#editnew').css('display', 'none');
    $('#newmodel').css('display', 'none');
    $('#editmodel').css('display', 'block');
};
$('#cleartext').click(function () {
    $('#teamname').val('');
});
$('#savetext').click(function () {
    var teamname1 = $('#teamname').val();
    teamname = $.trim(teamname1);
    var flag = true;
    $.ajax({
        type: "POST",
        dataType: "JSON",
        url: encodeURI(localUrl + '/getAllTeam'),
        data: { "fydm": fydm },
        processData: true,
        success: function (msg) {
            for (var i = 0; i < msg.length; i++) {
                if (teamname == msg[i].teamname) {
                    toastr.error("该团队民已存在！请重新创建。");
                    flag = false;
                    return;
                }
            }
            if (flag) {
                $.ajax({
                    type: "POST",
                    dataType: "text",
                    url: encodeURI(localUrl + '/NewTeam'),
                    data: { "fydm": fydm, "teamname": teamname },
                    processData: true,
                    success: function (msg) {
                        toastr.success("新建成功！");
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                    }
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });


});
//部分备注信息
function getPartialRemarksHtml(remarks) {
    return remarks.substr(0, 10) + '&nbsp;&nbsp;<a href="javascript:void(0);" ><b>...</b></a>';
}

function selectInitJT(url, id) {
    $.ajax({
        type: "post",
        url: encodeURI(url),
        dataType: "json",
        processData: true,
        success: function (msg) {
            $(id).empty();
            // console.log(msg)
            $(id).append("<option value=\"\">请选择团队名称</option>");
            for (var i = 0; i < msg.length; i++) {
                $(id).append("<option  value=" + msg[i].teamId + ">" + msg[i].teamname + "</option>");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}
function selectInitMD(url, id) {
    $.ajax({
        type: "post",
        url: encodeURI(url),
        dataType: "json",
        processData: true,
        success: function (msg) {
            $(id).empty();
            $(id).append("<option value=\"\">请选择任务类别</option>");
            for (var i = 0; i < msg.length; i++) {
                $(id).append("<option  value=" + msg[i].id + ">" + msg[i].mbName + "</option>");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}
function selectInitClass(url,id){
    $.ajax({
        type: "post",
        url: encodeURI(url),
        dataType: "json",
        processData: true,
        success: function (msg) {
            $(id).empty();
            $(id).append("<option value=\"\">请选择任务内容</option>");
            for (var i = 0; i < msg.length; i++) {
                $(id).append("<option  value=" + msg[i].id + ">" + msg[i].taskms + "</option>");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}

function selectInit(url, id) {
    $.ajax({
        type: "post",
        url: encodeURI(url),
        dataType: "json",
        processData: true,
        success: function (msg) {
            $(id).empty();
            // console.log(msg)
            $(id).append("<option value=\"\">请选择</option>");
            for (var i = 0; i < msg.length; i++) {
                $(id).append("<option  value=" + msg[i] + ">" + msg[i] + "</option>");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}

function selectInitmember(url, id){
    $.ajax({
        type: "post",
        url: encodeURI(url),
        dataType: "json",
        processData: true,
        success: function (msg) {
            $(id).empty();
            // console.log(msg)
            $(id).append("<option value=\"\">请选择</option>");
            for (var i = 0; i < msg.length; i++) {
                $(id).append("<option  value=" + msg[i].memname+ ">" + msg[i].memname + "</option>");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });  
}

function reloadTable(id) {
    table.clear().draw();
    var teamname=$("#selectteam").find("option:selected").text();
    $.ajax({
        type: "post",
        url: encodeURI(localUrl + '/getAllTeamMember'),
        async: true,
        dataType: "json",
        data: {
            teamId: id,
        },
        success: function (data) {
            tabledata = data;
            for (var i = 0; i < data.length; i++) {
                table.row.add(['', data[i].memname, teamname, data[i].role, data[i].memId]).draw();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) { }
    });
}
function reloadTableModel(id) {
    tableModel.clear().draw();
    $.ajax({
        type: "post",
        url: encodeURI(localUrl + '/getTeammodel'),
        async: true,
        dataType: "json",
        data: {
            teamId: id,
        },
        success: function (data) {
            tabledata = data;
            for (var i = 0; i < data.length; i++) {
                tableModel.row.add(['', data[i].mbname, data[i].contentname, data[i].membername,data[i].sx,data[i].id]).draw();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) { }
    });
}
$('.save1').click(function(){
    var mbname = $("#new1modelname").val();
    $.ajax({
        type: "POST",
        dataType: "text",//返回数据类型
        url: encodeURI(localUrl + '/insertModelclass'),
        data: { "mbName": mbname },
        processData: true,
        success: function (msg) {
            selectInitMD(localUrl + '/getallmodel', '#selectcontent');
            toastr.success("保存成功！");
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
})
$('.save2').click(function(){
    var mbid = $("#selectcontent").find("option:selected").val();
    var taskms=$('#newmodelc').val();
    var sx=$("#newmodelsx").val();
    var datans={
        "fid":mbid,
        "taskms":taskms,
        "sx":sx
    }
    $.ajax({
        type: "POST",
        dataType: "text",//返回数据类型
        url: encodeURI(localUrl + '/insertModelTask'),
        data: datans,
        processData: true,
        success: function (msg) {
            toastr.success("保存成功！");
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
})
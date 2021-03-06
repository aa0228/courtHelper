'use strict'

const ipc = require('electron').ipcRenderer;
const session=require('electron').remote.session;
const url = require('url');
const path = require('path');
const fs = require("fs");
var localUrl='http://130.1.67.23:8088';
// $(document).ready(function(){
//     if(getCookies('password')!=null&&getCookies('password')!=''){
//         $("#save_me").attr("checked",true);
//         $("#fydm").val(session.getCookies('fydm'));
//         $(".username .textInput").val(session.getCookies('name'));
//         $(".password .textInput").val(session.getCookies('password'));
//     }else{
//         $("#save_me").attr("checked",false);
//     }
// })
window.onload=function(){
    if(getCookies('password')!=null&&getCookies('password')!=''){
        console.log(getCookies('password'));
        $("#save_me").attr("checked",true);
        $("#fydm").val(getCookies('fydm'));
        $(".username .textInput").val(getCookies('name'));
        $(".password .textInput").val(getCookies('password'));
    }else{
        $("#save_me").attr("checked",false);
    }
}
// $("#save_me").attr("checked",false);
$(".loginForm .loginButton").click(function () {
    $(".errorInformation").hide();
    var fydm=$.trim($("#fydm").val());
    var username = $.trim($(".username .textInput").val());
    var password = $.trim($(".password .textInput").val());

    if(fydm ==""){
        // $(".errorInformation").show();
        // $(".errorInformation").text("请选择法院");
        $("#fyError").show();
        $("#fyError").text("请选择法院");
        $(".fydm #fydm").focus();
        return false; 
    }
    if (username == "") {
        // $(".errorInformation").show();
        // $(".errorInformation").text("请输入用户名");
        $("#nameError").show();
        $("#nameError").text("输入用户名!");
        $(".username .textInput").focus();
        return false;
    }

    if (password == "") {
        // $(".errorInformation").show();
        // $(".errorInformation").text("请输入密码");
        $("#pasError").show();
        $("#pasError").text("输入密码!");
        $(".password .textInput").focus();
        return false;
    }
    $.ajax({
        type: "GET",
        dataType: "json",
        url:encodeURI(localUrl+'/loginIn'),
        data: {fydm: fydm, username: username, password: password },
        error: function () {
            console.info("当前访问的是本地文件登录");
            // readFilePath(username, password);
        },
        success: function (res) {
            console.info("当前访问的是服务器登录");
            console.log(res);
            if (res.result==true) {
                //打开新的窗口
                let userData = res.object;
                ipc.send('open-user-editor', userData);
                ipc.send('tx-clock',userData);
                if ($("#save_me").is(':checked')) {
                    setCookie('fydm',fydm);
                    setCookie('name',username);
                    setCookie('password',password);
                }
            }
            else {
                $("#pasError").show();
                $("#pasError").text(res.msg);
                // $(".errorInformation").text("用户名或密码错误!");
            }
        }
    });
});

//  保存cookie
let setCookie=(name,value)=>{
    let Days=365;
    let exp=new Date();
    let date=Math.round(exp.getTime()/1000)+Days*24*60*60;
    const cookie={
        url:encodeURI(localUrl+'/loginIn'),
        name:name,
        value:value,
        expirationDate:date
    };
    session.defaultSession.cookies.set(cookie,(error)=>{
        if(error) console.error(error);
    });
};

// 清除缓存
let clearCookies = () => {
    session.defaultSession.clearStorageData({
      origin:localUrl+'/loginIn',//替换掉登录地址
      storages: ['cookies']
    }, function (error) {
      if (error) console.error(error);
    })
  };
//获取cookie

let getCookies = (name) => {
    session.defaultSession.cookies.get({ url: "http://130.1.67.23:8088/loginIn" }, function (error, cookies) {
      console.log(cookies);
      for(var i=0;i<cookies.length;i++){
          if(name==cookies[i].name) return cookies[i].value;
          else  return false;
      }
    });
  };

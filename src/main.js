'use strict'

const electron = require('electron');
const {app, BrowserWindow,Menu,Tray} = require('electron');
const url = require('url');
const path = require('path');
const ipc = electron.ipcMain;//主进程中的通信，在主进程中使用，用来处理渲染进程（网页）发送同步和异步的信息



let mainWindow = null;
let trayIcon =null;
let appTray =null;

// const WinReg=require('winreg');

// const mainWin = BrowserWindow.fromId(global.mainId);
// mainWin.webContents.on('crashed',()=>{
// 	const options={
// 		type:'error',
// 		title:'进程崩溃了',
// 		message:'这个进程已经崩溃',
// 		buttons:['重载','退出'],
// 	};
// 	recordCrash().then(()=>{
// 		dialog.showMessageBox(options,(index)=>{
// 			if(index===0) reloadWindow(mainWin);
// 			else app.quit();
// 		});
// 	}).catch((e)=>{
// 		console.log('err',e);
// 	});
// })

//开机自启动
// const startOnBoot = {
// 	enableAutoStart: function (name, file, callback) {
// 	  var key = getKey();
// 	  key.set(name, WinReg.REG_SZ, file, callback || noop);
// 	},
// 	disableAutoStart: function (name, callback) {
// 	  var key = getKey();
// 	  key.remove(name, callback || noop);
// 	},
// 	getAutoStartValue: function (name, callback) {
// 	  var key = getKey();
// 	  key.get(name, function (error, result) {
// 		if (result) {
// 		  callback(result.value);
// 		}
// 		else {
// 		  callback(null, error);
// 		}
// 	  });
// 	}
//   };


//创建登录窗口,创建系统托盘必须在app加载完毕后
function createWindow() {
	mainWindow = new BrowserWindow({
		width: 535,
		height: 500,
		transparent: true,
		frame: false,
		resizable: false,
		maximizable: false,
		title:"法官提醒小助手",
	//	skipTaskbar:false,
		alwaysOnTop:true,
	});

	//加载页面之加载本地文件
	const URL = url.format({
		pathname: path.join(__dirname, 'app/index.html'),
		protocol: 'file',
		slashes: true
	});

	mainWindow.loadURL(URL);//装载hh登录页面

	//mainWindow.webContents.openDevTools();
	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	mainWindow.webContents.on('crashed',()=>{
		const options={
			type:'error',
			title:'进程崩溃了',
			message:'这个进程已经崩溃',
			buttons:['重载','退出'],
		};
		recordCrash().then(()=>{
			dialog.showMessageBox(options,(index)=>{
				if(index===0) reloadWindow(mainWindow);
				else app.quit();
			});
		}).catch((e)=>{
			console.log('err',e);
		});
	});
	

 trayIcon = path.join(__dirname, 'app/imgs');//app是选取的目录 
	
 appTray = new Tray(path.join(trayIcon, 'CourtIco.ico'));
//let appTray=new Tray('src/app/imgs/CourtIco.ico');//系统托盘图标

const contextMenu = Menu.buildFromTemplate([
	{
		 label: '设置',
		click: function () {} //打开相应页面
	},
	{
		label: '帮助',
	    click: function () {}
	},
	{
		label: '关于',
		click: function () {}
	},
	{
		label: '显示',
		click: function () {
			userEditorWindow.show();
		}
	},
	{
		label: '隐藏',
		click: function () {
			userEditorWindow.hide();
		}
	},
    {
		label: '退出',
        click: function(){
            app.quit();
        }
    }
]);
appTray.setToolTip('法官提醒小助手');
appTray.setContextMenu(contextMenu);//系统托盘程序右键菜单

//系统托盘图标闪烁 (设置了定时)
// var count = 0,timer = null;
//     timer=setInterval(function() {
//         count++;
//         if (count%2 == 0) {
//             appTray.setImage(path.join(trayIcon, 'CourtIco.ico'))
//         } else {
//             appTray.setImage(path.join(trayIcon, 'empty.ico'))
//         }
//     }, 600);

    //单点击 1.主窗口显示隐藏切换 2.清除闪烁
//     appTray.on("click", function(){
//         if(!!timer){
//             appTray.setImage(path.join(trayIcon, 'CourtIco.ico'))
//             //主窗口显示隐藏切换
//             userEditorWindow.isVisible() ? userEditorWindow.hide() : userEditorWindow.show();
//         }
// })

}




// function recordCrash() { 
//     return new Promise(resolve => { 
//        // 崩溃日志请求成功.... 
//       resolve();
//     })
// }
// function reloadWindow(mainWindow){
// 	if(mainWindow.isDestroyed()){
// 		app.relaunch();
// 		app.exit(0);
// 	}else{
// 		BrowserWindow.getAllWindows().forEach((w)=>{
// 			if(w.id!==mainWindow.id) w.destroy();
// 		});
// 		mainWindow.reload();
// 	}
// }


//注册表，用于开机自启
// const RUN_LOCATION = '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run';
// function getKey() {
//   return new WinReg({
//     hive: WinReg.HKCU, //CurrentUser,
//     key: RUN_LOCATION
//   });
// }
// //注册表，用于开机自启
// export default function autoStart() {
//   startOnBoot.getAutoStartValue('MY_CLIENT_AUTOSTART', function (value) {
//     if (!value) {
//       startOnBoot.enableAutoStart('MY_CLIENT_AUTOSTART', process.execPath, function () { console.log('开机自动启设置'); });
//     }
//   });
// }


//主界面
let userEditorWindow = null;

//监听是否打开该窗口，监听渲染程序发来的事件
ipc.on('open-user-editor', (event,message) => {

	if (mainWindow) {
		mainWindow.hide();
	}

	if (userEditorWindow) {
		return;
	}
	//创建用户编辑窗口
	userEditorWindow = new BrowserWindow({
		frame: false,//去掉边框
		height: 1200,
		//resizable:false,
		width: 1000,//500
		//maximizable:true,
		transparent: true,
		x:800,
		y:10,
		minheight:800,
		maxwidth:1000,//500
		skipTaskbar:true,//是否在任务栏中显示
	});
	const user_edit_url = url.format({
		pathname: path.join(__dirname, 'app/showUser.html'),
		protocol: 'file',
		slashes: true
	});

	userEditorWindow.loadURL(user_edit_url);
   
	//userEditorWindow.loadURL('http://localhost:3000');//网络路径加载

	

	userEditorWindow.webContents.openDevTools();//打开开发工具界面

	if(message!=undefined){
		userEditorWindow.webContents.on('did-finish-load', function () {
			userEditorWindow.webContents.send('loginUserData', message);
		});
	}

	userEditorWindow.on('closed', () => {
		userEditorWindow = null;
	});

});



//接收最小化通信
ipc.on('mini-user-editor-window', () => {
	userEditorWindow.minimize();
});

ipc.on('turn-small-user-editor', () => {
	userEditorWindow.unmaximize();
});

ipc.on('turn-big-user-editor', () => {
	userEditorWindow.maximize();
});


//修改用户窗口点击关闭时触发
ipc.on('close-user-editor-window', () => {
	if (userEditorWindow) {
		userEditorWindow.hide();
		//userEditorWindow.close();
	}
	if (mainWindow) {
		mainWindow.destroy();
		app.quit();
	}

});
//接收到消息后执行的程序，news是自定义命令，只要与页面发送过来的命令一致
// ipc.on('news',function(event, message){
//   alert(message);
// })


app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform != 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow == null) {
		createWindow();
	}

});

//设置菜单
let dockMenu = Menu.buildFromTemplate([
    {
		label: '文件',
		 click: function () {
            console.log('点击事件');
        }
    },
    {
		label: '编辑',
		 submenu: [
            {label: '保存'},
            {label: '另存'}
        ]
    },
    {label: '帮助'}
]);
Menu.setApplicationMenu(dockMenu);



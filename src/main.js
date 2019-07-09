'use strict'

const electron = require('electron');
const {app, BrowserWindow,Menu,Tray} = require('electron');
const url = require('url');
const path = require('path');
const ipc = electron.ipcMain;//主进程中的通信，在主进程中使用，用来处理渲染进程（网页）发送同步和异步的信息


let mainWindow = null;
let userEditorWindow = null;
let settingWindow = null;
let newCreateWindow=null;
let teamworkWindow=null;
let trayIcon =null;
let appTray =null;
let txWindow=null;
let screenx=0;
let screeny=0;
let timer = null;
let specificTaskWindow=null;

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
		width: 533,
		height: 500,
		transparent: true,
		frame: false,
		resizable: true,
		maximizable: false,
		title:"法官提醒助手",
		skipTaskbar:false,
		alwaysOnTop:true,
	});

	var electronScreen=electron.screen;
	var size=electronScreen.getPrimaryDisplay().workAreaSize;
	screenx=size.width;
	screeny=size.height;
	//加载页面之加载本地文件
	const URL = url.format({
		pathname: path.join(__dirname, 'app/index.html'),
		protocol: 'file',
		slashes: true
	});

	mainWindow.loadURL(URL);//装载hh登录页面

//	mainWindow.webContents.openDevTools();
	
    //回收BrowserWindow对象  
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

//监听是否打开该窗口，监听渲染程序发来的事件
ipc.on('open-user-editor', (event,message) => {

	if (mainWindow) {
		mainWindow.hide();
	}

	if (userEditorWindow) {
		return;
	}
	var swidth=screenx-345;
	var sheight=screeny+100;
	//创建用户编辑窗口
	userEditorWindow = new BrowserWindow({
		frame: false,//去掉边框
		height:sheight,//900
		maxHeight: 1200,
		resizable:true,
		width: 380,//320
		maximizable:true,
		minimizable:true,
		minWidth:380,
		// maxWidth:380,
		minHeight:700,
		transparent: true,
		x:swidth,
		y:2,
		maxWidth:1200,//500
		skipTaskbar:true,//是否在任务栏中显示
	});
	const user_edit_url = url.format({
		pathname: path.join(__dirname, 'app/showUser.html'),
		protocol: 'file',
		slashes: true
	});

	userEditorWindow.loadURL(user_edit_url);
   

	trayIcon = path.join(__dirname, 'app/imgs');//app是选取的目录 	
    appTray = new Tray(path.join(trayIcon, 'Court128.ico'));
    const contextMenu = Menu.buildFromTemplate([
	{
		 label: '注销账号',
		click: function () {
			if (userEditorWindow) {
				userEditorWindow.destroy();
			}
			if(newCreateWindow){
				newCreateWindow.destroy();
			}
			if(settingWindow){
				settingWindow.destroy();
			}
			if(txWindow){
				txWindow.destroy();
			}
			if(appTray){
				appTray.destroy();
			}if(teamworkWindow){
				teamworkWindow.destroy();
			}
			if(specificTaskWindow){
				specificTaskWindow.destroy();
			}
			mainWindow.show();
		} 
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
    appTray.setToolTip('法官助手');//设置此托盘图标的悬停提示内容
	appTray.setContextMenu(contextMenu);//系统托盘程序右键菜单
  //  userEditorWindow.webContents.openDevTools();//打开开发工具界面

	if(message!=undefined){
		userEditorWindow.webContents.on('did-finish-load', function () {
			userEditorWindow.webContents.send('loginUserData', message);
		});
	}

	userEditorWindow.on('closed', () => {
		userEditorWindow = null;
	});
});



	//系统托盘图标闪烁 (设置了定时)
function showclick(){
	var count = 0;
	timer=setInterval(function() {
		count++;
		if (count%2 == 0) {
			appTray.setImage(path.join(trayIcon, 'Court128.ico'));
		} else {
			appTray.setImage(path.join(trayIcon, 'empty.ico'));
		}
	}, 600);
	
	//   单点击 1.主窗口显示隐藏切换 2.清除闪烁
	appTray.on("click", function(){
		if(!!timer){
			appTray.setImage(path.join(trayIcon, 'Court128.ico'));
			//主窗口显示隐藏切换
			// clearInterval(timer);
			if(txWindow){
				txWindow.show();
			}
		}
		if(userEditorWindow){
			userEditorWindow.isVisible() ? userEditorWindow.hide() : userEditorWindow.show();
		}
	})
}
 

ipc.on('tx-clock',(event,message)=>{
	if(txWindow){
		txWindow.show();
	}else{
		var swidth=screenx-595;
		var sheight=screeny-265;
		txWindow=new BrowserWindow({
			frame: false,//去掉边框
			height:265,
			resizable:false,
			width: 260,//260
			maximizable:true,
			transparent: true,//
			x:swidth,
			y:sheight,
			maxwidth:500,//500
			title:'提醒消息',
			skipTaskbar:false,//是否在任务栏中显示
			alwaysOnTop:true,//始终在其他窗口的上层
			icon:'./app/imgs/CourtIco.ico',
		});
		const tx_edit_url = url.format({
			// pathname: path.join(__dirname, 'app/txsl.html'),
			pathname: path.join(__dirname, 'app/ntxtk.html'),
			protocol: 'file',
			slashes: true
		});
		txWindow.loadURL(tx_edit_url);
		if(message!=undefined){
			txWindow.webContents.on('did-finish-load', function () {
				txWindow.webContents.send('setTxData', message);
			});
		}
		txWindow.on('closed', () => {
			txWindow = null;
		});
//		txWindow.webContents.openDevTools();
//		txWindow.hide();
		showclick();
	}
});


ipc.on('look-set',(event,message)=>{
	settingWindow = new BrowserWindow({
		frame: false,//去掉边框
		height:500,//480
		minHeight:610,
		resizable:true,
		width: 660,//600
		maximizable:true,
		minWidth:440,
		transparent: true,//
		x:300,
		y:100,
		maxWidth:1200,//500
		skipTaskbar:false,//是否在任务栏中显示
		title:"设置",
	});
	const user_edit_url = url.format({
		pathname: path.join(__dirname, 'app/setting.html'),
		protocol: 'file',
		slashes: true
	});
	settingWindow.loadURL(user_edit_url);

	if(message!=undefined){
		settingWindow.webContents.on('did-finish-load', function () {
			settingWindow.webContents.send('setUserData', message);
		});
	}
	settingWindow.on('closed', () => {
		settingWindow = null;
	});
//	settingWindow.webContents.openDevTools();
});
ipc.on('new-record',(event,message)=>{
	newCreateWindow = new BrowserWindow({
		frame: false,//去掉边框
		height:539,
		resizable:true,
		width: 541,//500
		maximizable:true,
		transparent: true,
		x:50,
		y:50,
		skipTaskbar:false,//是否在任务栏中显示
		title:"创建提醒",
	});
	const user_new_url = url.format({
		pathname: path.join(__dirname, 'app/newSW.html'),
		protocol: 'file',
		slashes: true
	});
	newCreateWindow.loadURL(user_new_url);
	if(message!=undefined){
		newCreateWindow.webContents.on('did-finish-load', function () {
			newCreateWindow.webContents.send('newData', message);
		});
	}
	newCreateWindow.on('closed', () => {
		newCreateWindow = null;
	});	
//	newCreateWindow.webContents.openDevTools();
});

ipc.on('teamwork',(event,message)=>{
	teamworkWindow =new BrowserWindow({
		frame: false,//去掉边框
		height:690,
		resizable:true,
		width: 550,
		maximizable:true,
		transparent: true,
		x:100,
		y:30,
		skipTaskbar:false,//是否在任务栏中显示
		title:"团队协作",
	});
	const user_new_url = url.format({
		pathname: path.join(__dirname, 'app/teamwork.html'),
		protocol: 'file',
		slashes: true
	});
	teamworkWindow.loadURL(user_new_url);
	if(message!=undefined){
		teamworkWindow.webContents.on('did-finish-load', function () {
			teamworkWindow.webContents.send('teamworkData', message);
		});
	}
	teamworkWindow.on('closed', () => {
		teamworkWindow = null;
	});	
//	teamworkWindow.webContents.openDevTools();
});


ipc.on('specificTask',(event,message)=>{
	specificTaskWindow =new BrowserWindow({
		frame: false,//去掉边框
		height:600,
		maxHeight:750,
		resizable:true,
		width: 940,
		maxWidth:1200,
		maximizable:true,
		transparent: true,
		x:70,
		y:30,
		skipTaskbar:false,//是否在任务栏中显示
		title:"任务内容",
	});
	const user_new_url = url.format({
		pathname: path.join(__dirname, 'app/specificTask.html'),
		protocol: 'file',
		slashes: true
	});
	specificTaskWindow.loadURL(user_new_url);
	if(message!=undefined){
		specificTaskWindow.webContents.on('did-finish-load', function () {
			specificTaskWindow.webContents.send('specificTaskData', message);
		});
	}
	specificTaskWindow.on('closed', () => {
		specificTaskWindow = null;
	});	
	specificTaskWindow.webContents.openDevTools();
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

ipc.on('close-tx-window',()=>{
	if (txWindow) {
		txWindow.destroy();
		appTray.setImage(path.join(trayIcon, 'Court128.ico'));
		clearInterval(timer);
	}
});

ipc.on('closespecificTask',()=>{
	specificTaskWindow.destroy();
});
ipc.on('closeteamTask',()=>{
	teamworkWindow.destroy();
})
ipc.on('hide-tx-window',()=>{
	txWindow.hide();
});

ipc.on('open-main-windows',()=>{
	if (userEditorWindow) {
		userEditorWindow.show();
	}
});

//修改用户窗口点击关闭时触发
ipc.on('close-user-editor-window', () => {
	if (userEditorWindow) {
		userEditorWindow.hide();
	}
});
ipc.on('close-set-window', () => {
	if (settingWindow) {
		settingWindow.destroy();
	}
});
ipc.on('close-new-window',()=>{
	if (newCreateWindow) {
		newCreateWindow.destroy();
	}
})
//信息修改后的重新显示
ipc.on('update-set-window',()=>{
	if (userEditorWindow) {
		userEditorWindow.destroy();
	}
	if(newCreateWindow){
		newCreateWindow.destroy();
	}
	if(settingWindow){
		settingWindow.destroy();
	}
	if(txWindow){
		txWindow.destroy();
	}
	if(appTray){
		appTray.destroy();
	}
	mainWindow.show();
});

ipc.on('get-new-window', () => {
	if (txWindow) {
		txWindow.destroy();
	}
	if (newCreateWindow) {
		newCreateWindow.destroy();
	}
    
});


ipc.on('open-main-windows-1',()=>{
	var message=2;
	if(userEditorWindow.isVisible()==false){
		userEditorWindow.show();
	}
	userEditorWindow.webContents.send('open-cx-1',message);
});
ipc.on('open-main-windows-2',()=>{
	var message=2;
	if(userEditorWindow.isVisible()==false){
		userEditorWindow.show();
	}
	userEditorWindow.webContents.send('open-cx-2',message);
});
ipc.on('open-main-windows-3',()=>{
	var message=2;
	if(userEditorWindow.isVisible()==false){
		userEditorWindow.show();
	}
    userEditorWindow.webContents.send('open-cx-3',message);

});
ipc.on('open-main-windows-4',()=>{
	var message=2;
	if(userEditorWindow.isVisible()==false){
		userEditorWindow.show();
	}
	userEditorWindow.webContents.send('open-cx-4',message);

});
ipc.on('open-main-windows-5',()=>{
	var message=2;
	if(userEditorWindow.isVisible()==false){
		userEditorWindow.show();
	}
	userEditorWindow.webContents.send('open-cx-5',message);
});


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
import
electron,
{
	BrowserWindow,
	app as ElectronApp,
	Menu,
	Tray,
	nativeImage,
	ipcMain,
	dialog,
	screen
}
	from "electron";
import _ from "underscore";
const metadata = require("../../package");
const { shell } = require("electron");
const { autoUpdater } = require("electron-updater");
var feedUrl = `https://download-sdk.oss-cn-beijing.aliyuncs.com/mp/sandbox/${process.platform}`;
const IS_MAC_OSX = process.platform === "darwin";
if(DEBUG && process.type === "renderer"){
	console.error("AppRemote must run in main process.");
}

class AppRemote {
	constructor(){
		let me = this;
		this.windows = {};
		this.cancelConfrId = {};
		this.isAnswered = false;
		ipcMain.on("open-file", (e, filePath) => {
			shell.showItemInFolder(filePath);
		});

		// 设置未读消息数
		ipcMain.on("receive-unread-msg", (e, badge) => {
			badge > 0 ? this.flashTrayIcon() : this.flashTrayIcon(false);
			if(process.platform == "darwin"){
				if(badge > 0){
					ElectronApp.dock.setBadge(badge.toString());
				}
				else if(badge > 99){
					ElectronApp.dock.setBadge("99+");
				}
				else{
					ElectronApp.dock.setBadge("");
				}
			}
		});

		ipcMain.on("open-url", (e, url) => {
			shell.openExternal(url);
		});

		// 音视频窗口
		ipcMain.on("receive-audio-and-video", (e, userInfo, conversationId, inviterInfo, logintoken, isVideo, isInvited, isGroup, groupInfo, allMembersInfo, conference) => {
			this.createAudioVideoWindow(userInfo, conversationId, inviterInfo, logintoken, isVideo, isInvited, isGroup, groupInfo, allMembersInfo, conference);
		});

		ipcMain.on("audio-video-hangup", (event, conversationId, confrId, isGroup, conferenceMsg, timeout) => {
			console.log(conversationId, confrId, isGroup, conferenceMsg, timeout);
			delete this.windows[confrId];
			this.audioAndVideoWindow && this.audioAndVideoWindow.close(confrId);
			this.mainWindow.webContents.send("active-hangup", conversationId, confrId, isGroup, conferenceMsg, timeout);
		});

		// 邀请群成员加入会议
		ipcMain.on("audio-video-addmember", (event, conversationId) => {
			this.mainWindow.webContents.send("audio-video-addmember", conversationId);
		});

		// 接通后改变窗口的位置和大小
		ipcMain.on("audio-video-answered", (event, conferenceId, isVideo) => {
			// this.audioAndVideoWindow && this.audioAndVideoWindow.close();
			console.log("audio-video-answer");
			this.isAnswered = true;
			clearInterval(this.audioVideoWindowTimer);
			this.audioAndVideoWindow.center();
			this.changeWindow(isVideo);
			this.mainWindow.webContents.send("audio-video-answered", conferenceId);
		});

		ipcMain.on("audio-video-joined-error", (event, confrId, isGroup, isVideo) => {
			delete this.windows[confrId];
			this.audioAndVideoWindow && this.audioAndVideoWindow.close(confrId);
			this.mainWindow.webContents.send("audio-video-joined-error");
		});

		// 接收到对方挂断或拒绝的信息
		ipcMain.on("audio-video-receive-hangup", (event, confrId, conversationId, from, to, isGroup) => {
			this.cancelConfrId[confrId] = true;
			console.log("confrId");
			console.log(confrId);
			clearInterval(this.audioVideoWindowTimer);
			console.log(confrId, conversationId, from, to, isGroup);
			this.audioAndVideoWindow && this.audioAndVideoWindow.webContents.send("audio-video-receive-hangup", confrId, conversationId, from, to, isGroup);
		});

		// 收到切换为语音通话的消息
		ipcMain.on("audio-video-forwardto_voice", () => {
			this.audioAndVideoWindow && this.audioAndVideoWindow.webContents.send("audio-video-forwardto_voice");
		});

		ipcMain.on("originator-join-conference", (event, conference, isGroup) => {
			this.mainWindow.webContents.send("originator-join-conference", conference, isGroup);
		});

		// 消息右键菜单
		ipcMain.on("show-context-menu", (event, fromMe, isAllowRecall, type, openFilePath, fileName, remotePath) => {
			this.openFilePath = openFilePath;
			this.saveFileName = fileName;
			this.remotePath = remotePath;
			switch(type){
			case "TEXT":
			case "AUDIO":
			case "LOCATION":
				me.contextMenuTemplate = _.clone(me.textMenuTemplate);
				break;
			case "IMAGE":
			case "FILE":
			case "VIDEO":
				me.contextMenuTemplate = _.clone(me.mediaMenuTemplate);
				!me.openFilePath && me.contextMenuTemplate.splice(1, 1, { label: "打开文件夹", click(){ me.openItemInFolder();}, enabled: false });
				break;
			default:
				me.contextMenuTemplate = _.clone(me.textMenuTemplate);
			}
			if(fromMe && isAllowRecall){
				me.contextMenuTemplate.splice(me.contextMenuTemplate.length - 1, 0, { label: "撤回", click(){ me.mainWindow.webContents.send("recallMessage"); } });
				Menu.buildFromTemplate(me.contextMenuTemplate).popup(this.mainWindow);
			}
			else if(fromMe && !isAllowRecall){
				me.contextMenuTemplate.splice(me.contextMenuTemplate.length - 1, 0, { label: "撤回(已超过两分钟)", enabled: false });
				Menu.buildFromTemplate(me.contextMenuTemplate).popup(this.mainWindow);
			}
			else{
				Menu.buildFromTemplate(me.contextMenuTemplate).popup(this.mainWindow);
			}
		});

		// 会话列表右键菜单
		ipcMain.on("conversation-context-menu", (event, conversationId) => {
			let me = this;
			let conversationMenuTemplate = [
				{ label: "删除", click(){ me.mainWindow.webContents.send("deleteConversation", { conversationId }); } },
			];
			console.log("combaknversation-context-menu");
			Menu.buildFromTemplate(conversationMenuTemplate).popup(this.mainWindow);
		});

		// 收到更新通知
		ipcMain.on("receive-client-upgrade", (event) => {
			console.log("receive-client-upgrade");
			this.checkForAutoUpdate();
		});

		// 音视频通话处理设备同步
		ipcMain.on("audio-video-client-sync", (event, conferenceId) => {
			if(this.windows[conferenceId]){
				console.log("audio-video-client-sync");
				this.windows[conferenceId].close(conferenceId);
				this.mainWindow.webContents.send("audio-video-client-sync");
				delete this.windows[conferenceId];
			}
		});

	}

	init(entryPath){
		if(!entryPath){
			throw new Error("Argument entryPath must be set on init app-remote.");
		}
		this.entryPath = entryPath;
		this.mainWindow = null;
	}

	ready(){
		this.openMainWindow();
		this.initTrayIcon();
	}

	createAudioVideoWindow(userInfo, conversationId, inviterInfo, logintoken, isVideo, isInvited, isGroup, groupInfo, allMembersInfo, conference){
		let x = screen.getPrimaryDisplay().size.width - 260;
		let name = conference ? JSON.parse(conference).confrId : "video";
		let options = {
			width: 260,
			height: 260,
			minWidth: 260,
			minHeight: 260,
			autoHideMenuBar: !IS_MAC_OSX,
			backgroundColor: "#465d78",
			frame: true,
			titleBarStyle: "hidden",
			webPreferences: { webSecurity: false },
			thickFrame: true,
			show: false,
			x,
			y: 30,
			resizable: false, // 设置窗口是否可以改变大小
			url: "video.html",
			hashRoute: "/video",
			name
		};
		this.isInvited = isInvited;
		this.isAnswered = false;
		// 有未结束的通话
		if(this.audioAndVideoWindow){
			this.mainWindow.webContents.send("audio-video-not-finished");
		}
		else if((inviterInfo && conference && !this.cancelConfrId[JSON.parse(conference).confrId]) || !conference){
			let audioAndVideoWindow = new BrowserWindow(options);
			this.audioAndVideoWindow = audioAndVideoWindow;
			this.windows[name] = this.audioAndVideoWindow;
			audioAndVideoWindow.webContents.on("did-frame-finish-load", () => {
				audioAndVideoWindow.webContents.send(
					"audio_video_window_load",
					userInfo,
					conversationId,
					inviterInfo,
					logintoken,
					isVideo,
					isInvited,
					isGroup,
					groupInfo,
					allMembersInfo,
					conference
				);
				this.time = 0;
				this.audioVideoWindowTimer = setInterval(() => {
					this.time++;
					console.log("this.isAnswered", this.isAnswered);
					if((this.time >= 30 && !this.isAnswered && !isGroup) || (this.time >= 30 && !this.isAnswered && isGroup && isInvited)){
						this.audioAndVideoWindow.webContents.send("audio_video_timeout");
					}
				}, 1000);
			});
			if(!isInvited){
				audioAndVideoWindow.center();
				this.changeWindow(isGroup || (!isGroup && isVideo));
			}

			audioAndVideoWindow.once("ready-to-show", () => {
				audioAndVideoWindow.show();
			});

			let url = options.url;
			if(!url.startsWith("file://") && !url.startsWith("http://") && !url.startsWith("https://")){
				url = `file://${this.entryPath}/${options.url}`;
			}
			if(DEBUG){
				url += "?react_perf";
			}
			if(options.hashRoute){
				url += `#${options.hashRoute}`;
			}
			audioAndVideoWindow.loadURL(url);
			audioAndVideoWindow.webContents.openDevTools();


			audioAndVideoWindow.on("close", (event, confrId) => {
				console.log(confrId);
				clearInterval(this.audioVideoWindowTimer);
				console.log("audio_video_window_close");
				this.windows[confrId] && this.windows[confrId].webContents.send("audio_video_window_close");
				this.closeAudioVideoWindow();
			});
		}
	}

	changeWindow(isVideo){
		if(isVideo){
			this.audioAndVideoWindow.setSize(690, 460, true);
			this.audioAndVideoWindow.setMinimumSize(690, 460);
			this.audioAndVideoWindow.setResizable(true);
			// 设置宽高比
			this.audioAndVideoWindow.setAspectRatio(1.5);
		}
		else{
			this.audioAndVideoWindow.setSize(390, 260, true);
			this.audioAndVideoWindow.setResizable(false);
		}
	}

	closeAudioVideoWindow(){
		if(this.audioAndVideoWindow){
			this.audioAndVideoWindow.hide();
			this.audioAndVideoWindow = null;
		}
	}

	initTrayIcon(){
		var trayMenuTemplate = [
			{
				label: "退出",
				click: () => {
					this.quit();
				}
			},
		];
		if(process.platform === "win32"){
			trayMenuTemplate.unshift(
				{
					label: "关于",
					click: () => {
						this.showAboutWindow();
					}
				},
			);
		}
		if(this.tray){
			this.tray.destroy();
		}
		// Make tray icon
		const tray = new Tray(`${this.entryPath}/media/img/tray-icon-16.png`);
		const trayContextMenu = Menu.buildFromTemplate(trayMenuTemplate);
		tray.setToolTip("环信移动门户");
		tray.on("click", () => {
			this.openMainWindow();
		});
		tray.on("right-click", () => {
			tray.popUpContextMenu(trayContextMenu);
		});
		this.tray = tray;
		this._trayIcons = [
			nativeImage.createFromPath(`${this.entryPath}/media/img/tray-icon-16.png`),
			nativeImage.createFromPath(`${this.entryPath}/media/img/tray-icon-transparent.png`)
		];
		this._trayIconCounter = 0;
	}

	flashTrayIcon(flash = true){
		if(flash){
			if(!this._flashTrayIconTask){
				this._flashTrayIconTask = setInterval(() => {
					this.tray.setImage(this._trayIcons[(this._trayIconCounter++) % 2]);
				}, 400);
			}
		}
		else{
			if(this._flashTrayIconTask){
				clearInterval(this._flashTrayIconTask);
				this._flashTrayIconTask = null;
			}
			this.tray.setImage(this._trayIcons[0]);
		}
	}

	openMainWindow(){
		if(this.mainWindow === null){
			this.createMainWindow();
		}
		else{
			console.log("MainWindow already");
			this.mainWindow.show();
			this.mainWindow.focus();
			this.flashTrayIcon(false);
		}
	}

	createMainWindow(){
		var name;
		var me = this;
		let options = {
			width: 900,
			height: 650,
			minWidth: 900,
			minHeight: 650,
			url: "index.html",
			hashRoute: "/index",
			name: "main",
			resizable: true,
			debug: true,
			autoHideMenuBar: !IS_MAC_OSX,
			backgroundColor: "#465d78",
			show: DEBUG,
			frame: true,
			titleBarStyle: "hidden",
			webPreferences: { webSecurity: false },
			thickFrame: true,
			showAfterLoad: true,
		};

		if(DEBUG){
			const display = electron.screen.getPrimaryDisplay();
			options.height = display.workAreaSize.height;
			options.width = 800;
			options.x = display.workArea.x;
			options.y = display.workArea.y;
		}
		// this.mainWindow = this.createWindow(options);

		this.isUpdating = false;

		let browserWindow = new BrowserWindow(options);
		// if(browserWindow){
		// 	throw new Error(`The window with name '${name}' has already be created.`);
		// }
		this.mainWindow = browserWindow;

		browserWindow.on("close", (event) => {
			// dock 上右键退出，ElectronApp.quitting = true
			if(!ElectronApp.quitting && !this.isUpdating){
				event.preventDefault();
				this.mainWindow.hide();
			}
		});

		browserWindow.on("closed", () => {
			this.mainWindow = null;
		});

		browserWindow.webContents.on("did-finish-load", () => {
			if(options.showAfterLoad){
				if(options.beforeShow){
					options.beforeShow(browserWindow, name);
				}
				browserWindow.show();
				browserWindow.focus();
				if(options.afterShow){
					options.afterShow(browserWindow, name);
				}
			}
			if(options.onLoad){
				options.onLoad(browserWindow);
			}
		});

		let url = options.url;
		if(url){
			if(!url.startsWith("file://") && !url.startsWith("http://") && !url.startsWith("https://")){
				url = `file://${this.entryPath}/${options.url}`;
			}
			if(DEBUG){
				url += "?react_perf";
			}
			if(options.hashRoute){
				url += `#${options.hashRoute}`;
			}
			browserWindow.loadURL(url);
		}

		// 定义文字快捷菜单
		this.textMenuTemplate = [
			// { label: "复制", click(){ me.copySelect();} },
			// { type: "separator" },
			{ label: "删除", click(){ browserWindow.webContents.send("deleteMessage"); } }
		];

		// 定义多媒体快捷菜单
		this.mediaMenuTemplate = [
			// { label: "复制", role: "copy" },
			{ label: "存储...", click(){ me.saveFile(); } },
			// { type: "separator" },
			{ label: "打开文件夹", click(){ me.openItemInFolder();} },
			{ type: "separator" },
			{ label: "删除", click(){ browserWindow.webContents.send("deleteMessage"); } }
		];

		if(options.debug){
			// browserWindow.openDevTools();
			browserWindow.webContents.on("context-menu", (e, props) => {
				const { x, y } = props;
				Menu.buildFromTemplate([{
					label: "审查元素",
					click(){
						browserWindow.inspectElement(x, y);
					}
				}]).popup(browserWindow);
			});
		}

		setTimeout(this.checkForAutoUpdate.bind(this), 1000);
	}

	checkForAutoUpdate(){
		// 自动更新
		let sendUpdateMessage = (message, data) => {
			this.mainWindow.webContents.send("message", { message, data });
		};

		autoUpdater.setFeedURL(feedUrl);

		autoUpdater.on("error", function(message){
			sendUpdateMessage("error", message);
		});
		autoUpdater.on("checking-for-update", function(message){
			sendUpdateMessage("checking-for-update", message);
		});
		autoUpdater.on("update-available", function(message){
			sendUpdateMessage("update-available", message);
		});
		autoUpdater.on("update-not-available", function(message){
			sendUpdateMessage("update-not-available", message);
		});

		// 更新下载进度事件
		autoUpdater.on("download-progress", function(progressObj){
			sendUpdateMessage("downloadProgress", progressObj);
		});
		autoUpdater.on("update-downloaded", (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) => {
			ipcMain.on("updateNow", (e, arg) => {
				// some code here to handle event
				autoUpdater.quitAndInstall();
			});
			this.isUpdating = true;
			sendUpdateMessage("isUpdateNow", event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate);
		});

		// 执行自动更新检查
		autoUpdater.checkForUpdates();
	}

	// 复制
	copySelect(){
		this.mainWindow.webContents.send("copiedValue");
	}

	// 打开所在文件夹
	openItemInFolder(){
		this.openFilePath && shell.showItemInFolder(this.openFilePath);
	}

	saveFile(){
		var me = this;
		var name = this.saveFileName.split(".");
		var ext = name.length > 1 ? name[name.length - 1] : "*";
		var remotePath = this.remotePath;
		const options = {
			filters: [
				{ name: this.saveFileName, extensions: [ext] }
			]
		};
		dialog.showSaveDialog(options, function(filePath){
			me.mainWindow.webContents.send("savedFile", { filePath, remotePath });
		});
	}

	showAboutWindow(){
		const options = {
			type: "info",
			title: "Information",
			message: `${metadata.productName} 版本${metadata.version}`,
			buttons: ["关闭"]
		};
		dialog.showMessageBox(options, function(index){
			// event.sender.send("information-dialog-selection", index);
		});
	}

	closeMainWindow(){
		if(this.mainWindow){
			this.mainWindow.close();
		}
	}

	quit(){
		this.closeMainWindow();
		ElectronApp.quit();
	}
}

const app = new AppRemote();
export default app;

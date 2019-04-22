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
import { file } from "_tmp-promise@1.0.5@tmp-promise";
const metadata = require("../../package");
const { shell } = require("electron");
const { autoUpdater } = require("electron-updater");
var feedUrl = `https://download-sdk.oss-cn-beijing.aliyuncs.com/mp/sandbox/${process.platform}`;
var exec = require('child_process').exec;
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
			if(IS_MAC_OSX)
			  shell.showItemInFolder(filePath);
			else{
				//windows下showItemInFolder不能选中文件，不知道为什么
				var reg = /\\|\//g;
				filePath = filePath.replace(reg, "\\");
				var cmdInfo = "explorer.exe /select," + filePath;
				exec(cmdInfo);
			}
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

		// 消息右键菜单
		ipcMain.on("show-context-menu", (event, fromMe, isAllowRecall, type, openFilePath, fileName, remotePath) => {
			this.openFilePath = openFilePath;
			this.saveFileName = fileName;
			this.remotePath = remotePath;
			switch(type){
			case "TEXT":
			case "LOCATION":
				me.contextMenuTemplate = _.clone(me.textMenuTemplate);
				break;
			case "IMAGE":
			case "FILE":
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
		tray.setToolTip("IM-SDK桌面端Demo");
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

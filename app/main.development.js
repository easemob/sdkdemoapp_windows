import { app as ElectronApp, Menu } from "electron";
import DEBUG from "./utils/debug";
import application from "./platform/electron/app-remote";
import Lang from "./lang";
var fs = require("fs-extra");
var os = require("os");

ElectronApp.commandLine.appendSwitch("ignore-certificate-errors");

application.init(__dirname);

if(process.env.NODE_ENV === "production"){
	const sourceMapSupport = require('source-map-support'); // eslint-disable-line
	sourceMapSupport.install();
}

if(DEBUG && DEBUG !== "production"){
	require("electron-debug")(); // eslint-disable-line global-require
	const path = require('path'); // eslint-disable-line
	const p = path.join(__dirname, '..', 'app', 'node_modules'); // eslint-disable-line
	require('module').globalPaths.push(p); // eslint-disable-line
}

// Quit when all windows are closed.
ElectronApp.on("window-all-closed", () => {
	console.log("window-all-closed");
	// 删除缓存的剪贴板的图片
	// var pathImg = `${os.homedir()}/easemob/pasteImage`;
	// var files;
	// if(fs.existsSync(pathImg)){
	// 	files = fs.readdirSync(pathImg);
	// 	files.forEach(function(file, index){
	// 		var curPath = `${pathImg}/${file}`;
	// 		if(fs.statSync(curPath).isDirectory()){ // recurse
	// 			fs.rmdirSync(pathImg);
	// 			console.log("文件夹");
	// 		}
	// 		else{ // delete file
	// 			console.log("删除文件", file);
	// 			fs.unlinkSync(curPath, function(err){
	// 				if(err) throw err;
	// 			});
	// 		}
	// 	});
	// 	// fs.rmdirSync(pathImg);
	// }
	
	// if(process.platform !== "darwin"){
	// 	ElectronApp.quit();
	// }
});

const installExtensions = async () => {
	if(DEBUG){
		const installer = require("electron-devtools-installer"); // eslint-disable-line global-require

		const extensions = [
			"REACT_DEVELOPER_TOOLS",
			"REDUX_DEVTOOLS"
		];
		const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
		for (const name of extensions) { // eslint-disable-line
			try{
				await installer.default(installer[name], forceDownload); // eslint-disable-line
			} catch (e) {} // eslint-disable-line
		}
	}
};

const createMenu = () => {
	// Create application menu
	if(process.platform === "darwin"){
		const template = [{
			label: Lang.string("app.title"),
			submenu: [{
				label: Lang.string("menu.about"),
				selector: "orderFrontStandardAboutPanel:"
			}, {
				type: "separator"
			}, {
				label: "Services",
				submenu: []
			}, {
				type: "separator"
			}, {
				label: Lang.string("menu.hideCurrentWindow"),
				accelerator: "Command+H",
				selector: "hide:"
			}, {
				label: Lang.string("menu.hideOtherWindows"),
				accelerator: "Command+Shift+H",
				selector: "hideOtherApplications:"
			}, {
				label: Lang.string("menu.showAllWindows"),
				selector: "unhideAllApplications:"
			}, {
				type: "separator"
			}, {
				label: Lang.string("menu.quit"),
				accelerator: "Command+Q",
				click(){
					application.quit();
				}
			}]
		}, {
			label: Lang.string("menu.edit"),
			submenu: [{
				label: Lang.string("menu.undo"),
				accelerator: "Command+Z",
				selector: "undo:"
			}, {
				label: Lang.string("menu.redo"),
				accelerator: "Shift+Command+Z",
				selector: "redo:"
			}, {
				type: "separator"
			}, {
				label: Lang.string("menu.cut"),
				accelerator: "Command+X",
				selector: "cut:"
			}, {
				label: Lang.string("menu.copy"),
				accelerator: "Command+C",
				selector: "copy:"
			}, {
				label: Lang.string("menu.paste"),
				accelerator: "Command+V",
				selector: "paste:"
			}, {
				label: Lang.string("menu.selectAll"),
				accelerator: "Command+A",
				selector: "selectAll:"
			}]
		}, {
			label: Lang.string("menu.view"),
			submenu: (DEBUG) ? [{
				label: Lang.string("menu.reload"),
				accelerator: "Command+R",
				click(){
					application.mainWindow.webContents.reload();
				}
			}, {
				label: Lang.string("menu.toggleFullscreen"),
				accelerator: "Ctrl+Command+F",
				click(){
					application.mainWindow.setFullScreen(!application.mainWindow.isFullScreen());
				}
			}, {
				label: Lang.string("menu.toggleDeveloperTool"),
				accelerator: "Alt+Command+I",
				click(){
					application.mainWindow.toggleDevTools();
				}
			}] : [{
				label: Lang.string("menu.toggleFullscreen"),
				accelerator: "Ctrl+Command+F",
				click(){
					application.mainWindow.setFullScreen(!application.mainWindow.isFullScreen());
				}
			}]
		}, {
			label: Lang.string("menu.window"),
			submenu: [{
				label: Lang.string("menu.minimize"),
				accelerator: "Command+M",
				selector: "performMiniaturize:"
			}, {
				label: Lang.string("menu.close"),
				accelerator: "Command+W",
				selector: "performClose:"
			}, {
				type: "separator"
			}, {
				label: Lang.string("menu.bringAllToFront"),
				selector: "arrangeInFront:"
			}]
		}];

		const menu = Menu.buildFromTemplate(template);
		Menu.setApplicationMenu(menu);
		if(DEBUG){
			console.log("Mac os menu created.");
		}
	}
	else if(DEBUG){
		console.log("\n>> Windows menu not avaliable now.");
	}
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
ElectronApp.on("ready", async () => {
	// await installExtensions();
	application.ready();
	createMenu();
	if(DEBUG) console.info("\n>> Electron app ready.");
});

ElectronApp.on("activate", () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	application.openMainWindow();
	createMenu();
	if(DEBUG) console.info("\n>> Electron app activate.");
});

ElectronApp.on("before-quit", () => {
	ElectronApp.quitting = true;
});

if(typeof ElectronApp.setAboutPanelOptions === "function"){
	ElectronApp.setAboutPanelOptions({
		applicationName: "沙箱环信移动门户",
		applicationVersion: 1.0,
		copyright: "Copyright (C) 2018 easemob.com",
		credits: `Licence: `,
		version: DEBUG ? "[debug]" : ""
	});
}

if(DEBUG){
	console.info("\n>> Electron main process finish.");
}

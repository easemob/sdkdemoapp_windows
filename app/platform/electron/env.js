import os from "os";
import { remote as Remote } from "electron";
import path from "path";

const OS_PLATFORM = os.platform();
const dataPath = Remote.app.getPath("userData");
const tmpPath = path.join(dataPath, "temp");
const desktopPath = Remote.app.getPath("desktop");
const isOSX = OS_PLATFORM === "osx" || OS_PLATFORM === "darwin";
const isWindowsOS = OS_PLATFORM === "win32" || OS_PLATFORM === "win64";

export default {
	os: isOSX ? "mac" : isWindowsOS ? "windows" : OS_PLATFORM,
	isWindowsOS,
	isOSX,
	dataPath,
	desktopPath,
	tmpPath,
	get appPath(){
		return path.resolve(Remote.app.getAppPath(), "..");
	},
	appRoot: Remote.getGlobal("entryPath")
};

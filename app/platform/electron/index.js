
import fs from "fs-extra";
import screenshot from "./screenshot";
import contextmenu from "./contextmenu";
import remote from "./remote";
import EventEmitter from "./event-emitter";
import image from "./image";
import ui from "./ui";
import shortcut from "./shortcut";
import dialog from "./dialog";
import net from "./net";
import crypto from "./crypto";
import Socket from "./socket";
import clipboard from "./clipboard";
import webview from "./webview";

if(process.type !== "renderer"){
	throw new Error("platform/electron/index.js must run in renderer process.");
}

const platform = {
	type: "electron",
	screenshot,
	contextmenu,
	EventEmitter,
	remote,
	image,
	ui,
	shortcut,
	dialog,
	fs,
	net,
	crypto,
	Socket,
	clipboard,
	webview,
};

if(DEBUG){
	global.$.Platform = platform;
}

export default platform;

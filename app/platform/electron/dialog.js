import { remote as Remote, nativeImage } from "electron";
import Path from "path";
import fs from "fs-extra";
import env from "./env";
import Lang from "../../lang";
import ui from "./ui";
import openFileButton from "../common/open-file-button";

let lastFileSavePath = "";

/**
 * Show save dialog
 * @param object   options
 */
const showSaveDialog = (options, callback) => {
	if(options.sourceFilePath){
		const sourceFilePath = options.sourceFilePath;
		delete options.sourceFilePath;
		return showSaveDialog(options, (filename) => {
			if(filename){
				fs.copy(sourceFilePath, filename)
				.then(() => {
					if(callback){
						callback(filename);
					}
				}).catch(callback);
			}
			else if(callback){
				callback();
			}
		});
	}

	let filename = options.filename || "";
	delete options.filename;
	if(filename){
		filename = Path.basename(filename);
	}

	options = Object.assign({
		title: Lang.string("dialog.fileSaveTo"),
		defaultPath: Path.join(lastFileSavePath || env.desktopPath, filename)
	}, options);
	Remote.dialog.showSaveDialog(ui.browserWindow, options, (filename) => {
		if(filename){
			lastFileSavePath = Path.dirname(filename);
		}
		if(callback){
			callback(filename);
		}
	});
};

/**
 * Show open dialog
 */
const showRemoteOpenDialog = (options, callback) => {
	options = Object.assign({
		title: Lang.string("dialog.openFile"),
		defaultPath: env.desktopPath,
		properties: ["openFile"]
	}, options);
	Remote.dialog.showOpenDialog(ui.browserWindow, options, callback);
};

const saveAsImageFromUrl = (url, dataType) => new Promise((resolve, reject) => {
	const isBase64Image = dataType === "base64";
	if(!isBase64Image && url.startsWith("file://")){
		url = url.substr(7);
	}
	showSaveDialog({
		filename: isBase64Image ? "xuanxuan-image.png" : Path.basename(url),
		sourceFilePath: isBase64Image ? null : url
	}, (filename) => {
		if(filename){
			if(isBase64Image){
				const image = nativeImage.createFromDataURL(url);
				fs.outputFileSync(filename, image.toPNG());
			}
			resolve(filename);
		}
		else{
			reject();
		}
	});
});

export default {
	showRemoteOpenDialog,
	showSaveDialog,
	showOpenDialog: openFileButton.showOpenDialog,
	saveAsImageFromUrl
};

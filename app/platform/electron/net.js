import fse from "fs-extra";
import Path from "path";
import network from "../common/network";
import { userDataPath } from "./ui";

const downloadFileOrigin = network.downloadFile;
const uploadFileOrigin = network.uploadFile;

const downloadFileWithRequest = (user, url, fileSavePath, onProgress) => {
	return downloadFileOrigin(url, null, onProgress).then((fileBuffer) => {
		const buffer = new Buffer(new Uint8Array(fileBuffer));
		return fse.outputFile(fileSavePath, buffer);
	});
};

const filesCache = {};
const createCachePath = (file, user, dirName = "images") => {
	return Path.join(userDataPath, "users", user.identify, dirName, file.storageName);
};
const checkFileCache = (file, user) => {
	if(file.path){
		return Promise.resolve(false);
	}
	if(file.localPath){
		filesCache[file.gid] = file.localPath;
		return Promise.resolve(file.localPath);
	}
	let cachePath = filesCache[file.gid];
	if(cachePath){
		file.localPath = cachePath;
		return Promise.resolve(cachePath);
	}
	cachePath = createCachePath(file, user);
	return fse.pathExists(cachePath).then((exists) => {
		if(exists){
			filesCache[file.gid] = cachePath;
			file.localPath = cachePath;
			return Promise.resolve(cachePath);
		}
		return Promise.resolve(false);
	});
};

const getFileCache = (file) => {
	return filesCache[file.gid];
};

const downloadFile = (user, file, onProgress) => {
	return checkFileCache(file, user).then((cachePath) => {
		const url = file.url || file.makeUrl(user);
		const fileSavePath = file.path || createCachePath(file, user);
		if(cachePath){
			if(DEBUG){
				console.collapse("HTTP DOWNLOAD", "blueBg", url, "bluePale", "Cached", "greenPale");
				console.log("file", file);
				console.groupEnd();
			}
			if(fileSavePath !== cachePath){
				return fse.copy(cachePath, fileSavePath).then(() => {
					return Promise.resolve(file);
				});
			}
			return Promise.resolve(file);
		}

		fse.ensureDirSync(Path.dirname(fileSavePath));
		return downloadFileWithRequest(user, url, fileSavePath, onProgress).then(() => {
			if(DEBUG){
				console.collapse("HTTP DOWNLOAD", "blueBg", url, "bluePale", "OK", "greenPale");
				console.log("file", file);
				console.groupEnd();
			}
			file.localPath = fileSavePath;
			filesCache[file.gid] = file.localPath;
			return Promise.resolve(file);
		});
	});
};

const uploadFile = (user, file, onProgress, copyCache = false) => {
	const originFile = file.originFile;
	if(!originFile){
		return console.warn("Upload file fail, cannot get origin file object.", file);
	}
	const serverUrl = user.uploadUrl;
	const form = new FormData();
	form.append("file", file.originData, file.name);
	form.append("userID", user.id);
	form.append("gid", file.cgid);
	file.form = form;

	return uploadFileOrigin(file, serverUrl, (xhr) => {
		xhr.setRequestHeader("ServerName", user.serverName);
		xhr.setRequestHeader("Authorization", user.token);
	}, onProgress).then((remoteData) => {
		const finishUpload = () => {
			if(DEBUG){
				console.collapse("HTTP UPLOAD Request", "blueBg", serverUrl, "bluePale", "OK", "greenPale");
				console.log("files", file);
				console.log("remoteData", remoteData);
				console.groupEnd();
			}
			return Promise.resolve(remoteData);
		};
		if(copyCache){
			const copyPath = createCachePath(file, user, copyCache === true ? "images" : copyCache);
			file.localPath = copyPath;

			if(originFile.blob){
				return new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = () => {
						if(reader.readyState === 2){
							const buffer = new Buffer(reader.result);
							fse.outputFile(copyPath, buffer)
							.then(finishUpload)
							.then(resolve)
							.catch(reject);
						}
					};
					reader.readAsArrayBuffer(file.blob);
				});
			}
			if(originFile.path){
				return fse.copy(originFile.path, copyPath).then(finishUpload);
			}
		}
		return finishUpload();
	}).catch((error) => {
		if(DEBUG){
			console.error("Upload file error", error, file);
		}
		return Promise.reject(error);
	});
};

network.uploadFile = uploadFile;
network.downloadFile = downloadFile;
network.checkFileCache = checkFileCache;

export default network;

import { nativeImage } from "electron";
import fs from "fs-extra";
import Path from "path";

const base64ToBuffer = (base64Str) => {
	const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
	if(matches.length !== 3){
		throw new Error("Invalid base64 image string.");
	}
	return new Buffer(matches[2], "base64");
};

const createFromPath = (path) => {
	return nativeImage.createFromPath(path);
};

const createFromDataURL = (dataUrl) => {
	return nativeImage.createFromDataURL(dataUrl);
};

const saveImage = (image, filePath) => {
	const file = {
		path: filePath,
		name: Path.basename(filePath),
	};
	if(typeof image === "string"){
		file.base64 = image;
		image = base64ToBuffer(image);
		file.size = image.length;
	}
	else if(image.toPNG){
		image = image.toPNG();
		file.size = image.length;
	}
	if(image instanceof Buffer){
		return fs.outputFile(filePath, image).then(() => {
			return Promise.resolve(file);
		});
	}
	return Promise.reject("Cannot convert image to a buffer.");
};

export default {
	base64ToBuffer,
	saveImage,
	createFromPath,
	createFromDataURL
};

import { clipboard, nativeImage } from "electron";

const writeImageFromUrl = (url, dataType) => {
	if(url.startsWith("file://")){
		url = url.substr(7);
	}
	const img = dataType === "base64" ? nativeImage.createFromDataURL(url) : nativeImage.createFromPath(url);
	clipboard.writeImage(img);
};

export default {
	readText: clipboard.readText,
	writeText: clipboard.writeText,
	readImage: clipboard.readImage,
	writeImage: clipboard.writeImage,
	readHTML: clipboard.readHTML,
	writeHTML: clipboard.writeHTML,
	write: clipboard.write,
	writeImageFromUrl,
};

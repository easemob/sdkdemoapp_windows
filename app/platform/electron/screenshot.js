import RecordRTC from "recordrtc";
import { desktopCapturer, screen as Screen, remote as Remote, clipboard } from "electron";
import ui from "./ui";
import Image from "./image";
import env from "./env";
import Lang from "../../lang";
import RemoteEvents from "./remote";

/* This is NEEDED because RecordRTC is badly written */
global.html2canvas = (canvas, obj) => {
	obj.onrendered(canvas);
};

let lastSteam = null;
const stopStream = () => {
	if(lastSteam){
		lastSteam.stop();
		lastSteam = null;
	}
};
const getStream = (sourceId) => {
	return new Promise((resolve, reject) => {
		stopStream();
		desktopCapturer.getSources({ types: ["screen"] }, (error, sources) => {
			if(error){
				reject(error);
				return;
			}

			const display = getDisplay(sourceId);
			const displayIndex = Screen.getAllDisplays().findIndex(item => item.id === sourceId);

			navigator.webkitGetUserMedia(mediaConfig, (stream) => {
				lastSteam = stream;
				resolve(stream);
			}, reject);
		});
	});
};

const getCanvas = (width, height) => {
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	return canvas;
};

const getFrameImage = (canvas) => {
	return canvas.toDataURL();
};

const getDisplay = (id) => {
	if(id){
		return Screen.getAllDisplays().find(item => item.id === id);
	}
	return Screen.getPrimaryDisplay();
};

const getLoop = (fn) => {
	let requestId;
	const callFn = () => {
		requestId = requestAnimationFrame(callFn);
		fn();
	};
	callFn();
	return () => {
		cancelAnimationFrame(requestId);
	};
};


const takeAllScreenshots = (options) => {
	if(!options){
		options = Screen.getAllDisplays().map((item) => {
			return {
				x: 0,
				y: 0,
				width: item.bounds.width,
				height: item.bounds.height,
				sourceId: item.id
			};
		});
	}
	if(Array.isArray(options)){
		return Promise.all(options.map((option) => {
			return takeScreenshot(option);
		}));
	}
	return takeScreenshot(options);
    
};

const captureVideo = ({ x, y, width, height, sourceId }) => {
	const display = getDisplay(sourceId);
	const availTop = screen.availTop - display.bounds.y;
	sourceId = display.id;
	return getStream(sourceId)
	.then(getVideo)
	.then((video) => {
		const canvas = getCanvas(width, height);
		return startRecording({ canvas, video, x, y, width, height, availTop });
	});
};

const saveScreenshotImage = (options, filePath, hideCurrentWindow) => {
	if(!options){
		options = {};
	}
	if(!filePath){
		filePath = ui.makeTmpFilePath(".png");
	}
	const processImage = (base64Image) => {
		if(hideCurrentWindow){
			ui.browserWindow.show();
		}
		return Image.saveImage(base64Image, filePath);
	};
	if(hideCurrentWindow && ui.browserWindow.isVisible()){
		if(env.isWindowsOS){
			const hideWindowTask = () => {
				ui.browserWindow.hide();
				return new Promise((resolve, reject) => {
					setTimeout(resolve, 600);
				});
			};
			return hideWindowTask().then(() => {
				return takeScreenshot(options);
			}).then(processImage);
		}
		ui.browserWindow.hide();
	}
	return takeScreenshot(options).then(processImage);
};

const openCaptureScreenWindow = (file, display, onClosed) => {
	return new Promise((resolve, reject) => {
		const captureWindow = new Remote.BrowserWindow({
			x: display ? display.bounds.x : 0,
			y: display ? display.bounds.y : 0,
			width: display ? display.bounds.width : screen.width,
			height: display ? display.bounds.height : screen.height,
			alwaysOnTop: !DEBUG,
			fullscreen: true,
			frame: true,
			show: false,
			title: `${Lang.string("imageCutter.captureScreen")} - ${display.id}`,
			titleBarStyle: "hidden",
			resizable: false,
		});
		if(DEBUG){
			captureWindow.openDevTools();
		}
		captureWindow.loadURL(`file://${ui.appRoot}/index.html#image-cutter/${encodeURIComponent(file.path)}`);
		captureWindow.webContents.on("did-finish-load", () => {
			captureWindow.show();
			captureWindow.focus();
			resolve(captureWindow);
		});
		if(onClosed){
			captureWindow.on("closed", onClosed);
		}
	});
};

let isCapturing = false;

const captureAndCutScreenImage = (screenSources = 0, hideCurrentWindow = false) => {
	if(isCapturing){
		return Promise.reject("The capture window is already opened.");
	}
	isCapturing = true;
	if(!screenSources || screenSources === "all"){
		const displays = Screen.getAllDisplays();
		screenSources = displays.map((display) => {
			display.sourceId = display.id;
			return display;
		});
	}
	if(!Array.isArray(screenSources)){
		screenSources = [screenSources];
	}
	hideCurrentWindow = hideCurrentWindow && ui.browserWindow.isVisible();
	return new Promise((resolve, reject) => {
		const captureScreenWindows = [];
		const eventId = RemoteEvents.ipcOnce(RemoteEvents.EVENT.capture_screen, (e, image) => {
			if(captureScreenWindows){
				captureScreenWindows.forEach((captureWindow) => {
					captureWindow.close();
				});
			}
			if(hideCurrentWindow){
				ui.browserWindow.show();
				ui.browserWindow.focus();
			}
			if(image){
				const filePath = ui.makeTmpFilePath(".png");
				Image.saveImage(image.data, filePath).then((savedImage) => {
					if(savedImage && savedImage.path){
						clipboard.writeImage(Image.createFromPath(savedImage.path));
					}

					resolve(savedImage);
				}).catch(reject);
			}
			else if(DEBUG){
				console.log("No capture image.");
			}
			isCapturing = false;
		});
		const onWindowClosed = () => {
			RemoteEvents.off(eventId);
		};
		const takeScreenshots = () => {
			return Promise.all(screenSources.map((screenSource) => {
				return saveScreenshotImage(screenSource, "").then((file) => {
					return openCaptureScreenWindow(file, screenSource, onWindowClosed).then((captureWindow) => {
						captureScreenWindows.push(captureWindow);
						return Promise.resolve();
					});
				});
			}));
		};
		if(hideCurrentWindow){
			ui.browserWindow.hide();
			setTimeout(() => {
				takeScreenshots();
			}, env.isWindowsOS ? 600 : 0);
		}
		else{
			takeScreenshots();
		}
	});
};

export default {
	takeScreenshot,
	captureVideo,
	takeAllScreenshots,
	saveScreenshotImage,
	captureAndCutScreenImage
};

import system from "./system.json";
import media from "./media.json";
import ui from "./ui.json";
import pkg from "../package.json";

const config = {
	system,
	media,
	ui,
	pkg,
	exts: {}
};

export const updateConfig = (newConfig) => {
	Object.keys(newConfig).forEach((key) => {
		Object.assign(config[key], newConfig[key]);
	});
};

export default config;

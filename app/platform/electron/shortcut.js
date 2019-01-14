import { remote } from "electron";

const shortcuts = {};

/**
 * Unregister global hotkey
 * @param  {gui.Shortcut | string | object} hotkey
 * @return {void}
 */
const unregisterGlobalShortcut = (name) => {
	const accelerator = shortcuts[name];
	if(accelerator){
		try{
			remote.globalShortcut.unregister(accelerator);
		}
		catch(err){
			if(DEBUG){
				console.warn("Unregister shortcut error:", name, err);
			}
		}
		delete shortcuts[name];
		if(DEBUG){
			console.color(`GLOBAL HOTKEY REMOVE ${name}: ${accelerator}`, "purpleOutline");
		}
	}
};

/**
 * Register global hotkey
 * @param  {object} option
 * @param  {string} name
 * @return {void}
 */
const registerGlobalShortcut = (name, accelerator, callback) => {
	unregisterGlobalShortcut(name);
	if(accelerator){
		shortcuts[name] = accelerator;
		try{
			remote.globalShortcut.register(accelerator, () => {
				if(DEBUG){
					console.color(`GLOBAL KEY ACTIVE ${name}: ${accelerator}`, "redOutline");
				}
				callback();
			});
		}
		catch(err){
			if(DEBUG){
				console.warn("Register shortcut error:", name, accelerator, err);
			}
		}
		if(DEBUG){
			console.color(`GLOBAL HOTKEY BIND ${name}: ${accelerator}`, "purpleOutline");
		}
	}
	else if(DEBUG){
		console.color(`GLOBAL HOTKEY BIND ${name}: error`, "purpleOutline", "Cannot bind empty accelerator", "red");
	}
};

/**
 * Check a shortcu whether is registered
 */
const isGlobalShortcutRegistered = accelerator => remote.globalShortcut.isRegistered(accelerator);

export default {
	unregisterAll: remote.globalShortcut.unregisterAll,
	unregisterGlobalShortcut,
	registerGlobalShortcut,
	isGlobalShortcutRegistered
};

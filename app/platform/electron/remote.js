import { ipcRenderer } from "electron";
import EVENT from "./remote-events";

if(process.type !== "renderer"){
	if(DEBUG) console.error("\n>> Can not send event with ipc in main process, you can use AppRemote.sendToWindows method instead.");
}

const eventsMap = {};
let idSeed = new Date().getTime() + Math.floor(Math.random() * 100000);

const call = (method, ...args) => {
	return new Promise((resolve, reject) => {
		const callBackEventName = `${EVENT.remote}.${idSeed++}`;
		ipcRenderer.once(callBackEventName, (e, remoteResult) => {
			resolve(remoteResult);
		});
		ipcRenderer.send(EVENT.remote, method, callBackEventName, ...args);
	});
};

/**
 * Send event to main process
 * @param  {string}    eventName
 * @param  {...any} args
 * @return {void}
 */
const ipcSend = (eventName, ...args) => {
	ipcRenderer.send(eventName, ...args);
};

/**
 * Bind event with ipc
 * @param  {String} event
 * @param  {Function} listener
 * @return {Symbol}
 */
const ipcOn = (event, listener) => {
	ipcRenderer.on(event, listener);
	const name = Symbol(event);
	eventsMap[name] = { listener, name: event, ipc: true };
	if(DEBUG){
		console.collapse("ON IPC EVENT", "orangeBg", event, "orangePale");
		console.trace("event", eventsMap[name]);
		console.groupEnd();
	}
	return name;
};

/**
 * Bind once event with ipc
 * @param  {String} event
 * @param  {Function} listener
 * @return {Symbol}
 */
const ipcOnce = (event, listener) => {
	const name = Symbol(event);
	const bindedListener = (...args) => {
		remoteOff(name);
		listener(...args);
	};
	ipcRenderer.once(event, bindedListener);
	eventsMap[name] = { listener: bindedListener, name: event, ipc: true };
	if(DEBUG){
		console.collapse("ON IPC ONCE EVENT", "orangeBg", event, "orangePale");
		console.trace("event", eventsMap[name]);
		console.groupEnd();
	}
	return name;
};

/**
 * Bind remote(main process) event in renderer process
 * @param  {String}   event
 * @param  {Function} listener
 * @return {String}
 */
const remoteOn = (event, listener) => {
	const eventId = `${EVENT.remote_on}.${event}.${idSeed++}`;
	const ipcEventName = ipcOn(eventId, (e, ...args) => {
		if(DEBUG){
			console.collapse("COMMING REMOTE EVENT", "orangeBg", event, "orangePale");
			console.trace("event", eventsMap[eventId]);
			let argIdx = 0;
			for(const arg of args){
				console.log(`arg:${argIdx++}`, arg);
			}
			console.groupEnd();
		}
		listener(...args, e);
	});
	eventsMap[eventId] = { remote: true, id: ipcEventName };
	ipcRenderer.send(EVENT.remote_on, eventId, event);
	if(DEBUG){
		console.collapse("ON REMOTE EVENT", "orangeBg", event, "orangePale");
		console.trace("event", eventsMap[eventId]);
		console.groupEnd();
	}
	return eventId;
};

/**
 * Emit remote event in renderer process
 * @param  {String}    event
 * @param  {...any}    args
 * @return {void}
 */
const remoteEmit = (event, ...args) => {
	ipcRenderer.send(EVENT.remote_emit, event, ...args);
	if(DEBUG){
		console.collapse("cEMIT REMOTE EVENT", "orangeBg", event, "orangePale");
		let argIdx = 0;
		for(const arg of args){
			console.log(`arg:${argIdx++}`, arg);
		}
		console.groupEnd();
	}
};

/*
* Send event to window
*/
const sendToWindow = (windowName, eventName, ...args) => {
	ipcRenderer.send(EVENT.remote_send, windowName, eventName, ...args);
};

/*
* Send event to main window
*/
const sendToMainWindow = (eventName, ...args) => {
	return sendToWindow("main", eventName, ...args);
};

const remoteOff = (...names) => {
	names.forEach((name) => {
		const event = eventsMap[name];
		if(event){
			if(event.remote){
				remoteOff(event.id);
				ipcSend(EVENT.remote_off, name);
			}
			else if(event.ipc){
				ipcRenderer.removeListener(event.name, event.listener);
			}
			delete eventsMap[name];
			if(DEBUG){
				console.collapse("OFF EVENT", "orangeBg", event.name, "orangePale");
				if(event.ipc) console.log("ipc", true);
				if(event.remote) console.log("remote", true);
				console.trace("event", event);
				console.groupEnd();
			}
		}
	});
};

const onRequestQuit = (listener) => {
	return ipcOn(EVENT.remote_app_quit, listener);
};


export default {
	EVENT,
	call,
	on: remoteOn,
	emit: remoteEmit,
	off: remoteOff,
	ipcOn,
	ipcSend,
	ipcOnce,
	sendToWindow,
	sendToMainWindow,
	onRequestQuit
};

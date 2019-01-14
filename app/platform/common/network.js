import limitTimePromise from "../../utils/limit-time-promise";

const TIMEOUT_DEFAULT = 15 * 1000;
let fetch = window.fetch;
let optionsFilter = null;
const getOptions = (options) => {
	return optionsFilter ? optionsFilter(options) : options;
};

const request = (url, options) => {
	return new Promise((resolve, reject) => {
		options = getOptions(options);
		fetch(url, options).then((response) => {
			if(response.ok){
				if(DEBUG){
					console.collapse(`HTTP ${(options && options.method) || "GET"}`, "blueBg", url, "bluePale", "OK", "greenPale");
					console.log("options", options);
					console.log("response", response);
					console.log("body", response.body);
					console.groupEnd();
				}
				resolve(response);
			}
			else{
				const error = new Error(response.statusMessage || `Status code is ${response.status}.`);
				error.code = response.status === 401 ? "STATUS_401" : (response.statusMessage || "WRONG_STATUS");
				if(DEBUG){
					console.collapse(`HTTP ${(options && options.method) || "GET"}`, "blueBg", url, "bluePale", error.code || "ERROR", "redPale");
					console.log("options", options);
					console.log("error", error);
					console.log("response", response);
					console.groupEnd();
				}
				reject(error);
			}
		}).catch((error) => {
			error.code = "WRONG_CONNECT";
			if(DEBUG){
				console.collapse(`HTTP ${(options && options.method) || "GET"}`, "blueBg", url, "bluePale", error.code || "ERROR", "redPale");
				console.log("options", options);
				console.log("error", error);
				console.groupEnd();
			}
			reject(error);
		});
	});
};

const getText = (url, options) => {
	return request(url, options).then((response) => {
		return response.text();
	});
};

const postText = (url, options) => {
	if(options instanceof FormData){
		options = { body: options };
	}
	return request(url, Object.assign({ method: "POST" }, options)).then((response) => {
		return response.text();
	});
};


const getJSON = (url, options) => {
	return request(url, options).then((response) => {
		return response.json();
	});
};

const postJSON = (url, options) => {
	if(options instanceof FormData){
		options = { body: options };
	}
	return request(url, Object.assign({ method: "POST" }, options)).then((response) => {
		return response.json();
	});
};

const getJSONData = (url, options) => {
	return getJSON(url, options).then((json) => {
		if(json){
			const jsonResult = json.status || json.result;
			if(jsonResult === "success"){
				return Promise.resolve(json.data);
			}
 
			const error = new Error(json.message || json.reason || `The server data result is ${jsonResult}`);
			error.code = "WRONG_RESULT";
			return Promise.reject(error);
			
		}
 
		const error = new Error("Server return a null json.");
		error.code = "WRONG_DATA";
		return Promise.reject(error);
		
	});
};

const postJSONData = (url, options) => {
	if(options instanceof FormData){
		options = { body: options };
	}
	return getJSONData(url, Object.assign({
		method: "POST",
	}, options));
};

const downloadFile = (url, beforeSend, onprogress) => {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.onload = (e) => {
			if(xhr.status === 200){
				const arrayBuffer = xhr.response;
				if(arrayBuffer){
					resolve(arrayBuffer);
				}
				else{
					let error = new Error("File data is empty.");
					error = "EMPTY_FILE_DATA";
					reject(error);
				}
			}
			else{
				let error = new Error("Status code is not 200.");
				error = "WRONG_STATUS";
				reject(error);
			}
		};
		xhr.onprogress = (e) => {
			if(e.lengthComputable && onprogress){
				onprogress((100 * e.loaded) / e.total);
			}
		};
		xhr.onerror = (e) => {
			const error = new Error("Download request error.");
			error.event = e;
			error.code = "WRONG_CONNECT";
			reject(error);
		};
		xhr.onabort = (e) => {
			const error = new Error("Download request abort.");
			error.event = e;
			error.code = "CONNECT_ABORT";
			reject(error);
		};

		xhr.open("GET", url);
		xhr.responseType = "arraybuffer";
		if(beforeSend){
			beforeSend(xhr);
		}
		xhr.send();
	});
};

/**
 * Upload file to the server
 *
 * @param {object} file
 * @param {string} serverUrl
 * @param {Function} beforeSend
 * @param {Function} onProgress
 */
const uploadFile = (file, serverUrl, beforeSend = null, onProgress = null) => {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.onload = (e) => {
			if(xhr.status === 200){
				const bodyText = xhr.responseText;
				try{
					const json = JSON.parse(bodyText);
					if(json.result === "success" && json.data){
						resolve(json.data);
					}
					else{
						const error = new Error(`The server returned wrong result: ${xhr.responseText}`);
						error.code = "WRONG_RESULT";
						reject(error);
					}
				}
				catch(err){
					if(bodyText.indexOf("user-deny-attach-upload") > 0){
						const error = new Error("Server denied the request.");
						error.code = "USER_DENY_ATTACT_UPLOAD";
						reject(error);
					}
					else{
						const error = new Error(`Unknown data content: ${bodyText}`);
						error.code = "WRONG_DATA";
						reject(error);
					}
				}
			}
			else{
				let error = new Error("Status code is not 200.");
				error = "WRONG_STATUS";
				reject(error);
			}
		};
		xhr.upload.onprogress = (e) => {
			if(e.lengthComputable && onProgress){
				onProgress((100 * e.loaded) / e.total);
			}
		};
		xhr.onerror = (e) => {
			const error = new Error("Upload request error.");
			error.event = e;
			error.code = "WRONG_CONNECT";
			reject(error);
		};
		xhr.onabort = (e) => {
			const error = new Error("Upload request abort.");
			error.event = e;
			error.code = "CONNECT_ABORT";
			reject(error);
		};

		xhr.open("POST", serverUrl);
		xhr.setRequestHeader("X-FILENAME", encodeURIComponent(file.name));
		if(beforeSend){
			beforeSend(xhr);
		}
		xhr.send(file.form || file);
	});
};

const timeout = (promise, timeout = TIMEOUT_DEFAULT, errorText = "timeout") => {
	return limitTimePromise(promise, timeout, errorText);
};

const setFetchObject = (fObj) => {
	fetch = fObj;
};

const setOptionsFileter = (filter) => {
	optionsFilter = filter;
};

export default {
	request,
	getText,
	postText,
	getJSON,
	postJSON,
	getJSONData,
	postJSONData,
	downloadFile,
	uploadFile,
	timeout,
	setFetchObject,
	setOptionsFileter,
};

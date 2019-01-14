import WS from "ws";
import Config from "Config";
import crypto from "./crypto";
import Status from "../../utils/status";

const STATUS = new Status({
	CONNECTING: 0, // 连接还没开启。
	OPEN: 1, // 连接已开启并准备好进行通信。
	CLOSING: 2, // 连接正在关闭的过程中。
	CLOSED: 3, // 连接已经关闭，或者连接无法建立。
	UNCONNECT: 4, // 未连接
}, 4);

class Socket {
    static STATUS = STATUS;

    constructor(url, options){
    	this._status = STATUS.create(STATUS.UNCONNECT);
    	this._status.onChange = (newStatus, oldStatus) => {
    		if(this.onStatusChange){
    			this.onStatusChange(newStatus, oldStatus);
    		}
    	};

    	if(url){
    		this.init(url, options);
    	}
    }

    init(url, options){
    	// Close socket before init
    	this.close();

    	options = Object.assign({
    		connent: true,
    		userToken: "",
    		cipherIV: "",
    		encryptEnable: true,
    	}, options);

    	this.options = options;
    	this.url = url;
    	this._status.change(STATUS.UNCONNECT);

    	if(this.onInit){
    		this.onInit();
    	}

    	if(DEBUG){
    		console.collapse("SOCKET Init", "indigoBg", this.url, "indigoPale", this.statusName, this.isConnected ? "greenPale" : "orangePale");
    		console.trace("socket", this);
    		console.groupEnd();
    	}

    	if(options.connect && this.url){
    		this.connect();
    	}
    }

    get status(){
    	return this._status.value;
    }

    get statusName(){
    	return this._status.name;
    }

    set status(newStatus){
    	this._status.change(newStatus);
    }

    get isConnected(){
    	return this.isStatus(STATUS.OPEN);
    }

    get isConnecting(){
    	return this.isStatus(STATUS.CONNECTING);
    }

    isStatus(status){
    	return this._status.is(status);
    }

    updateStatusFromClient(){
    	if(this.client){
    		this.status = this.client.readyState;
    	}
    	else{
    		this.status = STATUS.UNCONNECT;
    	}
    }

    connect(){
    	this.close();

    	this.status = STATUS.CONNECTING;
    	this.client = new WS(this.url, {
    		rejectUnauthorized: false,
    		headers: { version: Config.pkg.version }
    	});

    	if(DEBUG){
    		console.collapse("SOCKET Connect", "indigoBg", this.url, "indigoPale", this.statusName, this.isConnected ? "greenPale" : "orangePale");
    		console.log("socket", this);
    		console.groupEnd();
    	}

    	this.client.on("open", this.handleConnect.bind(this));
    	this.client.on("message", this.handleData.bind(this));
    	this.client.on("close", this.handleClose.bind(this));
    	this.client.on("error", this.handleError.bind(this));
    	this.client.on("unexpected-response", this.handleError.bind(this));
    	this.client.on("pong", this.handlePong.bind(this));
    	this.client.on("ping", this.handlePing.bind(this));
    }

    reconnect(){
    	return this.connect();
    }

    handlePing(data){
    	if(this.onPing){
    		this.onPing(data);
    	}

    	if(this.options && this.options.onPing){
    		this.options.onPing(this, data);
    	}
    }

    handlePong(data){
    	if(this.onPong){
    		this.onPong(data);
    	}

    	if(this.options && this.options.onPong){
    		this.options.onPong(this, data);
    	}
    }

    handleConnect(){
    	this.updateStatusFromClient();

    	if(DEBUG){
    		console.collapse("SOCKET Connected", "indigoBg", this.url, "indigoPale");
    		console.log("socket", this);
    		console.groupEnd();
    	}

    	if(this.options.onConnect){
    		this.options.onConnect(this);
    	}

    	if(this.onConnect){
    		this.onConnect();
    	}
    }

    handleClose(code, reason){
    	if(!this.isConnected){
    		this.handleConnectFail({ code, message: reason });
    	}

    	const unexpected = !this._status.is(STATUS.CLOSING);
    	this.updateStatusFromClient();
    	this.client = null;
    	this.status = STATUS.CLOSED;

    	if(DEBUG){
    		console.collapse("SOCKET Closed", "indigoBg", this.url, "indigoPale");
    		console.log("socket", this);
    		console.log("code", code);
    		console.log("reason", reason);
    		console.groupEnd();
    	}

    	if(this.onClose){
    		this.onClose(code, reason, unexpected);
    	}

    	if(this.options && this.options.onClose){
    		this.options.onClose(this, code, reason, unexpected);
    	}
    }

    handleConnectFail(e){
    	if(this.onConnectFail){
    		this.onConnectFail(e);
    	}
    	if(this.options && this.options.onConnectFail){
    		this.options.onConnectFail(e);
    	}
    }

    handleError(error){
    	this.updateStatusFromClient();

    	if(DEBUG){
    		console.collapse("SOCKET Error", "redBg", this.url, "redPale");
    		console.log("socket", this);
    		console.log("error", error);
    		console.groupEnd();
    	}

    	if(this.options.onError){
    		this.options.onError(this, error);
    	}

    	if(this.onError){
    		this.onError(error);
    	}
    }

    handleData(rawdata, flags){
    	this.updateStatusFromClient();
    	let data = null;
    	if(flags && flags.binary){
    		if(this.options.encryptEnable){
    			data = crypto.decrypt(rawdata, this.options.userToken, this.options.cipherIV);
    		}
    		else{
    			data = rawdata.toString();
    		}
    	}

    	if(this.options.onData){
    		this.options.onData(this, data, flags);
    	}

    	if(this.onData){
    		this.onData(data, flags);
    	}
    }

    send(rawdata, callback){
    	let data = null;
    	if(this.options.encryptEnable){
    		data = crypto.encrypt(rawdata, this.options.userToken, this.options.cipherIV);
    		// if (DEBUG) {
    		//     console.collapse('ENCRYPT Data', 'blueBg', `length: ${data.length}`, 'bluePale');
    		//     console.log('data', data);
    		//     console.log('rawdata', rawdata);
    		//     console.groupEnd();
    		// }
    	}

    	this.client.send(data, {
    		binary: this.options.encryptEnable
    	}, callback);
    }

    markClose(){
    	this.status = STATUS.CLOSING;
    }

    removeAllListeners(){
    	this.client.removeAllListeners();
    }

    close(code, reason){
    	if(this.client){
    		if(reason === "close" || reason === "KICKOFF"){
    			this.markClose();
    		}
    		this.removeAllListeners();
    		if(reason === true){
    			this.client.terminate();
    		}
    		else{
    			this.client.close(code || 1000);
    		}
    		this.handleClose(code, reason);
    	}
    }
}

export default Socket;

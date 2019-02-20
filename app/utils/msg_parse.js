
var _const = require("@/views/config/emoji");
var EMOJI_MAP = _const.EMOJI_MAP;


const encode = (str) => {
	if(!str) return "";
	var s = str || "";
	if(str.length == 0) return "";
	// s = s.replace(/[<]/g, "&lt;");
	s = s.replace(/[>]/g, "&gt;");
	// s = s.replace(/[']/g, "&#39;");
	s = s.replace(/["]/g, "&quot;");
	s = s.replace(/\n/g, "<br>");
	return s;
};

const filterDomain = (msg, userInfo, msgFrom, atMsg) => {
	var re;
	var userEasemobName;
	if(!msg) return "";

	// re = /((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/ig;
	re = /(((https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/ig;
	msg = msg.replace(re, function(match){
		return `<p id=${match} class="msg-link">${match}</p>`;
	});
	if(userInfo && atMsg){
		userEasemobName = userInfo.user.easemobName;
		if(msgFrom != userEasemobName && atMsg.indexOf(userEasemobName) > -1){
			re = new RegExp(`@${userInfo.user.easemobName}`, "g");
			msg = msg.replace(re, `<span class="msg-at">@${userInfo.user.realName}</span>`);
		}
		if(atMsg.toLowerCase().indexOf("all") > -1){
			re = new RegExp("@所有成员", "g");
			msg = msg.replace(re, `<span class="msg-at">@所有成员</span>`);
		}

	}
	return msg;
};

const msgParse = (msgBody, userInfo) => {
	var key;
	var value;
	var textVal;
	var msg = msgBody.bodies()[0];
	var msgFrom = msgBody.from();
	var atMsg = msgBody.getAttribute("em_at_list");

	switch(msg.type()){
	case 0:
		textVal = encode(msg.text());
		textVal = filterDomain(textVal, userInfo, msgFrom, atMsg);
		for(key in EMOJI_MAP){
			value = EMOJI_MAP[key];
			while(textVal.indexOf(key) >= 0){
				textVal = textVal.replace(key, `<img src=${require(`@/views/config/faces/${value}`)} />`);
			}
		}
		return {
			type: "TEXT",
			value: textVal,
			shortVal: msg.text()
		};
	case 1:
		return {
			type: "IMAGE",
			thumbUrl: msg.thumbnailLocalPath(),
			localPath: msg.localPath(),
			shortVal: "[图片]",
			remotePath: msg.remotePath(),
			displayName: "图片",
		};
	case 2:
		return {
			type: "VIDEO",
			thumbUrl: msg.thumbnailLocalPath(),
			shortVal: "[视频]",
			displayName: "视频",
			remotePath: msg.remotePath(),
			localPath: msg.localPath(),
		};
	case 3:
		return {
			type: "LOCATION",
			shortVal: "[位置]",
			displayName: "位置",
			address: msg.address(), // 详细地址信息
			latitude: msg.latitude(), // 经度
			longitude: msg.longitude(), // 纬度

		};
	case 4:
		return {
			type: "AUDIO",
			url: msg.localPath(),
			shortVal: "[语音]",
			displayName: "语音",
			// duration: msg.duration()
		};
	case 5:
		return {
			type: "FILE",
			value: "[文件]",
			shortVal: "[文件]",
			displayName: msg.displayName() || "",
			length: msg.fileLength(),
			localPath: msg.localPath(),
			remotePath: msg.remotePath(),
			downloadStatus: msg.downloadStatus(), // 0:正在下载， 1:下载成功， 2:下载失败， 3:状态未知。
		};
	default:
		return {
			type: "OTHER",
			value: "[未知消息类型]",
			shortVal: "[未知消息类型]"
		};
	}
};
export default{
	msgParse
};

import $ from "jquery";
import { ipcRenderer } from "electron";

const audioAndVideoNotification = (opt) => {
	var notification;
	var popNotice;
	// var options = {
	// 	body: "1111111111",
	// };
	// var notify;
	// if(Notification.permission == "granted"){
	// 	console.log("fdsafdsfdsa");
	// 	notify = new Notification("titletitle", options);
	// 	notify.onshow = function(){
	// 		setTimeout(function(){
	// 			notify.close();
	// 		}, 2000);
	// 	};
	// }
	// toastr.info("1111", "2222");

	if(window.Notification){
		popNotice = function(){
			if(Notification.permission == "granted"){
				notification = new Notification("1111", {
					body: "hahahhahah",
					silent: false,
					noscreen: false,
				});

				notification.onclick = function(){
					notification.close();
				};
			}
		};

		if(Notification.permission == "granted"){
			popNotice();
		}
		else if(Notification.permission != "denied"){
			Notification.requestPermission(function(permission){
				console.log(permission);
				popNotice();
			});
		}
	}
	else{
		console.log("浏览器不支持Notification");
	}

	window.toastr.options = {
		closeButton: true,
		debug: false,
		newestOnTop: false,
		progressBar: false,
		positionClass: "toast-top-right",
		preventDuplicates: false,
		showDuration: "300",
		hideDuration: "1000",
		timeOut: 0,
		extendedTimeOut: 0,
		showEasing: "swing",
		hideEasing: "linear",
		showMethod: "fadeIn",
		hideMethod: "fadeOut",
		tapToDismiss: false
	};
	window.toastr["success"](`<div>${opt.inviterInfo.realName}</br>对方邀请你进行${opt.isVideo ? "视频" : "语音"}通话</br><span id='reject' class='reject'>拒绝</span><span id='accept' class='accept'>接受</spann></div>`);

	$("#reject")[0].addEventListener("click", function(){
		console.log("reject");
		let conferenceMsg = {
			from: opt.isInvited ? opt.inviterInfo.easemobName : opt.userInfo.user.easemobName,
			to: opt.isInvited ? opt.userInfo.user.easemobName : opt.inviterInfo.easemobName,
			message: "已拒绝通话"
		};
		ipcRenderer.send("audio-video-hangup", opt.conversationId, opt.conference.confrId, opt.isGroup, conferenceMsg);
		window.toastr.clear();
	});

	$("#accept")[0].addEventListener("click", function(){
		console.log("accept");
		ipcRenderer.send(
			"receive-audio-and-video",
			JSON.stringify(opt.userInfo),
			opt.conversationId,
			JSON.stringify(opt.inviterInfo),
			opt.logintoken,
			opt.isVideo,
			opt.isInvited,
			opt.isGroup,
			opt.groupInfo,
			JSON.stringify(opt.conference)
		);
		window.toastr.clear();
	});
};


module.exports = {
	audioAndVideoNotification
};

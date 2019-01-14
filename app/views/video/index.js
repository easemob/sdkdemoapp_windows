import React, { PureComponent } from "react";
import { connect } from "react-redux";
import * as actionCreators from "@/stores/video/action";
import { Icon } from "antd";
import { ipcRenderer } from "electron";
import HeadImageView from "@/views/common/head_image";
import { localOrRemoteFile } from "@/utils/local_remote_file";
import { domain } from "@/views/common/domain";
import RemoteVideoView from "./remote_video";
import _ from "underscore";
const { remote } = require("electron");
let configDir = remote.app.getPath("userData");
var emedia = require("@/easemob/EMedia_sdk-2.1.1.2eac06d");

// ##  视频消息
// {
//     "em_apns_ext": {
//         "push_type": 0				// 推送类型，用于苹果推送，值为0，1，2，分别表示0，普通消息(目前可以不传，或者每条消息都传0)；1，语音消息；2，视频消息；
//     },
//     "conference": {
//         "conf_type": 0,             // 呼叫类型，int型，值为0，1，2，分别表示  单聊语音，单聊视频，群视频
//         "confrId": "conferenceId",   // 创建会议后返回的id
//         "inviter": "inviterName",   // 邀请人信息，用于被呼叫方显示呼叫方信息
//         "password": "password",     // 创建会议时提供的password，加入时也需要，所以一并传过去。
//         "conversationId": "conversationId" // 语音所属ConversationID，如果是群，值是群id，如果是单人，值是发起方
//     }
// }

class VideoView extends PureComponent {
	constructor(props){
		super(props);
		const { streamAddAction } = this.props;
		this.handleHangup = this.handleHangup.bind(this);
		this.handleAnswer = this.handleAnswer.bind(this);
		this.handleOpenMicrophone = this.handleOpenMicrophone.bind(this);
		this.handleCloseMicrophone = this.handleCloseMicrophone.bind(this);
		this.handleAddGroupMember = this.handleAddGroupMember.bind(this);
		this.showMicrophone = this.showMicrophone.bind(this);
		this.changeVideoState = this.changeVideoState.bind(this);
		this.handleCloseVideo = this.handleCloseVideo.bind(this);
		this.handleOpenVideo = this.handleOpenVideo.bind(this);
		this.showUserInfo = this.showUserInfo.bind(this);
		this.allStream = {};
		this.videoTag = {};
		this.state = {
			isInvited: false,
			userInfo: null,
			isStreamAdded: false,
			microphone: true,
			time: "00:00:00",
			conference: null,
			isVideo: false,
			isGroup: false,
			inviterInfo: {}
		};
		ipcRenderer.removeAllListeners("audio_video_window_close");
		ipcRenderer.removeAllListeners("audio_video_window_load");
		ipcRenderer.removeAllListeners("audio-video-receive-hangup");
		ipcRenderer.removeAllListeners("audio-video-forwardto_voice");
		ipcRenderer.on("audio_video_window_load", (
			event,
			userInfo,
			conversationId,
			inviterInfo,
			logintoken,
			isVideo,
			isInvited,
			isGroup,
			groupInfo,
			allMembersInfo,
			conference
		) => {
			// 初始化音视频
			this.initEmedia(JSON.parse(userInfo), logintoken);
			this.userInfo = JSON.parse(userInfo);
			this.inviterInfo = JSON.parse(inviterInfo);
			this.isGroup = isGroup;
			this.groupInfo = groupInfo;
			console.log(`this.isGroup${this.isGroup}`);
			this.conversationId = conversationId;
			this.allMembersInfo = JSON.parse(allMembersInfo);
			if(isInvited){
				this.conference = JSON.parse(conference);
				this.confrId = this.conference.confrId;
				$("#player")[0].play();
			}
			else{
				this.createConference({ isVideo, isGroup });
			}
			this.setState({
				isInvited,
				userInfo: this.userInfo,
				inviterInfo: this.inviterInfo,
				isVideo,
				isGroup
			});
		});

		ipcRenderer.on("audio_video_timeout", (event) => {
			this.hangup({ isActived: false, timeout: true });
		});

		ipcRenderer.on("audio_video_window_close", (event) => {
			console.log("audio_video_window_close");
			emedia.mgr.exitConference();
		});

		// 收到对方挂断或拒绝
		ipcRenderer.on("audio-video-receive-hangup", (event, confrId, conversationId, from, to, isGroup) => {
			this.hangup({ isActived: false, confrId, conversationId, from, to, isGroup });
		});

		// 收到切换为语音通话的消息
		ipcRenderer.on("audio-video-forwardto_voice", (event) => {
			ipcRenderer.send("audio-video-change", false);
			this.setState({ isVideo: false });
		});

		// 有人加入会议，其他人调用joinXX等方法，如果加入成功，已经在会议中的人将会收到
		emedia.mgr.onMemberJoined = (member) => {
			console.log("有人加入会议，其他人调用joinXX等方法，如果加入成功，已经在会议中的人将会收到");
			console.log(member);
		};

		// 有人退出会议, 需要把对应的 video 标签移除
		emedia.mgr.onMemberExited = (member) => {
			console.log("有人退出会议");
			console.log(member);
		};

		// 有媒体流添加；比如 自己调用了publish方法（stream.located() === true时），或其他人调用了publish方法。
		emedia.mgr.onStreamAdded = (member, stream) => {
			const { currentStreamAction, localStreamAction } = this.props;
			console.log("有媒体流添加；比如 自己调用了publish方法（stream.located() === true时），或其他人调用了publish方法。");
			console.log(member);
			console.log(stream);

			if((
				!this.state.isGroup && !stream.located()) ||
				(this.state.isGroup && stream.located()) ||
				(!this.state.isInvited && !this.state.isStreamAdded && stream.located())
			){
				currentStreamAction(stream.id);
			}

			if(!stream.located()){
				// 多人视频时，从第一个人进来开始计时
				!this.state.isStreamAdded && this.startTime();
				this.setState({
					isStreamAdded: true
				});
				ipcRenderer.send("audio-video-answered", this.conference.confrId,  this.state.isGroup || this.state.isVideo);
			}
			else{
				localStreamAction(stream);
			}

			streamAddAction({ [stream.owner.name]: { stream, member } });
		};

		// 有媒体流移除
		emedia.mgr.onStreamRemoved = (member, stream) => {
			console.log("有媒体流移除");
			console.log(member);
			console.log(stream);
			const { streamRemovedAction, currentStreamAction, videoStreams, currentStreamId } = this.props;
			let insteadStream = null;
			streamRemovedAction(
				{
					id: stream.owner.name,
					insteadStream
				}
			);
			if(currentStreamId == stream.id){
				insteadStream = _.values(videoStreams)[0];
				currentStreamAction(insteadStream.stream.id);
			}
		};

		// 会议退出；自己主动退 或 服务端主动关闭；
		emedia.mgr.onConferenceExit = (reason, failed) => {
			reason = (reason || 0);
			console.log("会议退出；自己主动退 或 服务端主动关闭；");
			switch(reason){
			case 0:
				reason = "正常挂断";
				break;
			case 1:
				reason = "没响应";
				break;
			case 2:
				reason = "服务器拒绝";
				break;
			case 3:
				reason = "对方忙";
				break;
			case 4:
				reason = "失败,可能是网络或服务器拒绝";
				if(failed === -9527){
					reason = "失败,网络原因";
				}
				if(failed === -500){
					reason = "Ticket失效";
				}
				if(failed === -502){
					reason = "Ticket过期";
				}
				if(failed === -504){
					reason = "链接已失效";
				}
				if(failed === -508){
					reason = "会议无效";
				}
				if(failed === -510){
					reason = "服务端限制";
				}
				break;
			case 5:
				reason = "不支持";
				break;
			case 10:
				reason = "其他设备登录";
				break;
			case 11:
				reason = "会议关闭";
				break;
			default:
				break;
			}
			this.stopTime();
			console.log(reason);
			this.hangup({ isActived: true });
		};
	}

	// 挂断
	hangup(obj){
		let conferenceMsg;
		let timeout = false;
		if((!obj.isGroup && !this.state.userInfo) || !this.state.isGroup){
			let inviterEasemobName = obj.from || this.state.inviterInfo.easemobName;
			let userEasemobName = obj.to || this.state.userInfo.user.easemobName;
			conferenceMsg = {
				from: obj.from || this.state.isInvited ? inviterEasemobName : userEasemobName,
				to: obj.to || this.state.isInvited ? userEasemobName : inviterEasemobName
			};
			if(this.state.isStreamAdded){
				conferenceMsg["message"] = `通话时长 ${this.state.time}`;
			}
			else if(obj.timeout && !this.state.isInvited){
				timeout = true;
				conferenceMsg["message"] = "对方无应答";
			}
			// 我是被叫方主动拒绝
			else if(obj.isActived && this.state.isInvited){
				conferenceMsg["message"] = "已拒绝通话";
			}
			// 我是被叫方主动取消
			else if(obj.isActived && !this.state.isInvited){
				conferenceMsg["message"] = "已取消";
			}
			// 我是被叫方，主叫方主动取消
			else if(this.state.isInvited && obj.timeout){
				conferenceMsg["message"] = "对方已取消";
			}
			else if(!obj.isActived && !this.state.isInvited && !obj.from){
				conferenceMsg["message"] = "对方已拒绝";
			}
			else{
				conferenceMsg["message"] = "对方已取消";
			}
		}
		emedia.mgr.exitConference();
		const { removedAllStreamsAction } = this.props;
		removedAllStreamsAction();
		ipcRenderer.send(
			"audio-video-hangup",
			obj.conversationId || this.conversationId,
			obj.confrId || this.confrId,
			obj.isGroup || this.state.isGroup,
			conferenceMsg,
			timeout
		);
	}

	initEmedia(userInfo, logintoken){
		let me = this;
		// 音视频初始化
		this.appkey = userInfo.user.appkey;
		let easemobName = userInfo.user.easemobName;
		let jid = `${this.appkey}_${easemobName}`;
		emedia.mgr.setUrlCreator(function(url, apiName){
			return `http://a1.easemob.com${url}`;
		});
		emedia.mgr.setIdentity(jid, logintoken);
	}

	joinConference(){
		let me = this;
		let confrId = this.conference.confrId;
		let password = this.conference.password;
		emedia.mgr.joinConference(confrId, password)
		.then(function(confr){
			console.log("joinConferenceWithTicket");
			me.publishStream();
			ipcRenderer.send("audio-video-answered", me.conference.confrId, me.state.isGroup || me.state.isVideo);
		})
		.catch(function(error){
			console.log(error);
			if(error.error == -301){
				ipcRenderer.send("audio-video-joined-error", me.conference.confrId, me.state.isGroup || me.state.isVideo);
			}
		});
	}

	// 发布自己的流
	publishStream(){
		// 发布流
		emedia.mgr.publish({ audio: true, video: this.state.isVideo })
		.then(function(pushedStream){
			console.log("publish");
			console.log(pushedStream);
		// stream 对象
		})
		.catch(function(error){
			console.log(error);
		});
	}

	// 发起者创建会议
	createConference(opt){
		let me = this;
		let confrType = 10;
		let conf_type = 0;
		if(opt.isGroup){
			conf_type = 2;
		}
		else if(opt.isVideo && !opt.isGroup){
			conf_type = 1;
		}

		console.log(opt.isGroup);
		console.log(this.isGroup);
		let conference = {
			conf_type,
			// confrId,
			inviter: this.userInfo.user.easemobName,
			// password,
			conversationId: this.conversationId
		};
		emedia.mgr.createConference(confrType, Math.random())
		.then(function(confr){
			me.conference = confr;
			me.confrId = confr.confrId;
			let confrId = confr.confrId;
			let ticket = confr.ticket;
			let password = confr.password;
			console.log("createConference");
			console.log(confr);
			// 加入会议
			emedia.mgr.joinConferenceWithTicket(confrId, ticket)
			.then(function(confr){
				console.log("joinConferenceWithTicket");
				me.publishStream();
			})
			.catch(function(error){

			});

			console.log("发一条带音视频扩展消息的消息1");
			conference["confrId"] = confrId;
			conference["password"] = password;
			console.log("发一条带音视频扩展消息的消息2");
			console.log(conference);

			// 发一条带音视频扩展消息的消息
			ipcRenderer.send("originator-join-conference", JSON.stringify(conference), me.isGroup);

		})
		.catch(function(error){

		});
	}

	getNameFromJid(memName){
		let easemobName = memName.substring(this.appkey.length + 1);
		return this.allMembersInfo[easemobName];
	}

	handleHangup(){
		this.state.isStreamAdded ? emedia.mgr.exitConference() : this.hangup({ isActived: true });
	}

	handleAnswer(){
		$("#player")[0].pause();
		this.joinConference();
	}

	showBg(imgUrl){
		let inviterImg =
			(this.state.inviterInfo && !this.state.isStreamAdded) || !this.state.isGroup
				? this.state.inviterInfo.image
				: imgUrl || "";
		if(inviterImg){
			let url = this.getImgUrl(inviterImg);
			return (
				<div
					className="audio-video-bg"
					style={ { backgroundImage: `url(${url})` } }
				></div>
			);
		}
		// else if(this.state.isStreamAdded && this.state.isVideo){
		// 	return null;
		// }

		return <div className="audio-video-bg audio-video-noImage"></div>;

	}

	getImgUrl(imgInfo){
		let fileName = imgInfo.split("/").pop();
		let filePath = `${configDir}/easemob/easemobAvatar/${this.state.userInfo.user.easemobName}/${fileName}`;
		let url = localOrRemoteFile(filePath, `${domain}${imgInfo}`).replace(/\s/g, encodeURIComponent(" "));
		return url;
	}

	// 打开麦克风
	handleOpenMicrophone(){
		let me = this;
		const { localStream } = this.props;
		// 获取下本地流绑定的 video 标签
		let video = emedia.mgr.getBindVideoBy(localStream);
		// 仅订阅音频
		emedia.mgr.triggerResumeAudio(video)
		.then(function(){
			me.setState({ microphone: true });
		})
		.catch(function(error){

		});
	}

	// 关闭麦克风
	handleCloseMicrophone(){
		let me = this;
		const { localStream } = this.props;
		// 获取下本地流绑定的 video 标签
		let video = emedia.mgr.getBindVideoBy(localStream);
		// 仅暂停订阅音频
		emedia.mgr.triggerPauseAudio(video)
		.then(function(){
			me.setState({ microphone: false });
		})
		.catch(function(error){

		});
	}

	// 开启摄像头
	handleOpenVideo(){
		let me = this;
		const { localStream } = this.props;
		emedia.mgr.resumeVideo(localStream)
		.then(function(){
			me.setState({ isVideo: true });
		})
		.catch(function(){

		});
	}

	// 关闭摄像头图
	handleCloseVideo(){
		let me = this;
		const { localStream } = this.props;
		emedia.mgr.pauseVideo(localStream)
		.then(function(){
			me.setState({ isVideo: false });
		})
		.catch(function(){

		});
	}

	// 停止计时
	stopTime(){
		clearInterval(this.startInterval);
	}

	// 开始计时
	startTime(){
		var me = this;
		var time = 0;
		this.startInterval = setInterval(function(){
			time++;
			me.setState({ time: me.timer(time) });
		}, 1000);
	}

	// 计时器
	timer(time){
		var hour = parseInt(time / 3600);
		var minute = parseInt((time - hour * 3600) / 60);
		var second = (time - hour * 3600 - minute * 60);
		hour = this.prefixInteger(hour, 2);
		minute = this.prefixInteger(minute, 2);
		second = this.prefixInteger(second, 2);
		return `${hour}:${minute}:${second}`;
	}

	// 补零
	prefixInteger(num, n){
		return (Array(n).join(0) + num).slice(-n);
	}

	// 邀请群成员加入会议
	handleAddGroupMember(){
		ipcRenderer.send("audio-video-addmember", this.conference.conversationId || this.conversationId);
	}

	showMicrophone(){
		if(this.state.isStreamAdded){
			return (
				<div className="audio-video-sound">
					<Icon type={ this.state.microphone ? "sound" : "close-circle-o" } onClick={ this.state.microphone ? this.handleCloseMicrophone : this.handleOpenMicrophone } />
					<div>{this.state.microphone ? "关闭" : "打开"}麦克风</div>
				</div>
			);
		}
		return null;
	}

	changeVideoState(){
		if(this.state.isStreamAdded && this.state.isGroup){
			return (
				<div className="audio-video-sound">
					<Icon type={ this.state.isVideo ? "video-camera" : "close-circle-o" } onClick={ this.state.isVideo ? this.handleCloseVideo : this.handleOpenVideo } />
					<div>{this.state.isVideo ? "关闭" : "打开"}摄像头</div>
				</div>
			);
		}
		return null;
	}

	showUserInfo(){
		let inviterImg = this.state.inviterInfo ? this.state.inviterInfo.image : "";
		let inviterName = this.state.inviterInfo ? this.state.inviterInfo.realName || this.state.inviterInfo.username : "";
		let tips = "";
		if(this.state.isInvited && !this.state.isStreamAdded){
			if(this.state.isGroup){
				let groupName = this.groupInfo ? this.groupInfo.chatName : "";
				tips = `邀请你加入${groupName}群会议`;
			}
			else{
				tips = `邀请你进行${this.state.isVideo ? "视频" : "语音"}聊天`;
			}
		}
		else if(!this.state.isInvited && !this.state.isStreamAdded){
			tips = "正在等待对方接收邀请";
		}
		else{
			tips = this.state.time;
		}

		// 要显示头像的条件
		// 1单人语音通话
		// 2流没加进来，单人,视频
		// 3多人通话-流未加进来
		if(
			(!this.state.isGroup && (!this.state.isVideo || (!this.state.isStreamAdded && this.state.isVideo))) ||
			(!this.state.isStreamAdded && this.state.isGroup)
		){
			return (
				<div className="audio-video-info">
					{
						this.state.userInfo
							? <HeadImageView imgUrl={ inviterImg } currentUser={ this.state.userInfo } />
							: null
					}
					<span>{ inviterName }</span>
					<span className="tips">{ tips }</span>
				</div>
			);
		}
		return <div className="audio-video-info"><span className="tips">{ tips }</span></div>;
	}

	render(){
		// 渲染页面时用 emedia.mgr.getStreamById(streamId) 获取视频流的最新状态，不要根据 store 数据渲染，不准确
		let videoClass = this.state.isVideo ? "video" : "audio";
		let videoType = this.state.isGroup && this.state.isStreamAdded ? "group" : "single";
		const { videoStreams, currentStreamId } = this.props;
		let curStream = emedia.mgr.getStreamById(currentStreamId);
		let memberInfo = curStream ? this.getNameFromJid(curStream.owner.name) : {};
		let url = memberInfo.image ? this.getImgUrl(memberInfo.image) : "";
		return (
			<div>
				{ this.showBg(url) }
				<div className={ `audio-video-box ${videoType} ${videoClass}` }>
					{
						_.map(videoStreams, (videoStream, key) => {
							return (
								<RemoteVideoView
									videoStream={ videoStream }
									userInfo={ this.state.userInfo }
									emedia={ emedia }
									allMembersInfo={ this.allMembersInfo }
									key={ key }
									isGroup={ this.state.isGroup }
								/>
							);
						})
					}
					{ this.showUserInfo() }

				</div>
				<div className={ `audio-video-operation ${videoType}` }>
					{/* {
						this.state.isGroup && this.state.isStreamAdded
							? <div className="audio-video-addmember">
								<Icon type="sound" onClick={ this.handleAddGroupMember } />
								<div>添加成员</div>
							</div>
							: null
					} */}
					{ this.changeVideoState() }
					{ this.showMicrophone() }
					<span className="response-button audio-video-hangup" onClick={ this.handleHangup }><Icon type="phone" /></span>
					{
						this.state.isInvited && !this.state.isStreamAdded
							? <span className="response-button audio-video-answer" onClick={ this.handleAnswer }><Icon type="phone" /></span>
							: null
					}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	videoStreams: state.streams,
	localStream: state.localStream,
	currentStreamId: state.currentStreamId
});
export default connect(mapStateToProps, actionCreators)(VideoView);

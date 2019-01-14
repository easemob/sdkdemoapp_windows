import React, { PureComponent } from "react";
import { connect } from "react-redux";
import * as actionCreators from "@/stores/actions";
import * as selectors from "@/stores/selectors";
import ChatEmoji from "./chat_emoji";
import { audioAndVideo } from "@/views/main/receive_audio_video";
import { Input, Button, Upload, Icon, Modal } from "antd";
import uuid from "uuid";
import _ from "underscore";
import { ipcRenderer } from "electron";
import GroupVideoInvite from "../groups/group_video_invite";
// import $ from "jquery";
const { remote } = require("electron");
let configDir = remote.app.getPath("userData");
const { TextArea } = Input;
var fs = require("fs-extra");
// import Kscreenshot from "kscreenshot";

class ChatSendBoxView extends PureComponent {

	constructor(props){
		super(props);
		const { globals } = this.props;
		this.handlePressEnter = this.handlePressEnter.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleEmojiSelect = this.handleEmojiSelect.bind(this);
		this.uploadPictureData = this.uploadPictureData.bind(this);
		this.uploadAttachmentData = this.uploadAttachmentData.bind(this);
		this.uploadVideoData = this.uploadVideoData.bind(this);

		this.handleScreenShot = this.handleScreenShot.bind(this);
		this.handlePaste = this.handlePaste.bind(this);

		this.handleCancelSendImg = this.handleCancelSendImg.bind(this);
		this.handleSendImg = this.handleSendImg.bind(this);

		this.handleKeyDown = this.handleKeyDown.bind(this);

		this.handleVoiceCall = this.handleVoiceCall.bind(this);
		this.handleVideoCall = this.handleVideoCall.bind(this);

		this.hideInviteDialog = this.hideInviteDialog.bind(this);

		// this.handleTest = this.handleTest.bind(this);

		this.state = {
			imgUrl: "",
			visible: false,
			visibleInviteDialog: false,
		};
		this.imgBin = "";
		this.createFilePath = `${configDir}/easemob/pasteImage`;

		// 发送图片文件的消息回调
		// var handle = new easemob.EMCallbackObserverHandle();
		// this.emCallback = new easemob.EMCallback(handle);
		ipcRenderer.removeAllListeners("originator-join-conference");
		ipcRenderer.on("originator-join-conference", (event, conference, isGroup) => {
			conference = JSON.parse(conference);
			const { membersIdOfVideoGroup } = this.props;
			// let cfr = {
			// 	conference,
			// 	em_apns_ext: {
			// 		push_type: 1 // 推送类型，用于苹果推送，值为0，1，2，分别表示0，普通消息(目前可以不传，或者每条消息都传0)；1，语音消息；2，视频消息；
			// 	}
			// };
			let textMsgBody = new globals.easemob.EMTextMessageBody("发起通话");
			if(isGroup){
				_.map(membersIdOfVideoGroup, (memberId) => {
					this.sendMsg(textMsgBody, memberId, conference);
				});
			}
			else{
				this.sendMsg(textMsgBody, conference.conversationId, conference);
			}
		});

	}

	hideInviteDialog(){
		this.setState({ visibleInviteDialog: false });
	}

	handleAudioAndVideo(opt){
		const { userInfo, globals, selectConversationId, allMembersInfo, groupChats } = this.props;
		var logintoken = globals.emclient.getLoginInfo().loginToken();
		let isGroup = !!groupChats[selectConversationId];
		audioAndVideo({
			userInfo: JSON.stringify(userInfo),
			conversationId: selectConversationId,
			inviterInfo: JSON.stringify(allMembersInfo[selectConversationId]),
			logintoken,
			isVideo: opt.isVideo,
			isInvited: false,
			isGroup,
			groupInfo: groupChats[selectConversationId],
			allMembersInfo: JSON.stringify(allMembersInfo),
		});
	}

	// 发起语音
	handleVoiceCall(){
		this.handleAudioAndVideo({ isVideo: false });
	}

	// 发起视频
	handleVideoCall(){
		const { selectConversationId, groupChats } = this.props;
		let isGroup = !!groupChats[selectConversationId];
		// 是群组需要先选择群成员
		if(isGroup){
			this.setState({
				visibleInviteDialog: true,
			});
		}
		else{
			this.handleAudioAndVideo({ isVideo: true });
		}
	}

	handlePaste(e){
		var dtr;
		// e = e.originalEvent;
		dtr = e.clipboardData;
		if(this.canSwitchPrevMode(dtr)){
			this.toPreviewMode();
			this.toCreateImg();
		}
	}

	canSwitchPrevMode(dtr){
		var result = false;
		var item = dtr.items && dtr.items[0];
		if(item){
			// trace.log("drop file type", item.type);
			if(item.type.indexOf("image") > -1){
				// this.imgBin = dtr.getData(item.type);
				this.imgBin = item.getAsFile();
				result = true;
			}
		}
		return result;
	}

	toPreviewMode(){
		this.setState({
			visible: true,
			imgUrl: this.imgBin
		});
	}

	toCreateImg(){
		var me = this;
		var reader = new FileReader();
		reader.onload = function(){
			var base64_str = reader.result.replace("data:image/png;base64,", "");
			var buffer = new Buffer(base64_str, "base64");
			me.fileName = uuid.v1();
			fs.writeFile(`${me.createFilePath}/${me.fileName}`, buffer, (err, res) => {
				if(err){
					console.error(err);
					return;
				}
				console.log("img saved");
			});
		};
		reader.readAsDataURL(this.imgBin);
	}

	handleSendImg(){
		this.uploadPictureData({ path: `${this.createFilePath}/${this.fileName}` });
		this.setState({
			visible: false,
		});
	}

	handleCancelSendImg(){
		this.setState({
			visible: false,
		});
	}

	componentDidMount(){
		this.input.autoFocus = true;
	}

	// 截图
	handleScreenShot(){
		this.kscreenshot.startScreenShot();
	}

	// 截图结束
	handleEndScreenShot(callback){
		console.log("aaa");
		// callback(this);
		// this.kscreenshot.endScreenShot();
	}

	handleCopyPath(imgPath){
		// console.log(imgPath);
		this.imgPath = imgPath;
		return null;
	}

	handleKeyDown(e){
		if(e.keyCode === 9){
			// 阻止默认切换元素的行为
			if(e && e.preventDefault){
				e.preventDefault();
			}
			else{
				window.event.returnValue = false;
			}
		}
	}

	// 按回车键发送消息
	handlePressEnter(e){
		var textMsgBody;
		const { globals } = this.props;
		textMsgBody = new globals.easemob.EMTextMessageBody(this.input.textAreaRef.value);
		if(
			e.target.value &&
			!(e.target.value == "\n") &&
			!e.shiftKey
		){
			e.preventDefault();
			this.sendMsg(textMsgBody);
			// this.setState({ value: "" });
			this.input.textAreaRef.value = "";
		}
	}

	// 发送消息
	sendMsg(msg, conversationId, cfr){
		var {
			globals,
			selectConversationId,
			sendMsg,
			userInfo,
			groupChats,
			atMembersOfGroup,
			setNotice,
			networkStatus,
			conversations
		} = this.props;
		let me = this;
		if(networkStatus){
			setNotice("网络连接已断开，无法发送消息，请检查网络状态后再次尝试。", "fail");
			return;
		}
		conversationId = conversationId ? conversationId : selectConversationId;
		let atListEasemobName = [];
		let atList;
		let conversation;
		// var userId = userInfo.user.easemobName;
		// var userExt = JSON.stringify(memberInfo[userId]);
		// console.log(userExt);
		let emCallback = globals.emCallback;
		let sendMessage = globals.easemob.createSendMessage((userInfo && userInfo.user.easemobName), conversationId, msg);
		let textareaVal = this.input ? this.input.textAreaRef.value : "";
		let chatType = groupChats[conversationId] ? 1 : 0;
		this.cfr = cfr;
		// 群聊需要设置 setChatType(1) 和 setTo(groupId)
		if(chatType == 1){
			if(textareaVal.indexOf("@所有成员") > -1){
				sendMessage.setAttribute("em_at_list", "all");
			}
			else{
				_.map(textareaVal.split("@"), function(member){
					atList = _.find(atMembersOfGroup, function(m){
						return m.name == member.split(" ")[0];
					});
					atList && atListEasemobName.push(`"${atList.id}"`);
				});
				atListEasemobName.length && sendMessage.setJsonAttribute("em_at_list", `[${atListEasemobName}]`);
			}
			sendMessage.setChatType(1);
			sendMessage.setTo(conversationId);
		}

		emCallback.onSuccess = function(){
			console.log("emCallback call back success");
			if(me.cfr){
				console.log(sendMessage);
				console.log(sendMessage.msgId());
				conversation = globals.chatManager.conversationWithType(conversationId, chatType);
				conversation.removeMessage(sendMessage.msgId());
			}
			return true;
		};
		emCallback.onFail = function(error){
			console.log("emCallback call back fail");
			console.log(error.description);
			console.log(error.errorCode);
			return true;
		};
		emCallback.onProgress = function(progress){
			console.log(progress);
			console.log("call back progress");
		};


		// textMsg.addBody(); 多条消息需要addBody();
		// console.log(textMsg.bodies()[0].text());
		// 语音视频设置扩展
		if(cfr){
			// let cfr = {
			// 	conference,
			// 	em_apns_ext: {
			// 		push_type: 1 // 推送类型，用于苹果推送，值为0，1，2，分别表示0，普通消息(目前可以不传，或者每条消息都传0)；1，语音消息；2，视频消息；
			// 	}
			// };
			// "conf_type": 0,             // 呼叫类型，int型，值为0，1，2，分别表示  单聊语音，单聊视频，群视频
			let em_apns_ext = {
				push_type: cfr.conf_type == 0 ? 1 : 2
			};
			sendMessage.setJsonAttribute("em_apns_ext", JSON.stringify(em_apns_ext));
			sendMessage.setJsonAttribute("conference", JSON.stringify(cfr));
		}
		sendMessage.setCallback(emCallback);
		globals.chatManager.sendMessage(sendMessage);
		!cfr && sendMsg({ id: conversationId, msg: sendMessage, conversation: conversations[conversationId] });
	}

	handleChange(e){
		// var atPosition = screen.getCursorScreenPoint();
		var currentVal = e.currentTarget.value;
		const {
			atMembersOfGroup,  // 可以 @ 的群成员  群主 && 管理员 && 普通成员 && 去掉自己
			groupChats,
			selectConversationId
		} = this.props;
		this.setState(
			{
				value: currentVal,
			}
		);

		// 获取光标绝对位置
		// console.log(screen.getCursorScreenPoint());
		// $(e.target).caret("position");

		if(groupChats[selectConversationId]){
			$(e.target).atwho({
				at: "@",
				data: atMembersOfGroup,
				limit: atMembersOfGroup.length,
				startWithSpace: false,
			});
			$(e.target).on("inserted.atwho", function(event1, $li, event2){
				event2.stopPropagation();
			});
		}

	}

	// 选择表情
	handleEmojiSelect(e){
		this.input.textAreaRef.value += e.key;
		this.input.focus();
	}

	// 选择图片
	uploadPictureData(data){
		const { globals } = this.props;
		var imageMsgBody = new globals.easemob.EMImageMessageBody(data.path);
		this.sendMsg(imageMsgBody);
		// imageMsg.setCallback(emCallback);
		// chatManager.sendMessage(imageMsg);
	}

	// 选择文件
	uploadAttachmentData(data){
		const { globals } = this.props;
		var fileMsgBody = new globals.easemob.EMFileMessageBody(data.path);
		this.sendMsg(fileMsgBody);
		// var fileMsg = easemob.createSendMessage("jwfan", "jwfan1", fileMsgBody);
		// //setCallback(callback) 设置消息回调函数，通过回调函数显示消息发送成功失败，以及附件上传百分比
		// //callback easemob.EMCallback的实例，设置onSuccess、onFail和onProgress三个回调函数。
		// fileMsg.setCallback(emCallback);
		// chatManager.sendMessage(fileMsg);
	}

	// 选择视频
	uploadVideoData(data){
		const { globals } = this.props;
		var videoMsgBody = new globals.easemob.EMVideoMessageBody(data.path);
		// 设置视频缩略图
		// videoMsgBody.setThumbnailLocalPath(videoMsgBody.thumbnailLocalPath());
		this.sendMsg(videoMsgBody);
	}

	// handleTest(){
	// 	console.log("Aaa");
	// 	// toastr.info("Are you the 6 fingered man?");
	// 	var notification = new Notification("Hello Notification", { body: "I hope that all the browser will support this function!" });
	//
	// }

	render(){
		const uploadProps = {
			action: "//jsonplaceholder.typicode.com/posts/",
			showUploadList: false,
		};
		const { selectConversationId, groupChats, membersIdOfVideoGroup } = this.props;
		let isGroup = !!groupChats[selectConversationId];
		return (
			<div className="oa-main-sendbox">
				<div className="oa-main-toolbar">
					<ChatEmoji title="表情" onClick={ this.handleEmojiSelect } />
					{/* <div title="截图" onClick={ this.handleScreenShot }><Icon type="file" /></div> */}
					{/* 上传图片 */}
					<div title="图片"><Upload { ...uploadProps } data={ this.uploadPictureData } accept="image/*" ><Icon type="picture" /></Upload></div>
					{/* 上传文件 */}
					<div title="文件"><Upload { ...uploadProps } data={ this.uploadAttachmentData }><Icon type="file" /></Upload></div>
					{/* 上传视频 */}
					{/* <div title="视频"><Upload { ...uploadProps } data={ this.uploadVideoData } accept="video/*"><Icon type="video-camera" /></Upload></div> */}
					{
						isGroup
							? null
							: <div title="语音通话" onClick={ this.handleVoiceCall }><Icon type="phone" /></div>
					}
					<div title="视频通话" onClick={ this.handleVideoCall }><Icon type="video-camera" /></div>
					{/* <div onClick={ this.handleTest }>点击</div> */}
				</div>
				<TextArea
					placeholder="请输入..."
					onPressEnter={ this.handlePressEnter }
					onChange={ e => this.handleChange(e) }
					ref={ node => (this.input = node) }
					autoFocus={ "autoFocus" }
					onPaste={ this.handlePaste }
					id="chatSendbox"
					// onKeyDown={ this.handleKeyDown }
				/>
				<Modal
					title="发送图片"
					visible={ this.state.visible }
					onOk={ this.handleSendImg }
					onCancel={ this.handleCancelSendImg }
					okText="发送"
					mask={ false }
					width={ 400 }
				>
					<img
						src={ this.state.imgUrl ? window.URL.createObjectURL(this.state.imgUrl) : "" }
						style={ { maxWidth: "100%" } }
					/>
				</Modal>
				{
					// this.showGroupMember()
					this.state.visibleInviteDialog
						? <GroupVideoInvite conId={ selectConversationId } selectMemberData={ membersIdOfVideoGroup }  hideInviteDialog={ this.hideInviteDialog } />
						: null
				}
				{/* <div className="oa-chatbox-send">
					<Button type="primary">发送</Button>
				</div> */}
			</div>
		);

	}
}
const mapStateToProps = state => ({
	selectConversationId: state.selectConversationId,
	groupChats: state.groupChats,
	globals: state.globals,
	userInfo: state.userInfo,
	allMembersInfo: state.allMembersInfo,
	atMembersOfGroup: selectors.getAtMembersOfGroup(state),
	groupOwner: selectors.getGroupOwner(state),
	// memberInfo: selectors.getGroupMembers(state),
	membersIdOfVideoGroup: selectors.videoCallGroupMembersIdArray(state),
	networkStatus: state.networkConnection,
	conversations: state.conversations
	// memberInfo: state.memberInfo
});
export default connect(mapStateToProps, actionCreators)(ChatSendBoxView);

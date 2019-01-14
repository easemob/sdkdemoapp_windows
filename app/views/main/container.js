import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, withRouter } from "react-router-dom";
import * as actionCreators from "@/stores/actions";
import ROUTES from "../common/routes";
import ContactView from "../chats/contacts";
import ConversationListView from "../chats/conversation";
import GroupsView from "../chats/groups";
import { ipcRenderer } from "electron";
import GroupVideoInvite from "../chats/groups/group_video_invite";

const mainViews = [
	{ path: ROUTES.chats.recents.__, view: ConversationListView },
	{ path: ROUTES.chats.contacts.__, view: ContactView },
	{ path: ROUTES.chats.groups.__, view: GroupsView },
];

class Container extends Component {
	constructor(props){
		super(props);
		this.state = {
			conId: ""
		};
		const { setNotice, globals, userInfo, sendMsg } = this.props;

		ipcRenderer.removeAllListeners("audio-video-not-finished");
		ipcRenderer.removeAllListeners("active-hangup");
		ipcRenderer.removeAllListeners("audio-video-answered");
		ipcRenderer.removeAllListeners("audio-video-addmember");
		ipcRenderer.removeAllListeners("audio-video-joined-error");
		ipcRenderer.removeAllListeners("audio-video-client-sync");

		ipcRenderer.on("audio-video-not-finished", () => {
			setNotice("有未结束的通话", "fail");
		});

		// 己方挂断，需要发送一个 cmd 消息告知对方已挂断，只是单人的，群组的不需要
		// cmd: {action: "conf_action_cancel", ext: {"conference":{"confrId":""}}
		ipcRenderer.on("active-hangup", (event, conversationId, confrId, isGroup, conferenceMsg, timeout) => {
			if(isGroup){
				const { cancelVideoGroupAction } = this.props;
				cancelVideoGroupAction();
			}
			else if(!timeout){
				let easemob = globals.easemob;
				let cmdMsgBody = new easemob.EMCmdMessageBody("conf_action_cancel");
				let cmdMessage = easemob.createSendMessage(userInfo.user.easemobName, conversationId, cmdMsgBody);
				cmdMessage.setJsonAttribute(
					"conference", JSON.stringify({ confrId })
				);
				globals.chatManager.sendMessage(cmdMessage);
				// 通话结束上屏消息
				let conversation = globals.chatManager.conversationWithType(conversationId, 0);
				let textMsgBody = new easemob.EMTextMessageBody(conferenceMsg.message);
				let sendMessage = conferenceMsg.from == userInfo.user.easemobName
					? easemob.createSendMessage(conferenceMsg.from, conferenceMsg.to, textMsgBody)
					: easemob.createReceiveMessage(conferenceMsg.from, conferenceMsg.to, textMsgBody);
				// 消息标记为已读
				sendMessage.setIsRead();
				conversation.insertMessage(sendMessage);
				conversation.markMessageAsRead(sendMessage.msgId());
				sendMsg({ id: conversationId, msg: sendMessage, conversation });
			}
			this.sendSyncMsg(confrId);
		});

		ipcRenderer.on("audio-video-addmember", (event, conId) => {
			this.setState({ conId });
		});

		// {
		//     "msg": {
		//         "type": "cmd",
		//         "action": "oa_client_sync"
		//     },
		//     "ext": {
		//         "sync_device": "[pc|mobile]",
		//         "sync_event": {
		//             "event_type": "conferences_accepted",
		//             "conference_id": "xxx"
		//         }
		//     }
		// }

		// 收到通话在其他设备处理
		ipcRenderer.on("audio-video-client-sync", () => {
			setNotice("通话已在其他设备处理", "success");
		});

		// 音视频接通后告知其他设备已处理
		ipcRenderer.on("audio-video-answered", (event, conferenceId) => {
			this.sendSyncMsg(conferenceId);
		});

		ipcRenderer.on("audio-video-joined-error", (event) => {
			setNotice("会议加入失败", "fail");
		});
	}

	sendSyncMsg(conferenceId){
		const { globals, userInfo } = this.props;
		let easemob = globals.easemob;
		let cmdMsgBody = new easemob.EMCmdMessageBody("oa_client_sync");
		console.log("easemobName", userInfo.user.easemobName);
		let cmdMessage = easemob.createSendMessage(userInfo.user.easemobName, userInfo.user.easemobName, cmdMsgBody);
		let snycEvent = {
			event_type: "conferences_accepted",
			conference_id: conferenceId
		};
		cmdMessage.setJsonAttribute(
			"sync_event", JSON.stringify(snycEvent)
		);
		cmdMessage.setAttribute(
			"sync_device", "pc"
		);
		cmdMessage.setChatType(0);
		globals.chatManager.sendMessage(cmdMessage);
	}

	componentWillMount(){
		const { userInfo } = this.props;
		const tenantId = userInfo.user.tenantId;
		this.props.requestRootOrg(tenantId);
	}

	render(){
		return (
			<div className="app-main-container dock">
				{
					mainViews.map((item) => {
						return (
							<Route
								path={ item.path } key={ item.path } exact={ true }
								render={ () => {
									return <item.view { ...this.props } />;
								} }
							/>);
					})
				}
				{/* {
					this.state.conId
						? <GroupVideoInvite conId={ this.state.conId } selectMemberData={ [] } />
						: null
				} */}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	userInfo: state.userInfo,
	globals: state.globals,
	messages: state.messages
});
export default withRouter(connect(mapStateToProps, actionCreators)(Container));

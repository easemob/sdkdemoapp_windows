import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Modal } from "antd";
import Navbar from "./navbar";
import Container from "./container";
import * as actionCreators from "@/stores/actions";
import TopNav from "./topnav";
import moment from "moment";
import { utils } from "@/utils/utils";
import { userChange } from "./receive_notice";
import api from "@/api";
import _ from "underscore";
import ROUTES from "../common/routes";
import { conversationOfSelect } from "../../stores/actions";
// var fs = require("fs-extra");

// const { remote } = require("electron");
// let configDir = remote.app.getPath("userData");
const easemob = require('../../node/index');
var gconnectListener;
var gcontactListner;
var gInvitedContacts = [];
/**
 var easemob;
if(process.platform !== "darwin"){
	easemob = require("@/easemob/easemobWin.node");
}
else{
	easemob = require("@/easemob/easemobMac.node");
}
 */

// require("hazardous");

// var en = require("@/easemob/easemob.node");
// var db = global.process.dlopen(module, en);
// const a = "1";


class MainView extends PureComponent {

	constructor(props){
		var conversation;
		var messages;
		super(props);
		console.log("index");
		var me = this;
		const {
			globals,
			userInfo,
			logout,
			globalAction,
			allMembersInfo,
			unReadMsgCountAction,
			initConversationsActiton,
			networkConnectAction,
			setNotice,
			setAllContacts,
			setGroupChats,
			selectConversationId,
			conversationOfSelect
		} = this.props;
		if(userInfo && userInfo.user && userInfo.user.id){
			if(globals.emclient){
				this.emclient = globals.emclient;
			}
			else{
				console.log("new emclient");
				this.emclient = utils.initEmclient();
			}
			this.log = new easemob.EMLog();
			this.error = new easemob.EMError();

			this.emCallback = new easemob.EMCallback();

			console.log(`listern：${this.connectListener}`);
			this.connectListener = new easemob.EMConnectionListener();
			this.connectListener.onDisconnect((error) => {
				console.log("EMConnectionListener onDisconnect");
				console.log(error.errorCode);
				console.log(error.description);

				// code == 206 被踢，需要去验证 session
				if(error.errorCode == 206){
					this.emclient.logout();
					this.props.history.push('/index');
					this.chatManager.clearListeners();
					logout();
					localStorage.clear();

					Modal.info({
						title: "提示",
						content: (
							<div>你的账户已在其他地方登录</div>
						),
						onOk(){
						}
					});
				}
				else{
					// 尝试发一条 cmd 消息，看看网络有没有真的断掉
					me.sendTempCmd();
				}
			});
			if(typeof(gconnectListener) !== "undefined")
			  this.emclient.removeConnectionListener(gconnectListener);
			this.emclient.addConnectionListener(this.connectListener);
			gconnectListener = this.connectListener;


			this.chatManager = this.emclient.getChatManager();

			// this.chatManager.loadAllConversationsFromDB(); // 每一条会话加载 20 条消息到缓存中
			this.listener = new easemob.EMChatManagerListener();
		
			this.listener.onReceiveMessages((messages) => {
				const {selectConversationId} = this.props;
				console.log("selc:"+ selectConversationId);
				console.log("\n\n EMChatManagerListener onReceiveHasReadAcks ----- !");
				console.log(messages[0].conversationId());
				setTimeout(function(){
					me.onReceiveMsg(messages);
				}, 1);
			});

			this.listener.onReceiveCmdMessages ((messages) => {
				console.log("\n\n EMChatManagerListener onReceiveCmdMessages ----- !");
			});

			// 收到消息撤回
			this.listener.onReceiveRecallMessages ((message) => {
				me.onReceiveRecallMessages(message);
			});
			this.listener.onMessageAttachmentsStatusChanged((message,error) => {
				me.onMessageAttachmentsStatusChanged(message,error);
			})
			// addListener(listener) 添加消息回调监听，从监听中获取接收消息。
			this.chatManager.clearListeners();
			this.chatManager.addListener(this.listener);
			this.contactManager = this.emclient.getContactManager();


			this.groupManager = this.emclient.getGroupManager();
			this.callManager = this.emclient.getCallManager();
			this.callmanagerlistener = new easemob.EMCallManagerListener();
			this.callManager.clearListeners();
			this.callManager.addListener(this.callmanagerlistener);
			let emcallconfigs = this.callManager.getCallConfigs();
			emcallconfigs.setIsSendPushIfOffline(true);
			this.callManager.setSendPushMessage((from,to,type) => {
			  me.setSendPushMessage(from,to,type);
			})
			this.callManager.getRemoteStream((remoteStream) => {
				me.getRemoteStream(remoteStream);
			  })
			  this.callManager.getLocalStream((localStream) => {
				me.getLocalStream(localStream);
			  })
			this.callmanagerlistener.onRecvCallIncoming((callsession) => {
					me.onRecvCallIncoming(callsession);
				});
			this.callmanagerlistener.onRecvCallConnected((callsession) => {
					me.onRecvCallConnected(callsession);
				});
			this.callmanagerlistener.onRecvCallAccepted((callsession) => {
				  me.onRecvCallAccepted(callsession);
				});
			this.callmanagerlistener.onRecvCallEnded((callsession,reason,error) => {
					me.onRecvCallEnded(callsession,reason,error);
					});
			this.callmanagerlistener.onRecvCallNetworkStatusChanged((callsession,toStatus) => {
				me.onRecvCallNetworkStatusChanged(callsession,toStatus);
				});
			this.callmanagerlistener.onRecvCallStateChanged((callsession,type) => {
				me.onRecvCallStateChanged(callsession,type);
				});
			globalAction({
				emclient: this.emclient,
				chatManager: this.chatManager,
				easemob,
				log: this.log,
				groupManager: this.groupManager,
				emCallback: this.emCallback,
				groupManager: this.groupManager,
				contactManager:this.contactManager,
				callManager:this.callManager
			});


			this.contactListener = new easemob.EMContactListener();
			
			this.contactListener.onContactAdded((username) => {
				console.log("onContactAdded username: " + username);
				var res = this.contactManager.allContacts();
				res.data.map((item) => {
					console.log(item);
				})
				setAllContacts({contacts:res.data});
			});
			this.contactListener.onContactDeleted((username) => {
				const {
					selectMember,
					memberOfSelect
					} = this.props;
				console.log("onContactDeleted username: " + username);
				if(username == selectMember.easemobName)
				{
					memberOfSelect({});
				}
				var res = this.contactManager.allContacts();
				res.data.map((item) => {
					console.log(item);
				})
				setAllContacts({contacts:res.data});
			});
			this.contactListener.onContactInvited((username, reason) => {
				if(gInvitedContacts.indexOf(username) > -1)
					return;
				var res = this.contactManager.allContacts();
				console.log(res);
				if(res.code == 0 && res.data.indexOf(username) > -1)
					return;
				gInvitedContacts.push(username);
				setTimeout(()=>{
					console.log("onContactInvited username: " + username + " reason: " + reason);
					let con = confirm(username + "请求添加好友,是否同意");
					if (con == true) {
						console.log("agree invite");
						this.contactManager.acceptInvitation(username).then((res) => {
							console.log("acceptInvitation:" + res.code);
							gInvitedContacts.splice(gInvitedContacts.indexOf(username));
						});
					} else {
						this.contactManager.declineInvitation(username).then((res) => {
							console.log("declineInvitation:" + res.code);
							gInvitedContacts.splice(gInvitedContacts.indexOf(username));
						});
					}
					
				},500);
			});
			this.contactListener.onContactAgreed((username) => {
				console.log("onContactAgreed username: " + username);
			});
			this.contactListener.onContactRefused((username) => {
				console.log("onContactRefused username: " + username);
			});
			if(typeof(gcontactListner) !== "undefined")
			   this.contactManager.removeContactListener(gcontactListner);
			this.contactManager.registerContactListener(this.contactListener);
			gcontactListner = this.contactListener;
			
			this.groupListener = new easemob.EMGroupManagerListener(this.groupManager);
			this.groupManager.clearListeners();
			this.groupManager.addListener(this.groupListener);
			// 邀请别人入群被同意时触发
			// group : 发生操作的群组
			// invitee : 同意邀请的人

			this.groupListener.onReceiveInviteAcceptionFromGroup = function(group, invitee){
				me.onReceiveInviteAcceptionFromGroup(group, invitee);
			};

			// 接收入群组邀请时触发
			// groupId : 邀请进入群组的群组id
			// inviter : 邀请人
			// inviteMessage : 邀请信息
			this.groupListener.onReceiveInviteFromGroup = function(groupId, inviter, inviteMessage){
				console.log("\n\n EMGroupManagerListener onReceiveInviteFromGroup ----- !");
				console.log(`groupId = ${groupId}`);
				console.log(`inviter = ${inviter}`);
				console.log(`inviteMessage = ${inviteMessage}`);
			
				// acceptInvitationFromGroup(groupId, inviter, error) 同意加入群组
				// groupId : 同意加入的群组id
				// inviter : 邀请者
			
				this.groupManager.acceptInvitationFromGroup(groupId, inviter).then(res => {
					console.log(`error.errorCode = ${res.code}`);
					console.log(`error.description = ${res.description}`);
					if(res.code == 0)
					{
						console.log(`group.groupId() = ${res.data.groupId()}`);
						console.log(`group.groupSubject() = ${res.data.groupSubject()}`);
						console.log(`group.groupDescription() = ${res.data.groupDescription()}`);
					}
				});
			
				// declineInvitationFromGroup(groupId, inviter, reason, error);
				// groupId : 同意加入的群组id
				// inviter : 邀请者
				// reason : 拒绝加入的原因
				// error : 错误信息
				/*
				groupManager.declineInvitationFromGroup(groupId, inviter, "hahahahaha", error);
				console.log("declineInvitationFromGroup ret.errorCode = " + error.errorCode);
				console.log("declineInvitationFromGroup ret.description = " + error.description);
				*/
			};
			this.groupListener.onReceiveJoinGroupApplication((groupId, from, message) => {
				console.log("\n\n EMGroupManagerListener onReceiveJoinGroupApplication ----- !");
				console.log(groupId);
				console.log(from);
				console.log(message);
		
				//acceptJoinGroupApplication(groupId, user, error) 同意进群申请
				//groupId : 发生操作的群组id
				//user : 申请者
				//error : 错误信息
			this.groupManager.acceptJoinGroupApplication(groupId, from).then((res) => {
					console.log("acceptGroup.groupId() = " + res.data.groupId());
					console.log("acceptGroup.groupSubject() = " + res.data.groupSubject());
					console.log("acceptGroup.groupDescription() = " + res.data.groupDescription());
					this.chatManager.conversationWithType(groupId, 1);
				},(error) => {
					console.log(error);
				});
		});

			// 添加群管理员时触发(只有是自己时才能收到通知)
			// group : 发生操作的群组
			// admin : 被提升的群管理员
			this.groupListener.onAddAdminFromGroup((groupId, admin) => {
				setTimeout(function(){
					me.onAddAdminFromGroup(groupId, admin);
				}, 1);
			});

			// 删除群管理员时触发(只有是自己时才能收到通知)
			// group : 发生操作的群组
			// admin : 被删除的群管理员（群管理员变成普通群成员）
			this.groupListener.onRemoveAdminFromGroup((groupId, admin) => {
				setTimeout(function(){
					me.onRemoveAdminFromGroup(groupId, admin);
				}, 1);
			});

			// 转让群主的时候触发
			// group : 发生操作的群组
			// newOwner : 新群主
			// oldOwner : 原群主
			this.groupListener.onAssignOwnerFromGroup((groupId, newOwner, oldOwner) => {
				setTimeout(function(){
					me.onAssignOwnerFromGroup(groupId, newOwner, oldOwner);
				}, 1);
			});

			// 我接收到自动进群时被触发
			// group : 发生操作的群组
			// inviter : 邀请人
			// inviteMessage : 邀请信息
			this.groupListener.onAutoAcceptInvitationFromGroup((groupId, inviter, inviteMessage)=>{
				setTimeout(function(){
					me.onAutoAcceptInvitationFromGroup(groupId, inviter, inviteMessage);
				}, 1);
			});

			// 成员加入群组时触发
			// group : 发生操作的群组
			// member : 加入群组的成员名称
			this.groupListener.onMemberJoinedGroup((groupId, member)=>{
				console.log("-----member:" + member);
				setTimeout(function(){
					me.onMemberJoinedGroup(groupId, member);
				}, 1);
			});

			// 成员离开群组时触发
			// group : 发生操作的群组
			// member : 离开群组的成员名称
			this.groupListener.onMemberLeftGroup((groupId, member)=>{
				console.log("-----member:" + member);
				setTimeout(function(){
					me.onMemberLeftGroup(groupId, member);
				}, 1);
			});

			// 离开群组时触发
			// group : 发生操作的群组
			// reason : 离开群组的原因（0: 被踢出 1:群组解散 2:被服务器下线）
			this.groupListener.onLeaveGroup((groupId, reason)=>{
				setTimeout(function(){
					me.onLeaveGroup(groupId, reason);
				}, 1);
			});

			// 多设备监听
			this.multiDevicesListener = new easemob.EMMultiDevicesListener();
			this.multiDevicesListener.onContactMultiDevicesEvent((operation, target, ext) => {
				console.log("onContactMultiDevicesEvent");
				console.log(`operation : ${operation}`);
				console.log(`target : ${target}`);
				console.log(`ext : ${ext}`);
				me.onContactMultiDevicesEvent(operation, target, ext);
			});
			this.multiDevicesListener.onGroupMultiDevicesEvent((operation, target, usernames) => {
				console.log(`operation : ${operation}`);
				console.log(`target : ${target}`);
				console.log(`usernames : ${usernames}`);
				me.onGroupMultiDevices(operation, target, usernames);
			});
			this.emclient.clearAllMultiDevicesListeners();
			this.emclient.addMultiDevicesListener(this.multiDevicesListener);

			// this.ret = this.emclient.login(
			// 	(userInfo && userInfo.user.easemobName),
			// 	(userInfo && userInfo.user.easemobPwd)
			// );
			// console.log(`loginCode:${this.ret.errorCode}`);
			// if(this.ret.errorCode != 0){
			// 	setNotice(`登录失败，${this.ret.errorCode}`);
			// 	this.emclient.logout();
			// 	logout();
			// }
		this.emclient.login( userInfo.user.easemobName, userInfo.user.easemobPwd).then((res) => {
			console.log(`loginCode:${res.code}`);
			// 获取好友列表
			this.contactManager.getContactsFromServer().then(res => {
				var res = this.contactManager.allContacts();
				res.data.map((item) => {
					console.log(item);
				})
				res.code == 0 && setAllContacts({contacts:res.data});
			});
		

		// 获取用户所在的组
		
			this.groupManager.fetchAllMyGroups().then(res => {
				let allGroup = this.groupManager.allMyGroups().data;
				let allGroups = [];
				allGroup.map((group) => {
				allGroups.push(group.groupId());
			});
			setGroupChats({allGroups});

		
		});

		// this.chatManager.getConversations();// 获取缓存中的会话列表
		
		let conversationType = 0;
		this.chatManager.getConversations().map((item) => {
			var msgObj = {};
			var unReadMsgMsgId = [];
			conversationType = item.conversationType();
			if(conversationType == 1)
			{
				let curgroup = this.groupManager.groupWithId(item.conversationId());
				if(curgroup.groupSubject() == "")
				{
					this.chatManager.removeConversation(item.conversationId());
					return;
				}
			}
			//conversation = this.chatManager.conversationWithType(item.conversationId(), conversationType);
			let unreadNum = item.unreadMessagesCount();
			messages = item.loadMoreMessagesByMsgId("", unreadNum>20?unreadNum:20,0);
			messages.map((msg) => {
				msgObj[msg.msgId()] = msg.isRead();
			});
			_.map(msgObj, (msg, key) => {
				!msg && unReadMsgMsgId.push(key);
			});
			unReadMsgCountAction({ id: item.conversationId(), unReadMsg: unReadMsgMsgId });
			initConversationsActiton({ id: item.conversationId(), msgs: messages, "conversation":item });
		});
		if(res.code != 0){
			setNotice(`登录失败，${res.code}`);
			this.emclient.logout();
			logout();
			return false;
		}
	});

			const updateOnlineStatus = () => {
				if(navigator.onLine){
					// 尝试发一条 cmd 消息，看看网络有没有真的断掉
					this.sendTempCmd();
					networkConnectAction();
				}
				else{
					networkConnectAction("连接已断开");
				}
			};
			window.addEventListener("online",  updateOnlineStatus);
			window.addEventListener("offline",  updateOnlineStatus);
		}
		else{
			this.props.history.push("/index");
		}
		// updateOnlineStatus();
	}

	sendTempCmd(){
		const { userInfo, conversations } = this.props;
		let cmdMsgBody = new easemob.EMCmdMessageBody("testAction");
		// let anyone = _.find(allMembersInfo, item => item.easemobName);
		_.map(conversations, (conversation) => {
			let cmdMessage = easemob.createSendMessage(userInfo.user.easemobName, conversation.conversationId(), cmdMsgBody);
			cmdMessage.setAttribute("");
			this.chatManager.sendMessage(cmdMessage);
		});

		console.log("sendCmd");
	}
	// 多设备联系人回调
	onContactMultiDevicesEvent(operation, target, ext)
	{
		const {setAllContacts} = this.props;
			// 获取好友列表
			this.contactManager.getContactsFromServer().then(res => {
				var res = this.contactManager.allContacts();
				res.data.map((item) => {
					console.log(item);
				})
				res.code == 0 && setAllContacts({contacts:res.data});
			});
	}
	// 多设备群组操作回调
	onGroupMultiDevices(operation, target, usernames){
		const {createAGroup,leaveGroupAction,setNotice,selectConversationId,conversationOfSelect} = this.props;
		let group = this.groupManager.groupWithId(target);
		function updateGroupUI(){
			if(target == selectConversationId)
			{
				conversationOfSelect("");
				conversationOfSelect(selectConversationId);
			}
		}
		switch(operation){
			case 10:// 创建群组
				{
					let conversation = this.chatManager.conversationWithType(target,1);
					createAGroup({easemobGroupId:target,conversation});
					this.groupManager.fetchGroupSpecification(target).then(res => {

					});
					this.groupManager.fetchGroupMembers(target, "", 200).then((res) => {
		
					},(error) => {});
					setNotice(`创建群组${group.groupSubject()}`);
				}
				break;
			case 11://解散群组
			    {	
					leaveGroupAction(target);
					setNotice(`解散群组${group.groupSubject()}`);
			    }
			    break;
			case 12://加入群组
			    {
					this.groupManager.fetchGroupSpecification(target).then(res => {

					});
					this.groupManager.fetchGroupMembers(target, "", 200).then((res) => {
		
					},(error) => {});
					setNotice(`加入群组${group.groupSubject()}`);
			    }
			    break;
			case 13://离开群组
				{
					leaveGroupAction(group.groupId());
					setNotice(`离开群组${group.groupSubject()}`);
				}
				break;
			case 14://收到入群邀请
			    break;
			case 15://同意群组申请
			    {
					this.groupManager.fetchGroupSpecification(target).then(res => {

					});
					this.groupManager.fetchGroupMembers(target, "", 200).then((res) => {
		
					},(error) => {});
					setNotice(`加入群组${group.groupSubject()}`);
			    }
			    break;
			case 16://拒绝群组申请
			    break;
			case 17://发出入群邀请
			    break;
			case 18://对方同意群组邀请
			    {
					this.groupManager.fetchGroupMembers(target, "", 200).then((res) => {
		
					},(error) => {});
					setNotice(`加入群组${group.groupSubject()}`);
				}
			    break;
			case 19://对方拒绝群组邀请
			    break;
			case 20://踢人
			    break;
			case 21://禁止成员发言
			    break;
			case 22://解禁成员发言
			    break;
			case 23://屏蔽群消息
			    break;
			case 24://解除消息屏蔽
			    break;
			case 25://更改群主
				setNotice(`群组 ${group.groupSubject()} 群主变更为${usernames}`);
				updateGroupUI();
			    break;
			case 26://群成员升级为管理员
				setNotice(`群组 ${group.groupSubject()} 群成员${usernames}升为管理员`);
				updateGroupUI();
			    break;
			case 27://管理员降为群成员
			    setNotice(`群组 ${group.groupSubject()} 管理员${usernames}降为群成员`);
			    updateGroupUI();
			    break;
			case 28://增加禁言
			    break;
			case 29://移除禁言
			    break;
			default:
				break;
		}
	}

	// 收到消息撤回
	onReceiveRecallMessages(message){
		const { recallMessageAction, messages, userInfo,selectNav,selectConversationId,unReadMsgCountAction } = this.props;
		const conversationId = message[0].conversationId();
		var msgs = messages[conversationId];
		var messageText;
		var textMsgBody;
		var textRecvMsg;
		var conversationType = message[0].chatType();
		var conversation = this.chatManager.conversationWithType(conversationId, conversationType);
		var recallMsgUser = message[0].from() == userInfo.user.easemobName ? "您" : message[0].from();
		messageText = `${recallMsgUser} 撤回了一条消息`;
		textMsgBody = new easemob.EMTextMessageBody(messageText);
		textRecvMsg = easemob.createReceiveMessage(conversationId, userInfo.user.easemobName, textMsgBody);
		textRecvMsg.setFrom("system");
		recallMessageAction({
				messages: msgs,
				id: message[0].conversationId(),
				recallMsg: message[0],
				insertMsg: textRecvMsg,
				conversation
		});
		if(selectNav == ROUTES.chats.recents.__ && conversationId == selectConversationId){
			let res = conversation.markMessageAsRead(textRecvMsg.msgId(),true);
			res && unReadMsgCountAction({ id: conversationId, unReadMsg: [] });
		}else{
			unReadMsgCountAction({ id: conversationId, unReadMsg: [textRecvMsg.msgId()] });
		}
	}

	// 我接收到自动进群时被触发
	// group : 发生操作的群组
	// inviter : 邀请人
	// inviteMessage : 邀请信息
	onAutoAcceptInvitationFromGroup(groupId, inviter, inviteMessage){
		const {msgsOfConversation,receiveJoinGroupAction} = this.props;
		var me = this;
		var conversation;
		var messageText;
		this.groupManager.fetchGroupSpecification(groupId,true).then(res => {
			var group = this.groupManager.groupWithId(groupId);
			console.log("\n\n EMGroupManagerListener onAutoAcceptInvitationFromGroup ----- !");
			console.log(`group.groupId() = ${group.groupId()}`);
			console.log(`group.groupSubject() = ${group.groupSubject()}`);
			console.log(`group.groupDescription() = ${group.groupDescription()}`);
			console.log(`inviter = ${inviter}`);
			console.log(`inviteMessage = ${inviteMessage}`);
			const {
				userInfo,
			} = this.props;
	
			
			conversation = this.chatManager.conversationWithType(groupId, 1);
			var messages = conversation.loadMoreMessagesByMsgId("", 20,0);
			msgsOfConversation({ id: groupId, msgs: messages, conversation });
			receiveJoinGroupAction(
				{
					id: group.groupId(),
					inviter,
					members: [userInfo.user.easemobName],
					conversation,
					inviterRealName: inviter,
				}
			);
		});
		
	}

	// 添加群管理员时触发(只有是自己时才能收到通知)
	// group : 发生操作的群组
	// admin : 被提升的群管理员
	onAddAdminFromGroup(groupId, admin){
		const {msgsOfConversation,selectConversationId} = this.props;
		var group = this.groupManager.groupWithId(groupId);
		this.groupManager.fetchGroupSpecification(groupId).then(res => {
					
		});
		this.groupManager.fetchGroupMembers(groupId, "", 200).then((res) => {

		},(error) => {});
		console.log("\n\n EMGroupManagerListener onAddAdminFromGroup ----- !");
		console.log(`group.groupId() = ${group.groupId()}`);
		console.log(`group.groupSubject() = ${group.groupSubject()}`);
		console.log(`group.groupDescription() = ${group.groupDescription()}`);
		console.log(`admin = ${admin}`);
		let conversation = this.chatManager.conversationWithType(groupId, 1);
		var messages = conversation.loadMoreMessagesByMsgId("", 20,0);
		msgsOfConversation({ id: groupId, msgs: messages, conversation });
		if(groupId == selectConversationId)
		{
			conversationOfSelect("");
			conversationOfSelect(selectConversationId);
		}
	}

	// 删除群管理员时触发(只有是自己时才能收到通知)
	// group : 发生操作的群组
	// admin : 被删除的群管理员（群管理员变成普通群成员）
	onRemoveAdminFromGroup(groupId, admin){
		var group = this.groupManager.groupWithId(groupId);
		this.groupManager.fetchGroupSpecification(groupId).then(res => {
					
		});
		this.groupManager.fetchGroupMembers(groupId, "", 200).then((res) => {

		},(error) => {});
		console.log("\n\n EMGroupManagerListener onRemoveAdminFromGroup ----- !");
		console.log(`group.groupId() = ${group.groupId()}`);
		console.log(`group.groupSubject() = ${group.groupSubject()}`);
		console.log(`group.groupDescription() = ${group.groupDescription()}`);
		console.log(`admin = ${admin}`);
		const { msgsOfConversation,selectConversationId } = this.props;
		let conversation = this.chatManager.conversationWithType(groupId, 1);
		var messages = conversation.loadMoreMessagesByMsgId("", 20,0);
		msgsOfConversation({ id: groupId, msgs: messages, conversation });
		if(groupId == selectConversationId)
		{
			conversationOfSelect("");
			conversationOfSelect(selectConversationId);
		}
	}

	// 转让群主的时候触发
	// group : 发生操作的群组
	// newOwner : 新群主
	// oldOwner : 原群主
	onAssignOwnerFromGroup(groupId, newOwner, oldOwner){
		var group = this.groupManager.groupWithId(groupId);
		this.groupManager.fetchGroupSpecification(groupId).then(res => {
					
		});
		this.groupManager.fetchGroupMembers(groupId, "", 200).then((res) => {

		},(error) => {});
		console.log("\n\n EMGroupManagerListener onAssignOwnerFromGroup ----- !");
		console.log(`group.groupId() = ${group.groupId()}`);
		console.log(`group.groupSubject() = ${group.groupSubject()}`);
		console.log(`group.groupDescription() = ${group.groupDescription()}`);
		console.log(`newOwner = ${newOwner}`);
		console.log(`oldOwner = ${oldOwner}`);
		const { msgsOfConversation,selectConversationId } = this.props;
		let conversation = this.chatManager.conversationWithType(groupId, 1);
		var messages = conversation.loadMoreMessagesByMsgId("", 20,0);
		msgsOfConversation({ id: groupId, msgs: messages, conversation });
		if(groupId == selectConversationId)
		{
			conversationOfSelect("");
			conversationOfSelect(selectConversationId);
		}
	}

	// 成员加入群组时触发
	// group : 发生操作的群组
	// member : 加入群组的成员名称
	onMemberJoinedGroup(groupId, member){
		var conversation; // 不能删
		var textMsgBody;
		var textRecvMsg;
		var msgs;
		var group = this.groupManager.groupWithId(groupId);
		const {
			inviteMemberAction,
			conversations,
			messages,
			receiveMsgAction,
			selectConversationId,
			userInfo,
			selectNav,
			unReadMsgCountAction
		} = this.props;
		this.groupManager.fetchGroupSpecification(groupId).then(res => {
					
		});
		this.groupManager.fetchGroupMembers(groupId, "", 200).then((res) => {

		},(error) => {});
		msgs = messages[group.groupId()] || [];
		conversation = this.chatManager.conversationWithType(group.groupId(), 1);
		{
			textMsgBody = new easemob.EMTextMessageBody(`${member} 加入群`);
			textRecvMsg = easemob.createReceiveMessage(group.groupId(), userInfo.user.easemobName, textMsgBody);
			textRecvMsg.setFrom("system");
			if(msgs[msgs.length - 1]){
				textRecvMsg.setLocalTime(msgs[msgs.length - 1].localTime() + 1);
				textRecvMsg.setTimestamp(msgs[msgs.length - 1].timestamp() + 1);
			}
			else{
				textRecvMsg.setLocalTime(moment().format("x"));
				textRecvMsg.setTimestamp(moment().format("x"));
			}
			conversation.insertMessage(textRecvMsg);
			msgs.push(textRecvMsg);
			receiveMsgAction(
				{
					messages: msgs,
					selectConversationId,
					id: group.groupId(),
					user: userInfo.user.easemobName,
					conversation,
					unReadMsg:[textRecvMsg.msgId()]
				}
			);
			if(selectNav == ROUTES.chats.recents.__ && conversation.conversationId() == selectConversationId){
				let res = conversation.markAllMessagesAsRead();
				res && unReadMsgCountAction({ id: conversation.conversationId(), unReadMsg: [] });
			}
		}
	}

	// 成员离开群组时触发
	// group : 发生操作的群组
	// member : 离开群组的成员名称
	onMemberLeftGroup(groupId, member){
		var conversation; // 不能删
		var textMsgBody;
		var textRecvMsg;
		var msgs;
		this.groupManager.fetchGroupSpecification(groupId).then(res => {
					
		});
		this.groupManager.fetchGroupMembers(groupId, "", 200).then((res) => {

		},(error) => {});
		var group = this.groupManager.groupWithId(groupId);
		

		console.log("\n\n EMGroupManagerListener onMemberLeftGroup ----- !");
		console.log(`${member} has left the group ${group.groupId()}`);
		console.log(`group.groupSubject() = ${group.groupSubject()}`);
		console.log(`group.groupDescription() = ${group.groupDescription()}`);
		console.log(`group.groupMembers() = ${group.groupMembers()}`);

		const { userInfo, messages,msgsOfConversation,receiveMsgAction,selectConversationId,unReadMsgCountAction,selectNav } = this.props;
		conversation = this.chatManager.conversationWithType(group.groupId(), 1);
		//{
			textMsgBody = new easemob.EMTextMessageBody(`${member} 离开群`);
			textRecvMsg = easemob.createReceiveMessage(group.groupId(), userInfo.user.easemobName, textMsgBody);
			textRecvMsg.setFrom("system");
			msgs = messages[group.groupId()] || [];
			if(msgs[msgs.length - 1]){
				textRecvMsg.setLocalTime(msgs[msgs.length - 1].localTime() + 1);
				textRecvMsg.setTimestamp(msgs[msgs.length - 1].timestamp() + 1);
			}
			else{
				textRecvMsg.setLocalTime(moment().format("x"));
				textRecvMsg.setTimestamp(moment().format("x"));
			}
			msgs.push(textRecvMsg);
			conversation.insertMessage(textRecvMsg);
		//}
		msgsOfConversation({ id: groupId, msgs, conversation });
		msgs.push(textRecvMsg);
		receiveMsgAction(
			{
				messages: msgs,
				selectConversationId,
				id: group.groupId(),
				user: userInfo.user.easemobName,
				conversation,
				unReadMsg:[textRecvMsg.msgId()]
			}
		);
		if(selectNav == ROUTES.chats.recents.__ && conversation.conversationId() == selectConversationId){
			let res = conversation.markAllMessagesAsRead();
			res && unReadMsgCountAction({ id: conversation.conversationId(), unReadMsg: [] });
		}
	}

	// 离开群组时触发
	// group : 发生操作的群组
	// reason : 离开群组的原因（0: 被踢出 1:群组解散 2:被服务器下线）
	onLeaveGroup(groupId, reason){
		var group = this.groupManager.groupWithId(groupId);
		console.log("\n\n EMGroupManagerListener onLeaveGroup ----- !");
		console.log(`group.groupId() = ${group.groupId()}`);
		console.log(`group.groupSubject() = ${group.groupSubject()}`);
		console.log(`group.groupDescription() = ${group.groupDescription()}`);
		console.log(`reason = ${reason}`);
		const { leaveGroupAction, setNotice } = this.props;
		switch(reason){
		case 0: // 被踢
			this.chatManager.removeConversation(group.groupId());
			leaveGroupAction(group.groupId());
			setNotice(`您已被群主踢出${group.groupSubject()}群组`);
			break;
		case 1: // 群组解散
			this.chatManager.removeConversation(group.groupId());
			leaveGroupAction(group.groupId());
			setNotice(`群主已解散${group.groupSubject()}群组`);
			break;
		default:
			break;
		}
	}


	// 收到邀请别人入群同意消息
	onReceiveInviteAcceptionFromGroup(group, invitee){
		const { inviteMemberAction } = this.props;
		inviteMemberAction({ id: group.groupId(), members: [invitee] });
	}

	onRecvCallIncoming(callsession){
		const {setsession,video1v1} = this.props;
		if(video1v1.callsession){
			// 忙碌
			this.callManager.asyncEndCall(callsession,3);
			return;
		}
		setsession({callsession});
		console.log("onRecvCallIncoming");
		console.log(`${callsession}`);
	}
	onRecvCallConnected(callsession)
	{
		console.log("onRecvCallConnected");
		console.log(`${callsession}`);
		//document.getElementById("callState").textContent = "与" + callsession.getRemoteName() + " 的" + (callsession.getType() == 0?"音频":"视频") + " 连接中...";
	}
	onRecvCallAccepted(callsession)
	{
		const {setsession} = this.props;
		console.log("onRecvCallAccepted");
		console.log(`${callsession}`);
		console.log(callsession.getStatus());
		setsession({callsession,startTime:new Date()});
		//document.getElementById("callState").textContent = "与" + callsession.getRemoteName() + " 的" + (callsession.getType() == 0?"音频":"视频") + " 通话中...";
	}
	onRecvCallEnded(callsession,reason,error){
		const {video1v1,endcall,selectConversationId,selectNav,receiveMsgAction,unReadMsgCountAction,userInfo,messages,setNotice} = this.props;
		console.log("onRecvCallEnded");
		console.log(`${callsession}`);
		console.log(`reason:${reason}`);
		console.log(`errorcode:${error.errorCode}`);
		console.log(`errorcode:${error.description}`);
		console.log("status:" + callsession.getStatus());
		let from = callsession.getIsCaller()? userInfo.user.easemobName:callsession.getRemoteName();
		let to = callsession.getIsCaller()? callsession.getRemoteName():userInfo.user.easemobName;
		let msgText = callsession.getType() == 1? "视频":"语音";
		if(reason == 0)
		{
			if(video1v1.startTime)
			{
				let stopTime = new Date()
				let timeDiff = parseInt((stopTime.getTime() - video1v1.startTime.getTime())/1000);
				// 计时器
				function timer(time){
					var hour = parseInt(time / 3600);
					var minute = parseInt((time - hour * 3600) / 60);
					var second = (time % 60);
					hour = prefixInteger(hour, 2);
					minute = prefixInteger(minute, 2);
					second = prefixInteger(second, 2);
					return `${hour}:${minute}:${second}`;
				}
				function prefixInteger(num, n){
					return (Array(n).join(0) + num).slice(-n);
				}
				console.log("通话时长:" + timer(timeDiff));
				msgText += "通话时长:" + timer(timeDiff);
			}else{
				if(callsession.getIsCaller()){
					console.log("已取消");
					msgText += "已取消";
				}else{
					console.log("未接听");
					msgText += "未接听";
				}
			}
		}
		if(reason == 1)
		{
			console.log("无响应");
			msgText += "无响应";
		}
		if(reason == 2){
			console.log("已拒绝");
			msgText += "已拒绝";
		}
		if(reason < 3){
			let textMsgBody = new easemob.EMTextMessageBody(msgText);
			let	textRecvMsg = callsession.getIsCaller()?easemob.createSendMessage(from, to, textMsgBody):easemob.createReceiveMessage(from, to, textMsgBody);
			let conversation = this.chatManager.conversationWithType(callsession.getRemoteName(),0);
			var msgs = messages[callsession.getRemoteName()];
			conversation.insertMessage(textRecvMsg);
			msgs.push(textRecvMsg);
			receiveMsgAction(
			{
				messages: msgs,
				selectConversationId:callsession.getRemoteName(),
				id: callsession.getRemoteName(),
				user: userInfo.user.easemobName,
				conversation,
				unReadMsg:[textRecvMsg.msgId()]
			}
			);
			if(selectNav == ROUTES.chats.recents.__ && conversation.conversationId() == selectConversationId){
				let res = conversation.markAllMessagesAsRead();
				res && unReadMsgCountAction({ id: conversation.conversationId(), unReadMsg: [] });
			}
		}
		
		if(reason == 3){
			console.log("会话忙");
			setNotice("会话忙","fail");
		}
		if(reason == 4){
			console.log("会话连接失败");
			setNotice("会话连接失败","fail");
		}
		if(reason == 5){
			console.log("会话不支持");
			setNotice("会话不支持","fail");
		}
		if(reason == 6)
		{
			console.log("对方不在线");
			setNotice("对方不在线","fail");
		}
		endcall();
		if(video1v1.localvideocontrol && video1v1.localvideocontrol.srcObject)
		{
			video1v1.localvideocontrol.srcObject.getTracks().forEach((track) => {
				track.stop();
			})
			video1v1.localvideocontrol.pause();
			video1v1.localvideocontrol.srcObject = null;
		}
		if(video1v1.remotevideocontrol && video1v1.remotevideocontrol.srcObject)
		{
			video1v1.remotevideocontrol.srcObject.getTracks().forEach((track) => {
				track.stop();
			})
			video1v1.remotevideocontrol.pause();
			video1v1.remotevideocontrol.srcObject = null;
		}
	}
	onRecvCallNetworkStatusChanged(callsession,toStatus){
		const {setNotice} = this.props;
		console.log("onRecvCallNetworkStatusChanged");
		console.log(`${callsession}`);
		console.log(`toStatus:${toStatus}`);
		if(toStatus == 0){
			setNotice("会话连接成功");
		}else if(toStatus == 1){
			setNotice("会话不稳定");
		}else if(toStatus == 2){
			setNotice("会话断开")
		}
	}

	onRecvCallStateChanged(callsession,type){
		const {setNotice} = this.props;
		console.log("onRecvCallStateChanged");
		console.log(`${callsession}`);
		console.log(`type:${type}`);
		if(type == 0){
			setNotice("音频暂停");
		}else if(type == 1){
			setNotice("音频恢复");
		}else if(type == 2){
			setNotice("视频暂停");
		}else if(type == 3){
			setNotice("视频恢复")
		}
	}

	getLocalStream(localStream)
	{
		const {video1v1,setsession} = this.props;
		video1v1.localvideocontrol.srcObject = localStream;
		setsession({localStream});
	}
	getRemoteStream(remoteStream)
	{
		const {video1v1,setsession} = this.props;
		video1v1.remotevideocontrol.srcObject = remoteStream;
		setsession({remoteStream});
	}
	setSendPushMessage(from,to,type){
		const {video1v1,messages,receiveMsgAction,unReadMsgCountAction,selectNav,selectConversationId} = this.props;
		let textMsgBody = new easemob.EMTextMessageBody(type == 0?"语音未接听":"视频未接听");
		let textMsg = easemob.createSendMessage(from, to, textMsgBody);
		let callback = new easemob.EMCallback();
	   
		textMsg.setCallback(callback)
		this.chatManager.sendMessage(textMsg);
		this.callManager.asyncEndCall(video1v1.callsession.getCallId(),6);

		let conversation = this.chatManager.conversationWithType(to,0);
		var msgs = messages[to];
		conversation.insertMessage(textMsg);
		msgs.push(textMsg);
		receiveMsgAction(
			{
				messages: msgs,
				selectConversationId:to,
				id: to,
				user: from,
				conversation,
				unReadMsg:[textMsg.msgId()]
			});
		if(selectNav == ROUTES.chats.recents.__ && conversation.conversationId() == selectConversationId){
				let res = conversation.markAllMessagesAsRead();
				res && unReadMsgCountAction({ id: conversation.conversationId(), unReadMsg: [] });
			}
	}

	onMessageAttachmentsStatusChanged(message,error){
		console.log("onMessageAttachmentsStatusChanged");
		alert("aa");
		let msg = message.bodies()[0];
		console.log(msg.downloadStatus());
		console.log(msg);
		console.log(msg.remotePath(),msg.localPath(),msg.type());
	}

	// 收到消息回调，图片文件类型需要 download
	onReceiveMsg(msgs){
		const {
			messages,
			allMembersInfo,
			receiveMsgAction,
			selectConversationId,
			userInfo,
			conversations,
			groupAtAction,
			setGroupChats,
			globals,
			selectNav,
			unReadMsgCountAction
		} = this.props;
		var conversation;
		var conversationType;
		var inviterConversation;

		var atMsg;
		var msg;
		var me = this;
		console.log("receive msg:" + msgs);
		msgs.forEach(function(message){
			var conversationId = message.conversationId();
			var conversationOfMessages;
			var conference = message.getAttribute("conference");
			let logintoken = me.emclient.getLoginInfo().loginToken;
			let duplicate = false;
			conversationOfMessages = messages[conversationId] || [];
			for(let index = 0;index < conversationOfMessages.length;index++){
				if(conversationOfMessages[index].msgId() == message.msgId())
				{
					console.log("message exist:"+message.msgId());
					duplicate = true;
				}
			}
			msg = message.bodies()[0];
			console.log("type:" + msg.type());
			switch(msg.type()){
			case 1: // image message
				me.chatManager.downloadMessageAttachments(message);
				me.chatManager.downloadMessageThumbnail(message);
				break;
			case 2: // file message
			case 4:
				me.chatManager.downloadMessageAttachments(message);
				break;
			default:
				break;
			}

			// console.log(msgs[0].getAttribute("em_at_list"));
			// 有人 @ 我
			atMsg = message.getAttribute("em_at_list");
			if(
				atMsg &&
			(
				atMsg.indexOf(userInfo.user.easemobName) > -1 ||
				(typeof atMsg == "string" && atMsg.toLowerCase() == "all")
			)

			){
				groupAtAction({ [conversationId]: [userInfo.user.easemobName] });
			}
			conversationType = message.chatType();	// 0 单聊  1 群聊
			conversation = me.chatManager.conversationWithType(conversationId, conversationType);
			!conference && !duplicate && conversationOfMessages.push(message);

			// 根据窗体显示状态和是否选中来判断
			let asread = false;
			if(selectNav == ROUTES.chats.recents.__ && conversationId == selectConversationId){
				let res = conversation.markMessageAsRead(message.msgId(),true);
				console.log("res:" + res);
				unReadMsgCountAction({ id: conversationId, unReadMsg: [] });
				asread = true;
			}

			// 先判断是不是群组， 再判断下群组列表里有没有这个群组，没有的话去取一下群信息
			if(conversationType == 1 && (!conversations[conversationId])){
				this.groupManager.fetchAllMyGroups().then(res => {
					if(res.code != 0)
					{
						console.log("fetchMyGroup fail:" + res.description);
					}
					let allGroups = [];
					res.data.map((group) => {
						allGroups.push(group.groupId());
					});
					setGroupChats({allGroups});
				});
		    }
			receiveMsgAction(
				{
					messages: conversationOfMessages,
					selectConversationId,
					id: conversationId,
					user: userInfo.user.easemobName,
					conversation,
					unReadMsg: asread ? [] : [message.msgId()]
				}
			);
		});


	}
	render(){
		return (
			<div className="oa-main-container">
				<TopNav {...this.props}/>
				<div className="nav-container">
					<Navbar className="dock-left primary shadow-2" />
					<Container />
				</div>
			</div>);

	}
}
const mapStateToProps = state => ({
	globals: state.globals,
	userInfo: state.userInfo,
	selectConversationId: state.selectConversationId,
	allMembersInfo: state.allMembersInfo,
	messages: state.messages,
	conversations: state.conversations,
	selectMember: state.selectMember,
	memberOfSelect: state.memberOfSelect,
	msgsOfConversation: state.msgsOfConversation,
	selectNav:state.selectNav,
	video1v1:state.video1v1
});
export default withRouter(connect(mapStateToProps, actionCreators)(MainView));

import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as actionCreators from "@/stores/actions";
import { Menu, Badge } from "antd";
import { ipcRenderer } from "electron";
import moment from "moment";
import HeadImageView from "../../common/head_image";
import _ from "underscore";
import { msgParse } from "@/utils/msg_parse";
import * as selectors from "@/stores/selectors";
import CreateGroupView from "../groups/group_create";

class ConversationListView extends Component {

	constructor(props){
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
		this.handleContextMenu = this.handleContextMenu.bind(this);
		this.state = {
			searchVal: ""
		};

	}

	handleContextMenu(e, conversationId){
		const { globals, deleteConversationAction } = this.props;

		ipcRenderer.on("deleteConversation", (event, { conversationId }) => {
			deleteConversationAction(conversationId);
			globals.chatManager.removeConversation(conversationId, false); // 第二个参数 true 删除聊天记录 false 不删除聊天记录
			ipcRenderer.removeAllListeners("deleteConversation");  // 移除所有监听
		});

		ipcRenderer.send("conversation-context-menu", conversationId);
	}

	handleClick(e){
		const key = e.key.substr(0,e.key.length-1);
		const isGroup = e.key.substr(key.length);
		console.log(key + "  ||  " + isGroup);
		this.handleSelect(key,isGroup);

		// 取某一个的会话信息
		// 0 单聊 1 群聊 2 聊天室
		// conversation = globals.chatManager.conversationWithType(key, 0);

		// firstLatestMessage = conversation.latestMessage();
		// 第二个参数省略是最后一条消息的 ID
		// messages = conversation.loadMoreMessages(0, "", 20);
		// msgsOfConversation({ id: key, msgs: messages, conversation });
	}

	handleSelect(key,isGroup){
		const {
			conversationOfSelect,
			globals,
			allMembersInfo,
			setNotice,
			userInfo,
			getMemberInfoAction,
			setSelectConvType
		} = this.props;
		var group;
		var groupInfo;
		var groupMembers = [];
		var me = this;
		this.easemob = globals.easemob;
		// 如果是群组，需要从 sdk 获取群信息跟新 reuducer，(除了头像、昵称、是否允许普通成员邀请群成员)
		console.log("isGroup:" + isGroup);
		if(isGroup == "1"){
			group = globals.groupManager.groupWithId(key);
			if(group.groupMembers().length == 0){
				globals.groupManager.fetchGroupSpecification(key).then(res => {
					
				});
				globals.groupManager.fetchGroupMembers(key, "", 500).then((res) => {

				},(error) => {});
			}
			groupInfo = {
				owner: group.groupOwner(),
				members: group.groupMembers(),
				adminMembers: group.groupAdmins()
			};
			// 取某一个的会话信息
			// 0 单聊 1 群聊 2 聊天室
			me.handleSelectConversation(key, 1);

			groupMembers = [group.groupOwner()].concat(group.groupMembers()).concat(group.groupAdmins());
		}
		else{
			me.handleSelectConversation(key, 0);
		}
	}

	handleSelectConversation(key, type){
		const {
			conversationOfSelect,
			messages,
			selectConversationOfList,
			globals,
			unReadMsgCountAction,
			conversations,
			setSelectConvType
		} = this.props;
		// var messages;
		var conversation;
		var isAllRead = false;
		console.log("selecttId:" + key);
		conversationOfSelect(key);
		// 取某一个的会话信息
		// // 0 单聊 1 群聊 2 聊天室
		conversation = globals.chatManager.conversationWithType(key, type);
		conversation.sortTime = conversations[key].sortTime;
		// messages = conversation.loadMoreMessages(0, "", 20);
		isAllRead = conversation.markAllMessagesAsRead(); // 将这个会话的所有消息标记为已读
		isAllRead && unReadMsgCountAction({ id: key, unReadMsg: [] });
		selectConversationOfList({ id: key, msgs: messages[key], conversation });
		setSelectConvType(type);
	}

	// 最后一条消息的时间，今天: 具体时间  其他时间：日期  没有最后一条消息则时间为空
	showTime(latestMessage){
		var dateTime = latestMessage.timestamp();
		if(latestMessage.bodies()){
			const today = moment().format("YY/MM/DD");
			const dateOfLastMsg = moment(dateTime).format("YY/MM/DD");
			if(dateOfLastMsg == today){
				return moment(dateTime).format("HH:mm");
			}
			return dateOfLastMsg;
		}
		return "";
	}

	latestMessage(conversationId, isGroup){
		const { messages, allMembersInfo,globals } = this.props;
		var latestMessage;
		var latestMessageFrom = "";
		var latestMessageFromRealName = "";
		var msgs = messages[conversationId];
		if(msgs && msgs.length > 0){
			latestMessage = msgParse(msgs[msgs.length - 1]);
			// latestMessageFrom = isGroup ? `${allMembersInfo[msgs[msgs.length - 1].from()].realName}:` : "";
			latestMessageFrom = allMembersInfo[msgs[msgs.length - 1].from()];
			if(isGroup && latestMessageFrom){
				let conversation = globals.chatManager.conversationWithType(conversationId,1);
				latestMessageFromRealName = `${conversation.latestMessage().from()}`;
			}else{
				let conversation = globals.chatManager.conversationWithType(conversationId,0);
				latestMessageFromRealName = `${conversation.latestMessage().from()}`;
			}
			switch(latestMessage.type){
			case "TEXT":
			case "IMAGE":
			case "FILE":
			case "OTHER":
				return `${latestMessageFromRealName}:${latestMessage.shortVal}`;
			default:
				return `${latestMessageFromRealName}:${latestMessage.shortVal}`;
			}
		}
		return "";
	}

	showConversationList(){
		const {
			selectConversationId,
			conversationsSort,
			conversations,
			unReadMessageCount,
			allMembersInfo,
			groupAtMsgs,
			allContacts,
			isSelectCovGroup,
			globals
		} = this.props;
		var groupManager = globals.groupManager;
		console.log("selectconvkey:" + selectConversationId + isSelectCovGroup);
		return (
			<Menu
				mode="inline"
				onOpenChange={ this.onOpenChange }
				onClick={ this.handleClick }
				style={ { border: "none", width: "240px" } }
				selectedKeys={ [selectConversationId + isSelectCovGroup] }
			>
				{
					conversationsSort.map((item) => {
						const conversationType = item.conversationType();
						const conversationId = item.conversationId();
						const selectGroup = conversationType == 1;
						let arrContacs = allContacts.contacts;
						const selectMember = conversationId == 0;
						let param = conversationId + conversationType;

						return (
							//key传参为会话id+会话类型
							<Menu.Item 
							key={ param}>
								<HeadImageView/>
								<div onContextMenu={ e => this.handleContextMenu(e, item.conversationId()) }>
									<div className="item-top">
										<span className="ellipsis item-name">
											{/* { selectGroup ? selectGroup.chatName : selectMember.realName } */}
											{
												selectGroup
													? groupManager.groupWithId(conversationId).groupSubject()
													: (item.conversationId())
											}
										</span>
										{/* <span>{this.showTime(item.latestMessage())}</span> */}
										{/* 未读消息数 */}
										<Badge
											count={
												item.conversationId() == selectConversationId
													? 0
													: (unReadMessageCount[item.conversationId()] || []).length
											}
										/>
									</div>
									<div className="ellipsis item-last-msg">
										{/* // 这个会话里有人 @ 我 */}
										{
											groupAtMsgs[item.conversationId()]
												? <span style={ { color: "red" } }>[@我]</span>
												: null
										}
										{ this.latestMessage(item.conversationId(), selectGroup) }
									</div>
								</div>
							</Menu.Item>
						);
					})
				}
			</Menu>
		);
	}

	render(){
		const {
			networkConnection
		} = this.props;

		return (
			<div className="oa-main-list oa-conversation-list oa-conversation-serarch-list" >
				{
					networkConnection
						? <div className="network-state">网络连接已断开</div>
						: null
				}
				<div className="conversation-serach">
					<CreateGroupView></CreateGroupView>
				</div>

				{ this.showConversationList() }

			</div>
		);
	}
}

const mapStateToProps = state => ({
	networkConnection: state.networkConnection,
	selectConversationId: state.selectConversationId,
	conversations: state.conversations,
	unReadMessageCount: state.unReadMessageCount,
	allMembersInfo: state.allMembersInfo,
	searchConversation: state.searchConversation,
	globals: state.globals,
	messages: state.messages,
	conversationsSort: selectors.conversationsSort(state),
	groupAtMsgs: state.groupAtMsgs,
	allContacts: state.allContacts,
	isSelectCovGroup: state.isSelectCovGroup
});
export default withRouter(connect(mapStateToProps, actionCreators)(ConversationListView));

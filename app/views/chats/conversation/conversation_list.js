import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as actionCreators from "@/stores/actions";
import { Menu, Badge, Input, AutoComplete, Icon } from "antd";
import { ipcRenderer } from "electron";
import moment from "moment";
import api from "@/api";
import HeadImageView from "../../common/head_image";
import _ from "underscore";
import { msgParse } from "@/utils/msg_parse";
import * as selectors from "@/stores/selectors";
import CreateGroupView from "../groups/group_create";
import SearchView from "./search";
const Option = AutoComplete.Option;
const OptGroup = AutoComplete.OptGroup;

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
		const key = e.key;
		this.handleSelect(key);

		// 取某一个的会话信息
		// 0 单聊 1 群聊 2 聊天室
		// conversation = globals.chatManager.conversationWithType(key, 0);

		// firstLatestMessage = conversation.latestMessage();
		// 第二个参数省略是最后一条消息的 ID
		// messages = conversation.loadMoreMessages(0, "", 20);
		// msgsOfConversation({ id: key, msgs: messages, conversation });
	}

	handleSelect(key){
		const {
			conversationOfSelect,
			globals,
			groupChats,
			changeGroupInfoAction,
			allMembersInfo,
			setNotice,
			userInfo,
			requestMemberInfo,
			getMemberInfoAction
		} = this.props;
		var group;
		var groupInfo;
		var groupMembers = [];
		var me = this;
		this.easemob = globals.easemob;
		this.error = new this.easemob.EMError();
		// 如果是群组，需要从 sdk 获取群信息跟新 reuducer，(除了头像、昵称、是否允许普通成员邀请群成员)
		if(!!groupChats[key]){
			group = globals.groupManager.groupWithId(key);
			if(group.groupMembers().length == 0){
				group = globals.groupManager.fetchGroupSpecification(key, this.error);
				globals.groupManager.fetchGroupMembers(key, "", 500, this.error);
			}
			groupInfo = {
				owner: group.groupOwner(),
				members: group.groupMembers(),
				adminMembers: group.groupAdmins()
			};
			changeGroupInfoAction({ id: [key], groupInfo });
			// 取某一个的会话信息
			// 0 单聊 1 群聊 2 聊天室
			me.handleSelectConversation(key, 1);

			groupMembers = [group.groupOwner()].concat(group.groupMembers()).concat(group.groupAdmins());
			// 群组成员不存的，去请求获取信息
			_.map(groupMembers, (member) => {
				!allMembersInfo[member] && requestMemberInfo(userInfo.user.tenantId, member);
			});
		}
		else if(allMembersInfo[key]){
			me.handleSelectConversation(key, 0);
		}
		else{
			api.getMemberInfo(userInfo.user.tenantId, key)
			.done(function(data){
				getMemberInfoAction(data);
				me.handleSelectConversation(key, 0);
			})
			.fail(function(){
				conversationOfSelect("");
				setNotice("会话不存在，你可能已被移除");
			});
		}
	}

	handleSelectConversation(key, type){
		const {
			conversationOfSelect,
			messages,
			selectConversationOfList,
			globals,
			unReadMsgCountAction,
			conversations
		} = this.props;
		// var messages;
		var conversation;
		var isAllRead = false;
		conversationOfSelect(key);
		// 取某一个的会话信息
		// // 0 单聊 1 群聊 2 聊天室
		conversation = globals.chatManager.conversationWithType(key, type);
		conversation.sortTime = conversations[key].sortTime;
		// messages = conversation.loadMoreMessages(0, "", 20);
		isAllRead = conversation.markAllMessagesAsRead(); // 将这个会话的所有消息标记为已读
		isAllRead && unReadMsgCountAction({ id: key, unReadMsg: [] });
		selectConversationOfList({ id: key, msgs: messages[key], conversation });
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
		const { messages, allMembersInfo } = this.props;
		var latestMessage;
		var latestMessageFrom = "";
		var latestMessageFromRealName = "";
		var msgs = messages[conversationId];
		if(msgs && msgs.length > 0){
			latestMessage = msgParse(msgs[msgs.length - 1]);
			// latestMessageFrom = isGroup ? `${allMembersInfo[msgs[msgs.length - 1].from()].realName}:` : "";
			latestMessageFrom = allMembersInfo[msgs[msgs.length - 1].from()];
			if(isGroup && latestMessageFrom){
				latestMessageFromRealName = `${latestMessageFrom.realName || latestMessageFrom.username}:`;
			}
			switch(latestMessage.type){
			case "TEXT":
			case "IMAGE":
			case "FILE":
			case "OTHER":
				return `${latestMessageFromRealName}${latestMessage.shortVal}`;
			default:
				return `${latestMessageFromRealName}${latestMessage.shortVal}`;
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
			groupChats,
			groupAtMsgs
		} = this.props;
		return (
			<Menu
				mode="inline"
				onOpenChange={ this.onOpenChange }
				onClick={ this.handleClick }
				style={ { border: "none", width: "240px" } }
				selectedKeys={ [selectConversationId] }
			>
				{
					conversationsSort.map((item) => {
						const selectGroup = groupChats[item.conversationId()];
						const selectMember = allMembersInfo[item.conversationId()];
						return (
							<Menu.Item key={ item.conversationId() }>
								<HeadImageView
									imgUrl={
										selectGroup
											? selectGroup.avatar
											: (selectMember ? selectMember.image : "")
									}
									name={
										selectGroup
											? selectGroup.chatName
											: (selectMember ? selectMember.realName : "")
									}
								/>
								<div onContextMenu={ e => this.handleContextMenu(e, item.conversationId()) }>
									<div className="item-top">
										<span className="ellipsis item-name">
											{/* { selectGroup ? selectGroup.chatName : selectMember.realName } */}
											{
												selectGroup
													? selectGroup.chatName
													: (selectMember ? selectMember.realName || selectMember.username : "")
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
			networkConnection,
			searchConversation
		} = this.props;
		const options = _.values(searchConversation).map(conversation => (
			<OptGroup
				style={ { width: 240, border: "none" } }
				allowClear={ true }
				key={ conversation.id }
			>
				<Option
					key={ conversation.easemobName || conversation.easemobGroupId }
					value={ conversation.easemobName || conversation.easemobGroupId }
				>
					<HeadImageView
						imgUrl={ conversation.avatar || conversation.image }
						name={ conversation.chatName || conversation.realName }
					/>
					<div className="item-top">
						<span className="ellipsis item-name">
							{ conversation.chatName || conversation.realName || conversation.username }
						</span>
					</div>
				</Option>
			</OptGroup>
		));


		return (
			<div className="oa-main-list oa-conversation-list oa-conversation-serarch-list" >
				{
					networkConnection
						? <div className="network-state">网络连接已断开</div>
						: null
				}
				<div className="conversation-serach">
					<SearchView />
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
	groupChats: state.groupChats,
	searchConversation: state.searchConversation,
	globals: state.globals,
	messages: state.messages,
	conversationsSort: selectors.conversationsSort(state),
	groupAtMsgs: state.groupAtMsgs
});
export default withRouter(connect(mapStateToProps, actionCreators)(ConversationListView));

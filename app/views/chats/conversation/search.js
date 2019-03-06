import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as actionCreators from "@/stores/actions";
import { Input, AutoComplete, Icon } from "antd";
import api from "@/api";
import HeadImageView from "../../common/head_image";
import _ from "underscore";
const Option = AutoComplete.Option;
const OptGroup = AutoComplete.OptGroup;

class SearchView extends Component {

	constructor(props){
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
		this.handleChangeSearchVal = this.handleChangeSearchVal.bind(this);
		this.state = {
			searchVal: ""
		};
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
			allMembersInfo,
			setNotice,
			userInfo,
			getMemberInfoAction,
			isSelectCovGroup
		} = this.props;
		var group;
		var groupInfo;
		var groupMembers = [];
		var me = this;
		this.easemob = globals.easemob;
		this.error = new this.easemob.EMError();
		// 如果是群组，需要从 sdk 获取群信息跟新 reuducer，(除了头像、昵称、是否允许普通成员邀请群成员)
		if(isSelectCovGroup){
			group = globals.groupManager.groupWithId(key);
			if(group.groupMembers().length == 0){
				globals.groupManager.fetchGroupSpecification(key, me.error).then(group => {
					
				});
				globals.groupManager.fetchGroupMembers(key, "", 500, me.error);
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
		const { conversationOfSelect, messages, msgsOfConversation, globals, unReadMsgCountAction } = this.props;
		// var messages;
		var conversation;
		var isAllRead = false;
		// 加 setTimeout 是为了解决搜索的下拉列表双击时会选中下拉列表中别的会话
		var timer = setTimeout(function(){
			conversationOfSelect(key);
			// 取某一个的会话信息
			// // 0 单聊 1 群聊 2 聊天室
			conversation = globals.chatManager.conversationWithType(key, type);
			// messages = conversation.loadMoreMessages(0, "", 20);
			isAllRead = conversation.markAllMessagesAsRead(); // 将这个会话的所有消息标记为已读
			isAllRead && unReadMsgCountAction({ id: key, unReadMsg: [] });
			msgsOfConversation({ id: key, msgs: messages[key], conversation });
			clearTimeout(timer);
		}, 200);
	}

	handleChangeSearchVal(value){
		const {
			searchGroupAction,
			userInfo
		} = this.props;
		var tenantId = userInfo.user.tenantId;
		// 搜索通讯录
		//requestSearchMember(tenantId, value, userInfo.user.easemobName);
		// 搜索群组
		//this.setState({
		//	searchVal: value
		//});
	}

	render(){
		const {
			membersOfSearchConcat,
			groupsOfSearchGroups
		} = this.props;
		var dataSource = [{
			title: "联系人",
			children: _.values(membersOfSearchConcat)
		}, {
			title: "群组",
			children: _.values(groupsOfSearchGroups)
		}];
		const options = dataSource.map(conversation => (
			<OptGroup
				style={ { width: 240, border: "none" } }
				allowClear={ true }
				key={ conversation.title }
			>
				{conversation.children.map(opt => (
					<Option
						key={ opt.easemobName || opt.easemobGroupId }
						value={ opt.easemobName || opt.easemobGroupId }
					>
						<HeadImageView
							imgUrl={ opt.avatar || opt.image }
							name={ opt.chatName || opt.realName }
						/>
						<div className="item-top ellipsis item-name">
							{ opt.chatName || opt.realName || opt.username }
						</div>
					</Option>
				))}
				{/* <Option
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
				</Option> */}
			</OptGroup>
		));


		return (
			<AutoComplete
				dataSource={ options }
				style={ { width: 180, margin: 15 } }
				onSelect={ this.handleSelect }
				onChange={ value => this.handleChangeSearchVal(value) }
				placeholder="搜索联系人、群组"
				dropdownMatchSelectWidth={ false }
				optionLabelProp={ options.length ? this.state.searchVal : "" }
				dropdownStyle={ { width: 220 } }
			>
				<Input suffix={ <Icon type="search" className="certain-category-icon" /> } />
			</AutoComplete>
		);
	}
}

const mapStateToProps = state => ({
	conversations: state.conversations,
	allMembersInfo: state.allMembersInfo,
	searchConversation: state.searchConversation,
	globals: state.globals,
	messages: state.messages,
	membersOfSearchConcat: state.searchConcatMembers,
	groupsOfSearchGroups: state.searchGroups,
	userInfo: state.userInfo,
});
export default withRouter(connect(mapStateToProps, actionCreators)(SearchView));
